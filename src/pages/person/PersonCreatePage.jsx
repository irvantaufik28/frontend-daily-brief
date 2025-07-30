import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { createPerson } from "../../features/personSlice";
import img from "../../assets/img/default_profil.png";
const PersonCreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewSource, setPreviewSource] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const default_profil = img

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

    const handleUploadImage = async () => {
        if (!selectedFile) {
            Swal.fire("No file", "Please select an image first.", "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Simulasi upload, ganti ini dengan API kamu jika ada
            const fakeUploadedUrl = previewSource;

            Swal.fire("Uploaded", "Image uploaded successfully", "success");
            return fakeUploadedUrl;
        } catch (err) {
            Swal.fire("Error", "Failed to upload image", "error");
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let photoUrl = values.photo;

            // Upload image jika ada file yang dipilih
            if (selectedFile) {
                const uploadedUrl = await handleUploadImage();
                photoUrl = uploadedUrl || values.photo;
            }

            const finalValues = { ...values, photo: photoUrl };

            await dispatch(createPerson(finalValues)).unwrap();
            await Swal.fire("Success", "Person has been created", "success");
            navigate("/person");
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
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleUploadImage}
                                >
                                    Upload new image
                                </button>
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
                                                    name="position"
                                                    type="text"
                                                    className="bd-form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="row gx-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="small mb-1" htmlFor="category">
                                                    Category
                                                </label>
                                                <Field
                                                    name="category"
                                                    type="text"
                                                    className="bd-form-control"
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
