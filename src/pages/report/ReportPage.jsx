import { useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import ReportList from "./components/ReportList";
import ReportFromFilter from "./components/ReportFormFilter";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteReport } from "../../features/reportSlice";

const ReportPage = () => {
  const refReportList = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleDetail = (data) => {
    if (data?.id) {
      navigate(`/report-detail/${data.id}`);
    }
  };
  const handleEdit = (data) => {
    if (data?.id) {
      navigate(`/report-update/${data.id}`);
    }
  };

  const handelDelete = async (data) => {
    const id = data?.id;

    if (!id) {
      Swal.fire("Error", "Invalid report detail ID", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the report detail permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({ title: "Deleting...", didOpen: () => Swal.showLoading() });

   await dispatch(deleteReport(id)).unwrap();

      Swal.fire("Deleted!", "Report detail has been deleted.", "success");

      refReportList.current.refreshData();
      // TODO: Reload data (panggil ulang dispatch(fetchReport()) atau sejenis)
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete report detail", "error");
    }
  };

  return (
    <>
      <ReportFromFilter onFilter={(data) => refReportList.current.doFilter(data)} />
      <ReportList
        ref={refReportList}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={handelDelete}
      />
    </>
  );
};

export default ReportPage;
