import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    fetchPerson,
    personSelector,
    updatePerson,
} from "../../../../features/personSlice";
import default_profil from "../../../../assets/img/default_profil.png";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    startDate: Yup.date().required("Start date is required"),
});

const TabPersonInfo = () => {
    const { id } = useParams();
    const [previewSource, setPreviewSource] = useState(null);
    const [image, setImage] = useState(null);
    const dispatch = useDispatch();

    const data = useSelector(personSelector.data);
    const loading = useSelector(personSelector.loading);
    const errorMessage = useSelector(personSelector.errorMessage);

    useEffect(() => {
        dispatch(fetchPerson({ id }));
    }, [dispatch, id]);

    const initialValues = useMemo(() => {
        if (!data) return {};
        return {
            username: data.user?.username || "",
            fullName: data.fullName || "",
            position: data.position || "",
            category: data.category || "",
            address: data.address || "",
            email: data.email || "",
            photo: data.photo || "",
            phoneNumber: data.phoneNumber || "",
            startDate: data.startDate
                ? new Date(data.startDate).toISOString().slice(0, 10)
                : "",
        };
    }, [data]);

    useEffect(() => {
        if (data?.photo) {
            setPreviewSource(data.photo);
        }
    }, [data]);

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        previewFile(file);
    };

    const handleUploadImage = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);
        formData.append("type", "image");
        formData.append("folder", "student_foto");

        try {
            await dispatch(updatePerson({ id, values: formData })).unwrap();
            alert("Image uploaded successfully.");
            dispatch(fetchPerson({ id }));
        } catch (error) {
            console.error(error);
            alert("Failed to upload image.");
        }
    };



    const handleSubmit = async (values, { setSubmitting }) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save these changes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (!confirm.isConfirmed) {
            setSubmitting(false);
            return;
        }

        try {
            await dispatch(updatePerson({ id, values })).unwrap();
            await Swal.fire("Saved!", "The data has been updated.", "success");
            dispatch(fetchPerson({ id }));
        } catch (error) {
            console.error(error);
            await Swal.fire("Error!", "Failed to save changes.", "error");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading || !data) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    if (errorMessage) return <div>Error: {errorMessage}</div>;

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

export default TabPersonInfo;
