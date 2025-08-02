import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ProjectMemberList from "./components/ProjectMemberList";
import ProjectMemberFormFilter from "./components/ProjectMemberFormFilter";
import ProjectMemberAssign from "./components/ProjectMemberAssign";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

const AssigmentsPage = () => {
  const refProjectList = useRef();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showAssignCanvas, setShowAssignCanvas] = useState(false);
  const [projectId, setProjectId] = useState(1);

  const handleUnassign = async (rowData) => {

    const result = await Swal.fire({
      title: "Confirm Unassign",
      text: `Are you sure you want to unassign ${rowData.fullName || "this member"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Unassign",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];


      await axios.post(`${config.apiUrl}/project/member-unassign`, {
        personIds: [rowData.id],
        projectId: parseInt(projectId),
      }, {
        headers: {
          Authorization: token,
        },
      });

      Swal.fire("Unassigned", "Member has been unassigned successfully.", "success");
      refProjectList.current?.refreshData();
    } catch (error) {
      console.error("Unassign failed", error);
      Swal.fire("Error", "Failed to unassign member.", "error");
    }
  };

  return (
    <>
      <ProjectMemberFormFilter
        onFilter={(data) => {
          if (data.projectId) {
            setProjectId(data.projectId);
          }
          refProjectList.current?.doFilter(data);
        }}
        onReset={() => {
          refProjectList.current?.resetState();
          setProjectId(null); // atau default projectId jika perlu
        }}
      />

      {!isInitialLoad && (
        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => setShowAssignCanvas(true)}
          >
            <FaPlus className="me-1" />
            Assign Member
          </button>
        </div>
      )}

      <ProjectMemberList
        ref={refProjectList}
        setIsInitialLoad={setIsInitialLoad}
        onUnassign={handleUnassign}
      />

      <ProjectMemberAssign
        show={showAssignCanvas}
        handleClose={() => setShowAssignCanvas(false)}
        projectId={projectId}
        onSuccessAssign={() => {
          refProjectList.current?.refreshData();
        }}
      />
    </>
  );
};

export default AssigmentsPage;
