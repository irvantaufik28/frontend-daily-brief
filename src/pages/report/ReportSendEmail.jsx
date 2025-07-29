import { useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- Tambahkan ini
import ReportList from "./components/ReportList";
import ReportFromFilter from "./components/ReportFormFilter";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteReport } from "../../features/reportSlice";
import ReportListEmail from "./components/ReportListEmail";
import { sendEmail } from "../../features/sendEmailSlice";

const ReportSendEmail = () => {
  const refReportList = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch()


const handleSendEmail = async (data) => {
  const id = data?.id;

  if (!id) {
    Swal.fire("Error", "Invalid report ID", "error");
    return;
  }

  const confirm = await Swal.fire({
    title: "Send Email?",
    text: "This will send the report via email to the intended recipient.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, send it!",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    Swal.fire({ title: "Sending email...", didOpen: () => Swal.showLoading() });

    const response = await dispatch(
      sendEmail({ id: data.id, subject: data.subject || "" })
    ).unwrap();

    Swal.fire("Sent!", response?.message || "Email has been sent.", "success");

    refReportList.current.refreshData();
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error?.message || "Failed to send email.", "error");
  }
};


  return (
    <>
      <ReportFromFilter onFilter={(data) => refReportList.current.doFilter(data)} />
      <ReportListEmail
        ref={refReportList}
        onAction={handleSendEmail}
      />
    </>
  );
};

export default ReportSendEmail;
