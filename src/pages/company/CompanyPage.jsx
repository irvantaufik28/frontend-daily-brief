import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CompanyList from "./components/CompanyList";
import CompanyFormFilter from "./components/CompanyFormFilter";
import CompanyFormModal from "./components/modals/CompanyFormModal";
import "../person/styles/personformfilter.css";
import axios from "axios";
import config from "../../config/index";
import Swal from "sweetalert2";

const CompanyPage = () => {
      const refCompanyList = useRef();
      const [showModal, setShowModal] = useState(false);
      const [editingCompany, setEditingCompany] = useState(null); // null = add

      const handleOpenAddModal = () => {
            setEditingCompany(null);
            setShowModal(true);
      };

      const handleModalSubmit = async (formData) => {
            try {
                  const token = document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("token="))
                        ?.split("=")[1];

                  if (editingCompany) {
                        await axios.patch(`${config.apiUrl}/company/update/${editingCompany.id}`, formData, {
                              headers: { Authorization: token },
                        });
                  } else {
                        await axios.post(`${config.apiUrl}/company/create`, formData, {
                              headers: { Authorization: token },
                        });
                  }

                  Swal.fire({
                        icon: 'success',
                        title: editingCompany ? 'Company updated successfully!' : 'Company created successfully!',
                        timer: 1500,
                        showConfirmButton: false,
                  });

                  refCompanyList.current.refreshData();
                  setShowModal(false);
            } catch (error) {
                  console.error("Error saving company:", error);

                  Swal.fire({
                        icon: 'error',
                        title: 'Failed to save company',
                        text: error?.response?.data?.message || 'An unexpected error occurred.',
                  });
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

                        const res = await axios.get(`${apiUrl}/company/${data?.id}`, {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                              }
                        });
                        const detail = res.data.data;


                        setEditingCompany({
                              id: detail.id,
                              name: detail.name,
                              email: detail.email,
                              altEmail1: detail.altEmail1,
                              altEmail2: detail.altEmail2,
                              altEmail3: detail.altEmail3,
                              phone: detail.phone,
                              location: detail.location,
                        });


                        setShowModal(true);
                  } catch (err) {
                        console.error("Failed to fetch company detail", err);
                        alert("Gagal mengambil data company");
                  }
            }
      };


      const handleDetail = (data) => {
            alert(data?.id);
      }

      return (
            <>
                  <CompanyFormFilter onFilter={(data) => refCompanyList.current.doFilter(data)} />
                  <div className="d-flex justify-content-end mb-3">
                        <button type="button" className="btn btn-primary me-2" onClick={handleOpenAddModal}>
                              <FaPlus className="me-1" />
                              Add Company
                        </button>
                  </div>
                  <CompanyList
                        ref={refCompanyList}
                        onDetail={handleDetail}
                        onEdit={handleCreateUpdate}
                  />

                  <CompanyFormModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        onSubmit={handleModalSubmit}
                        initialData={editingCompany} // <- dikirim sebagai initialData
                  />
            </>
      );
};

export default CompanyPage;