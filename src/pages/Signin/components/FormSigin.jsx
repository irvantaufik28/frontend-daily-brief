import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import example from "../../../assets/img/bg.webp";
import "../styles/formLogin.css";
import { useSelector } from "react-redux";
import { authSelector } from "../../../features/authSlice";
import { Formik } from "formik";
import * as Yup from "yup";

const FormSignin = (props) => {
  const errorMessage = useSelector(authSelector.errorMessage);
  const loading = useSelector(authSelector.loading);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username wajib diisi"),
    password: Yup.string().required("Password wajib diisi"),
  });

  return (
    <div className="row">
      <div className="col-md-9">
        <img src={example} alt="hero" width="100%" height="100%" />
      </div>
      <div className="col-md-3">
        <div className="form-login">
          <h5>Welcome</h5>

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              props.onSubmit(values);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={touched.username && !!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2 sign-button">
                  <Button type="submit" variant="custome" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default FormSignin;
