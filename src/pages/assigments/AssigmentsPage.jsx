import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import { FaPlus } from "react-icons/fa";
import ProjectMemberList from "./components/ProjectMemberList";
import ProjectMemberFormFilter from "./components/ProjectMemberFormFilter";

const AssigmentsPage = () => {
  const refProjectList = useRef();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleAssignMember = () => {
    // navigate("/create-person");
    alert('coming soon')
  };

  const handleDetail = (data) => {
    if (data?.id) {
      navigate(`/person-detail/${data.id}`);
    }
  };

  return (
    <>

      <ProjectMemberFormFilter
        onFilter={(data) => refProjectList.current.doFilter(data)}
        onReset={() => refProjectList.current.resetState()}
      />
      {!isInitialLoad && (
        <div className="d-flex justify-content-end mb-3">
          <button type="button" className="btn btn-primary me-2" onClick={handleAssignMember}>
            <FaPlus className="me-1" />
            Assign Member
          </button>
        </div>
      )}
      <ProjectMemberList
        ref={refProjectList}
        onDetail={handleDetail}
        setIsInitialLoad={setIsInitialLoad}
      />

    </>
  );
};

export default AssigmentsPage;
