import { useRef } from "react";
import PeopleList from "./components/PersonList";
import PersonFromFilter from "./components/PersonFromFilter";
import './styles/people.css';
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini

const PersonPage = () => {
  const refPeopleList = useRef();
  const navigate = useNavigate();

  const handleDetail = (data) => {
    console.log(data?.id);
    if (data?.id) {
      navigate(`/person-detail/${data.id}`);
    }
  };

  return (
    <>

      <PersonFromFilter onFilter={(data) => refPeopleList.current.doFilter(data)} />
      <PeopleList
        ref={refPeopleList}
        onDetail={handleDetail}
      />
    </>
  );
};

export default PersonPage;
