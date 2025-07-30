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
import SigninPage from "../pages/Signin/SigninPage";
import PrivateRoute from "../utils/PrivateRoute";
import PageNotFound from "../components/page-not-found/PageNotFound";
import DetailPersonPage from "../pages/person/DetailPersonPage";
import ReportCreatePage from "../pages/report/ReportCreatePage";
import ReportDetailPage from "../pages/report/ReportDetailPage";
import ReportSendEmail from "../pages/report/ReportSendEmail";
import PersonCreatePage from "../pages/person/PersonCreatePage";

const IndexRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/404" element={<PageNotFound />} />

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="manage-company" element={<CompanyPage />} />
            <Route path="manage-report" element={<ReportPage />} />
            <Route path="manage-report/send-email" element={< ReportSendEmail/>} />
            <Route path="create-report" element={<ReportCreatePage />} />
            <Route path="report-update/:id" element={<ReportCreatePage />} />
            <Route path="report-detail/:id" element={<ReportDetailPage />} />
            <Route path="manage-person" element={<PersonPage />} />
            <Route path="create-person" element={<PersonCreatePage />} />
            <Route path="person-detail/:id" element={<DetailPersonPage />} />
            <Route path="assignments-project" element={<AssigmentsPage />} />
            <Route path="manage-project" element={<ProjectPage />} />
            <Route path="master-user" element={<UserPage />} />
            <Route path="master-role" element={<RolePage />} />
            <Route path="master-position" element={<PositionPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default IndexRoutes;
