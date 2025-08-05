import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectList from "./components/ProjectList";
import ProjectFromFilter from "./components/ProjectFromFilter";
import ProjectFormModal from "./components/modals/ProjectFormModal";
import "../person/styles/personformfilter.css";
import axios from "axios";
import config from "../../config/index";
import Swal from "sweetalert2";

const ProjectPage = () => {
  const refProjectList = useRef();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = add

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      // Tampilkan loading
      Swal.fire({
        title: editingProject ? "Updating Project..." : "Creating Project...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (editingProject) {
        // Update
        await axios.patch(`${config.apiUrl}/project/update/${editingProject.id}`, formData, {
          headers: { Authorization: token },
        });
      } else {
        // Create
        await axios.post(`${config.apiUrl}/project/create`, formData, {
          headers: { Authorization: token },
        });
      }

      // Tampilkan notifikasi sukses
      Swal.fire({
        icon: "success",
        title: editingProject ? "Project updated!" : "Project created!",
        showConfirmButton: false,
        timer: 1500,
      });

      refProjectList.current.refreshData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving project:", error);

      // Tampilkan notifikasi error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to save project.",
      });
    }
  };


  const handleDelete = async (data) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${config.apiUrl}/project/delete/${data?.id}`, {
          headers: {
            Authorization: token,
          },
        });

        await Swal.fire("Deleted!", "Project has been deleted.", "success");
        refProjectList.current.refreshData(); // refresh list setelah delete
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error", "Failed to delete project.", "error");
      }
    }
  };

  const handleCreateUpdate = async (data) => {
    if (data?.id) {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      try {
        const apiUrl = config.apiUrl;

        const res = await axios.get(`${apiUrl}/project/${data?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const detail = res.data.data;

        const formatDate = (date) => {
          if (!date) return "";
          const d = new Date(date);
          return d.toISOString().split("T")[0]; // hasil: '2025-08-05'
        };

        // Set data untuk form modal
        setEditingProject({
          id: detail.id,
          companyId: detail.companyId,
          title: detail.title,
          description: detail.description,
          startDate: formatDate(detail.startDate),
          endDate: formatDate(detail.endDate),
          status: detail.status,
          members: detail.projectMembers?.map(m => m.personId) || []
        });

        setShowModal(true);
      } catch (err) {
        console.error("Failed to fetch project detail", err);
        alert("Gagal mengambil data project");
      }
    }
  };


  const handleDetail = (data) => {
    alert(data?.id);
  }

  return (
    <>
      <ProjectFromFilter onFilter={(data) => refProjectList.current.doFilter(data)} />
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn btn-primary me-2" onClick={handleOpenAddModal}>
          <FaPlus className="me-1" />
          Add Project
        </button>
      </div>
      <ProjectList
        ref={refProjectList}
        onDetail={handleDetail}
        onEdit={handleCreateUpdate}
        onDelete={handleDelete}
      />

      <ProjectFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProject}
      />
    </>
  );
};

export default ProjectPage;
