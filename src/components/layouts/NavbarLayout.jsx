import { Navbar, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";
import {
  FiSettings,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode as jwtDecode } from "jwt-decode";
import { realtimeDb, ref, onValue } from '../../utils/FirebaseClient';
import DEFAULT_PROFILE_PIC from '../../assets/img/default_profil.png';
import { MdOutlineRateReview } from "react-icons/md";
import config from '../../config';
import axios from "axios";
import { fetchReport } from "../../features/reportSlice";
import { useDispatch, useSelector } from "react-redux";

function NavbarLayout() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [userData, setUserData] = useState({ fullName: "User", photo: "" });
  const [notifications, setNotifications] = useState([]);

  const apiUrl = config.apiUrl;
  const { data: report, loading, errorMessage: error } = useSelector(
    (state) => state.report
  );

  const [selectedNotif, setSelectedNotif] = useState(null);
  const dispatch = useDispatch();

  // Ambil user data dari token saat mount
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

  // Ambil notifikasi realtime dari Firebase
  useEffect(() => {
    const notificationsRef = ref(realtimeDb, 'notifications/admin');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const notifArr = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val,
        }));
        notifArr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(notifArr.slice(0, 10));
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Navigasi setelah report selesai di-fetch
  useEffect(() => {
    if (selectedNotif && report) {
      if (report.isDraft) {
        navigate(`/report-update/${selectedNotif.objectId}`);
      } else {
        navigate(`/report-detail/${selectedNotif.objectId}`);
      }
      setSelectedNotif(null);
      setLoadingNotif(false); // pastikan loading direset
    }
  }, [selectedNotif, report, navigate]);

  const handleNotifClick = async (notif) => {
    setLoadingNotif(true);
    try {
      await axios.patch(`${apiUrl}/notification/read/${notif.id}`);
      setNotifOpen(false);
      setSelectedNotif(notif);
      dispatch(fetchReport({ id: notif.objectId }));
    } catch (error) {
      console.error('Failed to mark notification as read or fetch report:', error);
      setLoadingNotif(false);
    }
  };

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
              {loadingNotif && (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1100,
                  }}
                />
              )}
              {notifications.length > 0 && !loadingNotif && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
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
                    minWidth: 300,
                    maxHeight: 350,
                    overflowY: "auto",
                  }}
                >
                  {loadingNotif && (
                    <div className="text-center p-2">
                      <Spinner animation="border" size="sm" /> Loading...
                    </div>
                  )}

                  {!loadingNotif && (notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className="dropdown-item d-flex gap-2 align-items-start "
                        style={{
                          cursor: 'pointer',
                          backgroundColor: notif.read ? '#f8f9fa' : 'white',
                          color: notif.read ? '#6c757d' : 'inherit',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7c98fff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ fontSize: "1.2rem" }}>
                          {notif.type === "Report" && <MdOutlineRateReview className="text-info" />}
                          {!notif.type && <FiBell />}
                        </div>
                        <div>
                          <strong>{notif.title}</strong>
                          <div className="text-muted small">{new Date(notif.createdAt).toLocaleString()}</div>
                          <div>{notif.body}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item text-muted text-center">
                      No notifications
                    </div>
                  ))}
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
