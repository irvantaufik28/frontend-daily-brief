import React from "react";

const DashboardPage = () => {
  return (
    <div className="container-fluid py-2">
      <div className="row">
        <div className="ms-3">
          <h3 className="mb-0 text-xl font-bold">Dashboard</h3>
     
        </div>
        {[
          { title: "Today’s Reports", value: "8", icon: "weekend", growth: "+55%", desc: "than last week", color: "success" },
          { title: "Missing Today’s Reports", value: "1", icon: "person", growth: "+3%", desc: "than last month", color: "success" },
          { title: "Late Submissions", value: "2", icon: "leaderboard", growth: "-2%", desc: "than yesterday", color: "danger" },
          { title: "Weekly Reports", value: "25", icon: "weekend", growth: "+5%", desc: "than yesterday", color: "success" }
        ].map((item, index) => (
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4" key={index}>
            <div className="card">
              <div className="card-header p-2 ps-3">
                <div className="d-flex justify-between">
                  <div>
                    <p className="text-sm mb-0 text-capitalize">{item.title}</p>
                    <h4 className="mb-0">{item.value}</h4>
                  </div>
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-2 ps-3">
                <p className="mb-0 text-sm">
                  <span className={`text-${item.color} font-weight-bold`}>{item.growth} </span>{item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Chart Cards Row === */}
      <div className="row">
        {[
          { title: "Website Views", desc: "Last Campaign Performance", canvasId: "chart-bars", footer: "campaign sent 2 days ago" },
          { title: "Daily Sales", desc: "(+15%) increase in today sales.", canvasId: "chart-line", footer: "updated 4 min ago" },
          { title: "Completed Tasks", desc: "Last Campaign Performance", canvasId: "chart-line-tasks", footer: "just updated" }
        ].map((item, index) => (
          <div className="col-lg-4 col-md-6 mt-4 mb-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h6 className="mb-0">{item.title}</h6>
                <p className="text-sm">{item.desc}</p>
                <div className="pe-2">
                  <div className="chart">
                    <canvas id={item.canvasId} className="chart-canvas" height="170"></canvas>
                  </div>
                </div>
                <hr className="dark horizontal" />
                <div className="d-flex">
                  <i className="material-symbols-rounded text-sm my-auto me-1">schedule</i>
                  <p className="mb-0 text-sm">{item.footer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Project Table and Orders Overview === */}
      <div className="row mb-4">
        <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
          {/* Table content placeholder */}
          <div className="card">
            <div className="card-header pb-0">
              <h6>Projects</h6>
              <p className="text-sm mb-0">
                <i className="fa fa-check text-info"></i>
                <span className="font-weight-bold ms-1">30 done</span> this month
              </p>
            </div>
            <div className="card-body px-0 pb-2">
              {/* Table component to be implemented or extracted */}
              <div className="table-responsive">
                <p className="text-center text-muted">[Table omitted for brevity]</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100">
            <div className="card-header pb-0">
              <h6>Report overview</h6>
              <p className="text-sm">
                <i className="fa fa-arrow-up text-success"></i>
                <span className="font-weight-bold">24%</span> this month
              </p>
            </div>
            <div className="card-body p-3">
              <div className="timeline timeline-one-side">
                <p className="text-center text-muted">[Timeline omitted for brevity]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
