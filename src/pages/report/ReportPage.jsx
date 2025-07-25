import { useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import ReportList from "./components/ReportList";
import ReportFromFilter from "./components/ReportFormFilter";

const ReportPage = () => {
  const refReportList = useRef();
  const navigate = useNavigate();

  const handleDetail = (data) => {
    console.log(data?.id);
    if (data?.id) {
      navigate(`/report-detail/${data.id}`);
    }
  };

  return (
    <>
      <ReportFromFilter onFilter={(data) => refReportList.current.doFilter(data)} />
      <ReportList
        ref={refReportList}
        onDetail={handleDetail}
      />
    </>
  );
};

export default ReportPage;
