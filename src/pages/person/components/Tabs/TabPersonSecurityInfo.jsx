import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2"; 
import config from "../../../../config";

const TabPersonSecurityInfo = () => {
  const { data } = useSelector((state) => state.person);

  // get username from redux
  const username = useMemo(() => data?.user?.username || "", [data]);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Password confirmation does not match")
      .required("Password confirmation is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Show confirmation alert first
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to change your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      setSubmitting(false);
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await axios.post(
        `${config.apiUrl}/person/update-password`,
        {
          username, // hidden but still sent
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.message === "success") {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been changed successfully. Please log in again with your new password.",
          timer: 3000,
          showConfirmButton: false,
        });
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.errors || "An error occurred while updating the password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bd-container-xl px-4">
      <h4 className="mb-3">Change Password</h4>

      <div className="row">
        <div className="col-md-6">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Old Password */}
                <div className="mb-3">
                  <label className="form-label">Currenct Password</label>
                  <Field type="password" name="oldPassword" className="form-control" />
                  <ErrorMessage name="oldPassword" component="div" className="text-danger small" />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <Field type="password" name="newPassword" className="form-control" />
                  <ErrorMessage name="newPassword" component="div" className="text-danger small" />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <Field type="password" name="confirmPassword" className="form-control" />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TabPersonSecurityInfo;
