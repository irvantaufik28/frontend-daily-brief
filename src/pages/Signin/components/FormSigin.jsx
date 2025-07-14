import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import example from "../../../assets/img/bg.webp";
import "../styles/formLogin.css";
import { useSelector } from "react-redux";
import { authSelector } from "../../../features/authSlice";

const FormSignin = (props) => {
  const errorMessage = useSelector(authSelector.errorMessage);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Username dan password wajib diisi!");
      return;
    }
    props.onSubmit(formData);
  };

  return (
    <div className="row">
      <div className="col-md-9">
        <img src={example} alt="hero" width="100%" height="100%" />
      </div>
      <div className="col-md-3">
        <div className="form-login">
          <h5>Welcome</h5>

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
                placeholder="Enter Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-grid gap-2 sign-button">
              <Button type="submit" variant="custome">
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FormSignin;
