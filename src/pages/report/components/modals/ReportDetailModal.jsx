import { Modal, Button, Spinner, Alert, Table } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ReportDetailModal = ({ isOpen, onClose, loading, data, error }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (data?.id) {
      navigate(`/report-update/${data.id}`);
    }
  };

  console.log(data?.emailStatus)
  const isEditable = data?.emailStatus === "SUCCESS";

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Report Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {data && (
          <div>
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Report Date:</strong> {moment(data.reportDate).format("YYYY-MM-DD HH:mm")}</p>
            <p><strong>Person:</strong> {data.person?.fullName}</p>
            <p><strong>Company:</strong> {data.project?.company?.name}</p>
            <p><strong>Company Email:</strong> {data.project?.company?.email}</p>

            <hr />
            <h5 className="mt-3">Report Details</h5>
            {data.ReportDetail && data.ReportDetail.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Worked Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ReportDetail.map((detail, index) => (
                    <tr key={detail.id}>
                      <td>{index + 1}</td>
                      <td>{detail.description}</td>
                      <td>{detail.workedHour}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">No report details available.</p>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleEdit}
          disabled={isEditable}
          title={isEditable ? "Cannot edit. Email not sent successfully." : ""}
        >
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportDetailModal;
