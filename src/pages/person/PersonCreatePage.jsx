import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { createPerson } from "../../features/personSlice";
import img from "../../assets/img/default_profil.png";
import axios from "axios";
import config from "../../config";

const PersonCreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewSource, setPreviewSource] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const default_profil = img;

    const initialValues = {
        username: "",
        fullName: "",
        position: "",
        category: "",
        address: "",
        email: "",
        photo: "",
        phoneNumber: "",
        startDate: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Required"),
        fullName: Yup.string().required("Required"),
        position: Yup.string().required("Required"),
        category: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        phoneNumber: Yup.string().required("Required"),
        startDate: Yup.date().required("Required"),
    });

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSource(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fungsi upload image ke API menggunakan axios
    const handleUploadImage = async () => {
        const apiUrl = config.apiUrl;
        if (!selectedFile) {
            throw new Error("No file selected");
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        const response = await axios.post(apiUrl + "/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data || !response.data.data || !response.data.data.url) {
            throw new Error("Failed to upload image");
        }

        return response.data.data.url;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let photoUrl = values.photo;

            if (selectedFile) {
                Swal.fire({
                    title: "Uploading image...",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });
                photoUrl = await handleUploadImage();
                Swal.close();
            }

            const finalValues = { ...values, photo: photoUrl };

            await dispatch(createPerson(finalValues)).unwrap();

            await Swal.fire("Success", "Person has been created", "success");
            navigate("/manage-person");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create person", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bd-container-xl px-4">
            <div className="row bd-row">
                <div className="col-xl-4">
                    <div className="bd-card mb-4 mb-xl-0">
                        <div className="bd-card-header">Profile Picture</div>
                        <div className="bd-card-body text-center person-profile-photo">
                            <div className="dropzone">
                                <img
                                    src={previewSource || default_profil}
                                    alt="Preview"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        border: "1px solid #ccc",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginBottom: "10px",
                                    }}
                                />
                                <div className="small font-italic text-muted mb-4">
                                    JPG or PNG no larger than 5 MB
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    className="form-control mb-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-8">
                    <div className="bd-card mb-4">
                        <div className="bd-card-header">Account Details</div>
                        <div className="bd-card-body body-person-detail">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="username">
                                                Username
                                            </label>
                                            <Field
                                                name="username"
                                                type="text"
                                                className="bd-form-control"
                                            />
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="text-danger small"
                                            />
                                        </div>

                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="fullName">
                                                    Full Name
                                                </label>
                                                <Field
                                                    name="fullName"
                                                    type="text"
                                                    className="bd-form-control"
                                                />
                                                <ErrorMessage
                                                    name="fullName"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="position">
                                                    Position
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="position"
                                                    className="bd-form-control"
                                                >
                                                    <option value="">Select position</option>
                                                    <option value="Frontend Developer">
                                                        Frontend Developer
                                                    </option>
                                                    <option value="Backend Developer">
                                                        Backend Developer
                                                    </option>
                                                    <option value="Fullstack Developer">
                                                        Fullstack Developer
                                                    </option>
                                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                                    <option value="QA Engineer">QA Engineer</option>
                                                    <option value="Project Manager">Project Manager</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="position"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>
                                        </div>

                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="category">
                                                    Category
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="category"
                                                    className="bd-form-control"
                                                >
                                                    <option value="">Select category</option>
                                                    <option value="PERMANENT">PERMANENT</option>
                                                    <option value="FREELANCER">FREELANCER</option>
                                                    <option value="OUTSOURCE">OUTSOURCE</option>
                                                    <option value="INTERN">INTERN</option>
                                                    <option value="PART_TIME">PART_TIME</option>
                                                    <option value="CONTRACT">CONTRACT</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="category"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="address">
                                                    Address
                                                </label>
                                                <Field
                                                    name="address"
                                                    type="text"
                                                    className="bd-form-control"
                                                />
                                            </div>
                                        </div>


                                        <div className="mb-3">
                                            <label className="small mb-1" htmlFor="email">
                                                Email
                                            </label>
                                            <Field
                                                name="email"
                                                type="email"
                                                className="bd-form-control"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger small"
                                            />
                                        </div>

                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="phoneNumber">
                                                    Phone Number
                                                </label>
                                                <Field
                                                    name="phoneNumber"
                                                    type="tel"
                                                    className="bd-form-control"
                                                />
                                                <ErrorMessage
                                                    name="phoneNumber"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="startDate">
                                                    Start Date
                                                </label>
                                                <Field
                                                    name="startDate"
                                                    type="date"
                                                    className="bd-form-control"
                                                />
                                                <ErrorMessage
                                                    name="startDate"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Saving..." : "Save changes"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonCreatePage;
