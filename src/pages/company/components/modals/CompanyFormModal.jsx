// CompanyFormModal.jsx
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const CompanyFormModal = ({ show, onHide, onSubmit, initialData }) => {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      altEmail1: initialData?.altEmail1 || "",
      altEmail2: initialData?.altEmail2 || "",
      altEmail3: initialData?.altEmail3 || "",
      phone: initialData?.phone || "",
      location: initialData?.location || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Company name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Company" : "Create Company"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {[
            { name: "name", label: "Company Name" },
            { name: "email", label: "Email" },
            { name: "altEmail1", label: "Alt Email 1" },
            { name: "altEmail2", label: "Alt Email 2" },
            { name: "altEmail3", label: "Alt Email 3" },
            { name: "phone", label: "Phone" },
            { name: "location", label: "Location" },
          ].map((field) => (
            <Form.Group key={field.name} className="mb-3">
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type="text"
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors[field.name] && formik.touched[field.name]}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompanyFormModal;
