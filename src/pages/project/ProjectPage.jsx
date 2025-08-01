import { useRef } from "react";

import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import { FaPlus } from "react-icons/fa";
import ProjectList from "./components/ProjectList";

const ProjectPage = () => {
  const refProjectList = useRef();
  const navigate = useNavigate();


  const handleAddPerson = () => {
    navigate("/create-person");
  };

  const handleDetail = (data) => {
    if (data?.id) {
      navigate(`/person-detail/${data.id}`);
    }
  };

  return (
    <>

      {/* <PersonFromFilter onFilter={(data) => refProjectList.current.doFilter(data)} /> */}
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn btn-primary me-2" onClick={handleAddPerson}>
          <FaPlus className="me-1" />
          Add Person
        </button>
      </div>
      <ProjectList
        ref={refProjectList}
        onDetail={handleDetail}
      />

    </>
  );
};

export default ProjectPage;
