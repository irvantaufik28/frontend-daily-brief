import { useRef } from "react";
import PeopleList from "./components/PersonList";
import PersonFromFilter from "./components/PersonFromFilter";
import './styles/people.css';
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import { FaPlus } from "react-icons/fa";

const PersonPage = () => {
  const refPeopleList = useRef();
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

      <PersonFromFilter onFilter={(data) => refPeopleList.current.doFilter(data)} />
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn btn-primary me-2" onClick={handleAddPerson}>
          <FaPlus className="me-1" />
          Add Person
        </button>
      </div>
      <PeopleList
        ref={refPeopleList}
        onDetail={handleDetail}
      />

    </>
  );
};

export default PersonPage;
