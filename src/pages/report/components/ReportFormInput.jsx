import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { createReport, deleteReport, fetchReport } from "../../../features/reportSlice";
import { fetchProjects, projectSelector } from "../../../features/projectSlice";
import { clearMembers, fetchPersonProject, projectMemberSelector } from "../../../features/projectMemberSlice";

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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reportData = useSelector((state) => state.report.data);
  const reportLoading = useSelector((state) => state.report.loading);
  const reportError = useSelector((state) => state.report.error);

  const projects = useSelector(projectSelector.data);
  const persons = useSelector((state) => state.projectMember.data);
  const isDraft = reportData?.isDraft ?? false;

  const [initialValues, setInitialValues] = useState({
    projectId: null,
    personId: null,
    reportDate: "",
    reports: [{ workedHour: "", description: "" }],
  });

  const [loading, setLoading] = useState(!!id && reportLoading);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchReport({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && reportData?.ReportDetail?.length) {
      setInitialValues({
        projectId: reportData.projectId,
        personId: reportData.personId,
        reportDate: reportData.reportDate?.slice(0, 10),
        reports: reportData.ReportDetail.map((item) => ({
          workedHour: item.workedHour,
          description: item.description,
        })),
      });

      dispatch(fetchPersonProject({ projectId: reportData.projectId }));
      setLoading(false);
    }
  }, [reportData, id, dispatch]);

  useEffect(() => {
    if (reportError) {
      Swal.fire("Error", "Failed to fetch report", "error");
      setLoading(false);
    }
  }, [reportError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const confirm = await Swal.fire({
      title: id
        ? isDraft
          ? "Approve Draft Report?"
          : "Update Report?"
        : "Create Report?",
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
        ...(id && { id }),
        projectId: values.projectId,
        personId: values.personId,
        reportDate: values.reportDate,
        reports: values.reports,
        isDraft: false
      };

      await dispatch(createReport(payload)).unwrap();
      await Swal.fire(
        "Success",
        id
          ? isDraft
            ? "Draft Approved"
            : "Report updated"
          : isDraft
            ? "Draft created"
            : "Report created",
        "success"
      );

      navigate(isDraft ? "/manage-report/draft" : "/manage-report");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit report", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!id) {
      Swal.fire("Error", "Invalid report ID", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will reject the draft permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({ title: "Deleting...", didOpen: () => Swal.showLoading() });

      await dispatch(deleteReport(id)).unwrap();

      await Swal.fire("Reject!", "Draft has been deleted.", "success");
      navigate("/manage-report/draft");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete draft", "error");
    }
  };


  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>{id ? (isDraft ? "Edit Draft Report" : "Edit Report") : "Create Report"}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Project */}
            <div className="mb-3">
              <label>Project</label>
              <Field
                as="select"
                name="projectId"
                className="form-control"
                disabled={isDraft}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  setFieldValue("projectId", selectedId);
                  setFieldValue("personId", null);

                  dispatch(clearMembers());
                  if (selectedId) {
                    dispatch(fetchPersonProject({ projectId: selectedId }));
                  }
                }}
              >
                <option value="">Select Project</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="projectId" component="div" className="text-danger" />
            </div>

            {/* Person */}
            <div className="mb-3">
              <label>Person</label>
              <Field
                as="select"
                name="personId"
                className="form-control"
                disabled={!values.projectId || isDraft}
              >
                <option value="">Select Person</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="personId" component="div" className="text-danger" />
            </div>

            {/* Report Date */}
            <div className="mb-3">
              <label>Report Date</label>
              <Field type="date" name="reportDate" className="form-control" />
              <ErrorMessage name="reportDate" component="div" className="text-danger" />
            </div>

            {/* Report Entries */}
            <FieldArray name="reports">
              {({ push, remove }) => (
                <div>
                  <h5>Report Entries</h5>
                  {values.reports.map((report, index) => (
                    <div className="border p-3 mb-3" key={index}>
                      <div className="row">
                        <div className="col-md-2">
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
                        <div className="col-md-8">
                          <label>Description</label>
                          <Field
                            as="textarea"
                            name={`reports.${index}.description`}
                            className="form-control"
                            rows={3}
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
                            className="btn btn-danger w-100"
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
                    className="btn btn-outline-primary mt-2"
                    onClick={() => push({ workedHour: "", description: "" })}
                  >
                    + Add Report
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Actions */}
            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : id
                    ? isDraft
                      ? "Approve"
                      : "Update"
                    : "Create"} </button>
              {id && isDraft && (
                <button type="button" className="btn btn-danger" onClick={handleDeleteDraft}>
                  Reject
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/manage-report/draft")}
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