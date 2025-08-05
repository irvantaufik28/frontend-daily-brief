import { useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import ReportFromFilter from "./components/ReportFormFilter";
import ReportDraftList from "./components/ReportDraftList";

const ReportDrafPage = () => {
  const refReportDraftList = useRef();
  const navigate = useNavigate();
  
  const handleEdit = (data) => {
    if (data?.id) {
      navigate(`/report-update/${data.id}`);
    }
  };

  return (
    <>
      <ReportFromFilter onFilter={(data) => refReportDraftList.current.doFilter(data)} />
      <ReportDraftList
        ref={refReportDraftList}
        onEdit={handleEdit}
      />
    </>
  );
};

export default ReportDrafPage;
