import { useEffect, useRef, useState } from "react";
import ReportFromFilter from "./components/ReportFormFilter";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../features/reportSlice";
import ReportListEmail from "./components/ReportListEmail";
import { sendEmail } from "../../features/sendEmailSlice";
import ReportDetailModal from "./components/modals/ReportDetailModal";
import ReportFormFilterSendEmail from "./components/ReportFormFilterSendEmail";

const ReportSendEmail = () => {
  const refReportListEmail = useRef();
  const dispatch = useDispatch();

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data: reportDetail, loading, errorMessage } = useSelector(
    (state) => state.report
  );


  const handleSendOrResendEmail = async (data, isResend = false) => {
    const id = data?.id;
    const { data: report, loading, errorMessage: error } = useSelector(
      (state) => state.report
    );
    if (!id) {
      Swal.fire("Error", "Invalid report ID", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: isResend ? "Resend Email?" : "Send Email?",
      text: isResend
        ? "This will resend the report via email to the recipient."
        : "This will send the report via email to the intended recipient.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isResend ? "Yes, resend it!" : "Yes, send it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: isResend ? "Resending email..." : "Sending email...",
        didOpen: () => Swal.showLoading(),
      });

      const response = await dispatch(
        sendEmail({ id: data.id, subject: data.subject || "" })
      ).unwrap();

      Swal.fire(
        "Sent!",
        response?.message ||
        (isResend ? "Email has been resent." : "Email has been sent."),
        "success"
      );

      refReportListEmail.current.refreshData();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error?.message || "Failed to send email.", "error");
    }
  };

  const handleDetail = (data) => {
    setSelectedReportId(data.id);
    setShowDetailModal(true);
  };

  useEffect(() => {
    if (selectedReportId) {
      dispatch(fetchReport({ id: selectedReportId }));
    }
  }, [selectedReportId, dispatch]);


  return (
    <>
      <ReportFormFilterSendEmail onFilter={(data) => refReportListEmail.current.doFilter(data)} />
      <ReportListEmail
        ref={refReportListEmail}
        onSend={(data) => handleSendOrResendEmail(data, false)}
        onResend={(data) => handleSendOrResendEmail(data, true)}
        onDetail={handleDetail}
      />
      <ReportDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        loading={loading}
        data={reportDetail}
        error={errorMessage}
      />

    </>
  );
};

export default ReportSendEmail;
