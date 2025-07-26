import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./styles/reportdetailpage.css";
import { fetchReport } from "../../features/reportSlice";

const ReportDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: report, loading, errorMessage: error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchReport({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    console.log("Report from Redux:", report);
  }, [report]);

  const items = Array.isArray(report?.ReportDetail) ? report.ReportDetail : [];
  const person = report?.person || {};
  const totalHours = items.reduce((sum, item) => sum + (item.hour || 0), 0);

  return (
    <div className="report-container">
      <div className="report-card">
        <div className="report-card-body">
          <div id="report">
            <div className="report-toolbar hidden-print">
              <div className="text-end">
                <button type="button" className="btn btn-dark">
                  <i className="fa fa-print"></i> Print
                </button>
                <button type="button" className="btn btn-danger">
                  <i className="fa fa-file-pdf-o"></i> Export as PDF
                </button>
              </div>
              <hr />
            </div>

            {loading && <div>Loading...</div>}
            {error && (
              <div className="text-danger">Error: {JSON.stringify(error)}</div>
            )}

            {!loading && !error && (
              <div className="report-content overflow-auto">
                <div style={{ minWidth: "600px" }}>
                  <header className="report-header">
                    <div className="row">
                      <div className="col report-company-details">
                        <h2 className="report-company-name">
                          <a href="#" target="_blank" rel="noreferrer">
                            Arboshiki
                          </a>
                        </h2>
                        <div>455 Foggy Heights, AZ 85004, US</div>
                        <div>(123) 456-789</div>
                        <div>company@example.com</div>
                      </div>
                    </div>
                  </header>

                  <main className="report-main">
                    <div className="row report-contacts">
                      <div className="col report-to">
                        <div className="text-gray-light">REPORT TO:</div>
                        <h2 className="to">{person.name || "-"}</h2>
                        <div className="address">{person.address || "-"}</div>
                        <div className="email">
                          <a href={`mailto:${person.email || ""}`}>
                            {person.email || "-"}
                          </a>
                        </div>
                      </div>
                      <div className="col report-details">
                        <h1 className="report-id">{report?.code || "REPORT"}</h1>
                        <div className="date">
                          Date of Report: {report?.reportDate || "-"}
                        </div>
                        <div className="date">
                          Due Date: {report?.dueDate || "-"}
                        </div>
                      </div>
                    </div>

                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="text-left">DESCRIPTION</th>
                          <th className="text-right">HOUR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td className="no">{item.id || index + 1}</td>
                            <td className="text-left">
                              <h3>{item.title || "-"}</h3>
                              {item.description || "-"}
                            </td>
                            <td className="unit">{item.workedHour || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2" className="text-right">
                            TOTAL HOURS
                          </td>
                          <td>{totalHours}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="report-notices">
                      <div>NOTICE:</div>
                      <div className="report-notice">
                        A finance charge of 1.5% will be made on unpaid balances
                        after 30 days.
                      </div>
                    </div>
                  </main>

                  <footer className="report-footer">
                    Report was created on a computer and is valid without the
                    signature and seal.
                  </footer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
