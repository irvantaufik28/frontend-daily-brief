// components/ProjectMemberAssign.jsx
import Offcanvas from "react-bootstrap/Offcanvas";
import ListMembers from "./ListMembers"; // pisahkan dari dalam file sebelumnya

const ProjectMemberListPerson = ({ show, handleClose, projectId, onSuccessAssign}) => {
    return (
        <Offcanvas show={show}
            onHide={handleClose}
            placement="end"
            style={{ width: "800px" }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Assign Member</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListMembers 
                    projectId={projectId}
                    onSuccessAssign={() => {
                        onSuccessAssign?.();
                        handleClose();
                    }} />
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ProjectMemberListPerson;
