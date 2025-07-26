import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { createReport, fetchReport } from "../../../features/reportSlice";

const validationSchema = Yup.object({
  projectId: Yup.number().required("Project is required"),
  personId: Yup.number().required("Person is required"),
  reportDate: Yup.date().required("Report date is required"),
  reports: Yup.array().of(
    Yup.object().shape({
      workedHour: Yup.number().required("Required").min(1, "Min 1 hour"),
      description: Yup.string().required("Required"),
    })
  ),
});

const ReportFormInput = () => {
  const { id } = useParams(); // <-- id report (jika edit)
  const dispatch = useDispatch();
  const reportData = useSelector((state) => state.report.data);
  const reportLoading = useSelector((state) => state.report.loading);
  const reportError = useSelector((state) => state.report.error);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    projectId: "",
    personId: "",
    reportDate: "",
    reports: [{ workedHour: "", description: "" }],
  });
  const [loading, setLoading] = useState(!!id && reportLoading);
  const [projects] = useState([{ id: 1, name: "Sistem Pelaporan Kinerja" }]);
  const [persons] = useState([{ id: 1, name: "Irvan Taufik" }]);

  useEffect(() => {
    if (id) {
      dispatch(fetchReport({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && reportData && Array.isArray(reportData.ReportDetail)) {
      setInitialValues({
        projectId: reportData.projectId ?? "",
        personId: reportData.personId ?? "",
        reportDate: reportData.reportDate?.slice(0, 10) ?? "",
        reports: reportData.ReportDetail.map((item) => ({
          workedHour: item.workedHour,
          description: item.description,
        })),
      });
      setLoading(false);
    }
  }, [reportData, id]);


  useEffect(() => {
    if (reportError) {
      Swal.fire("Error", "Failed to fetch report", "error");
      setLoading(false);
    }
  }, [reportError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const confirm = await Swal.fire({
      title: "Create Report?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) {
      setSubmitting(false);
      return;
    }

    try {
      Swal.fire({ title: "Submitting...", didOpen: () => Swal.showLoading() });
      const payload = {
        ...(id && { id }), // hanya kirim id jika ada (mode update)
        projectId: values.projectId,
        personId: values.personId,
        reportDate: values.reportDate,
        reports: values.reports,
      };

      // Hanya buat baru (no update)
      await dispatch(createReport(payload)).unwrap();

      await Swal.fire("Success", "Report created", "success");
      navigate("/manage-report");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit report", "error");
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>{id ? "Edit Report" : "Create Report"}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>Project</label>
              <Field as="select" name="projectId" className="form-control">
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="projectId" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label>Person</label>
              <Field as="select" name="personId" className="form-control">
                <option value="">Select Person</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="personId" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label>Report Date</label>
              <Field type="date" name="reportDate" className="form-control" />
              <ErrorMessage name="reportDate" component="div" className="text-danger" />
            </div>

            <FieldArray name="reports">
              {({ push, remove }) => (
                <div>
                  <h5>Report Entries</h5>
                  {values.reports.map((report, index) => (
                    <div className="border p-3 mb-" key={index}>
                      <div className="row">
                        <div className="col-md-1">
                          <label>Worked Hour</label>
                          <Field
                            as="select"
                            name={`reports.${index}.workedHour`}
                            className="form-control"
                          >
                            <option value="">Select hour</option>
                            {[...Array(24)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} Hour
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name={`reports.${index}.workedHour`}
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="col-md-9">
                          <label>Description</label>
                          <Field
                            as="textarea"
                            name={`reports.${index}.description`}
                            className="form-control"
                            rows={4} // bisa diubah ke 6 atau 8 jika ingin lebih besar
                            placeholder="Describe the work..."
                          />
                          <ErrorMessage
                            name={`reports.${index}.description`}
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => push({ workedHour: "2", description: "" })}
                  >
                    + Add Report
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : id ? "Update" : "Create"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/manage-report")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReportFormInput;
