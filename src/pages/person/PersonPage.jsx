import { useRef } from "react"
import PeopleList from "./components/PersonList"
import PersonFromFilter from "./components/PersonFromFilter"
import './styles/people.css'

const PersonPage = () => {
  const refPeopleList = useRef()

  const handleEdit = (data) => {
    // ...
  }

  const handleDelete = (data) => {
    // ...
  }

  const handleManage = (data) => {
    // ...
  }

  return (
    <>

      <div className="people-list-table">
        <PersonFromFilter onFilter={(data) => refPeopleList.current.doFilter(data)} />
        <PeopleList
          ref={refPeopleList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManage={handleManage}
        />
      </div>
    </>
  )
}

export default PersonPage
