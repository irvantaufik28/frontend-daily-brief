import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";
import config from "../../../../config/index";

const ProjectFormModal = ({ show, onHide, onSubmit, initialData }) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(config.apiUrl + "/company-list", {
                    headers: { Authorization: token },
                });

                const companies = res.data.data.map((c) => ({
                    value: parseInt(c.id),
                    label: c.name,
                }));

                setCompanyOptions(companies);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setIsLoadingCompany(false);
            }
        };

        if (show) fetchCompanies();
    }, [show]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        companyId: Yup.number().required("Company is required"),
        startDate: Yup.date().required("Start Date is required"),
        endDate: Yup.date()
            .nullable()
            .min(Yup.ref("startDate"), "End Date cannot be before Start Date"),
        status: Yup.string().required("Status is required"),
    });

    const initialValues = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        companyId: initialData?.companyId || "",
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        status: initialData?.status || "",
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? "Update Project" : "Add Project"}</Modal.Title>
            </Modal.Header>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSubmit(values);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <>
                        <Modal.Body>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId="formTitle" className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.title && !!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formCompanyId" className="mb-3">
                                    <Form.Label>Company</Form.Label>
                                    <Select
                                        options={companyOptions}
                                        isLoading={isLoadingCompany}
                                        isClearable
                                        placeholder="Select company"
                                        value={companyOptions.find((opt) => opt.value === values.companyId) || null}
                                        onChange={(selectedOption) =>
                                            setFieldValue("companyId", selectedOption ? selectedOption.value : "")
                                        }
                                        onBlur={() => setFieldValue("companyId", values.companyId)}
                                        classNamePrefix="react-select"
                                    />
                                    {touched.companyId && errors.companyId && (
                                        <div className="text-danger mt-1">{errors.companyId}</div>
                                    )}
                                </Form.Group>

                                <Form.Group controlId="formDescription" className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        rows={3}
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.description && !!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formStartDate" className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={values.startDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.startDate && !!errors.startDate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.startDate}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formEndDate" className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={values.endDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.endDate && !!errors.endDate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.endDate}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formStatus" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.status && !!errors.status}
                                    >
                                        <option value="">-- Select Status --</option>
                                        <option value="ONGOING">ONGOING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.status}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                {initialData ? "Update" : "Save"}
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Formik>
        </Modal>
    );
};

export default ProjectFormModal;
