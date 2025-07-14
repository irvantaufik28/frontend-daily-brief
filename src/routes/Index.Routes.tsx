import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CompanyPage from "../pages/company/CompanyPage";
import Layout from "../components/layouts/Layout";
import ReportPage from "../pages/report/ReportPage";
import PersonPage from "../pages/person/PersonPage";
import AssigmentsPage from "../pages/assigments/AssigmentsPage";
import ProjectPage from "../pages/project/ProjectPage";
import UserPage from "../pages/master/user/UserPage";
import RolePage from "../pages/master/role/RolePage";
import PositionPage from "../pages/master/position/PositionPage";

const IndexRoutes = () => {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="manage-company" element={<CompanyPage />} />
          <Route path="manage-report" element={<ReportPage />} />
          <Route path="manage-person" element={<PersonPage />} />
          <Route path="assignments-project" element={<AssigmentsPage />} />
          <Route path="manage-project" element={<ProjectPage />} />

          <Route path="master-user" element={<UserPage />} />
          <Route path="master-role" element={<RolePage />} />
          <Route path="master-position" element={<PositionPage />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default IndexRoutes;
