import { Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";
import {
  FiSettings,
  FiLogOut,
  FiBell,
  FiCheck,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode as jwtDecode } from "jwt-decode";

import DEFAULT_PROFILE_PIC from '../../assets/img/default_profil.png';

function NavbarLayout() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [userData, setUserData] = useState({ fullName: "User", photo: "" });

  // Decode token once on mount
  useEffect(() => {
    if (cookies.token) {
      try {
        const decoded = jwtDecode(cookies.token);
        setUserData({
          fullName: decoded.fullName || "User",
          photo: decoded.photo || "",
        });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [cookies.token]);

  const dummyNotifications = [
    {
      id: 1,
      title: "Request approved",
      time: "5 mins ago",
      icon: <FiCheck className="text-success" />,
    },
    {
      id: 2,
      title: "New message received",
      time: "10 mins ago",
      icon: <FiMessageSquare className="text-primary" />,
    },
    {
      id: 3,
      title: "Reminder: Submit report",
      time: "1 hour ago",
      icon: <FiClock className="text-warning" />,
    },
  ];

  const handleLogout = () => {
    removeCookie("token", {
      path: "/",
      sameSite: "Lax",
      secure: false,
    });

    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="bg-light text-dark px-3">
      <Navbar.Brand href="#home" className="text-dark">Daily Brief</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-dark" />
      <Navbar.Collapse id="basic-navbar-nav" className="ms-auto">
        <div className="d-flex align-items-center gap-3 position-relative ms-auto">
          {/* Notifikasi */}
          <div className="position-relative">
            <div
              role="button"
              className="text-dark position-relative"
              onClick={() => {
                setNotifOpen((prev) => !prev);
                setProfileOpen(false);
              }}
            >
              <FiBell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.65rem" }}>
                {dummyNotifications.length}
              </span>
            </div>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="dropdown-menu show bg-white shadow"
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    zIndex: 1000,
                    minWidth: 250,
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  {dummyNotifications.map((notif) => (
                    <div key={notif.id} className="dropdown-item d-flex gap-2 align-items-start">
                      <div style={{ fontSize: "1.2rem" }}>{notif.icon}</div>
                      <div>
                        <strong>{notif.title}</strong>
                        <div className="text-muted small">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                  {dummyNotifications.length === 0 && (
                    <div className="dropdown-item text-muted text-center">
                      No notifications
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown Profile */}
          <div className="position-relative">
            <div
              role="button"
              className="d-flex align-items-center gap-2 px-3 py-2 text-dark"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotifOpen(false);
              }}
            >
              <img
                src={userData.photo || DEFAULT_PROFILE_PIC}
                alt="user"
                className="rounded-circle"
                width="25"
                height="25"
                style={{ objectFit: "cover" }}
              />
              <span>{userData.fullName}</span>
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="dropdown-menu show bg-white shadow"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                    minWidth: 180,
                  }}
                >
                  <div
                    className="dropdown-item custom-dropdown-item d-flex align-items-center gap-2"
                    onClick={() => navigate("/profile")}
                  >
                    <FaUser /> Profile
                  </div>
                  <div
                    className="dropdown-item custom-dropdown-item d-flex align-items-center gap-2"
                    onClick={() => navigate("/setting")}
                  >
                    <FiSettings /> Setting
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item custom-dropdown-item d-flex align-items-center gap-2 w-100 bg-white border-0 text-start"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>


                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarLayout;
