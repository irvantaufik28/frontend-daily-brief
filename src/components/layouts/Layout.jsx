import { NavLink, Outlet } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { RiDraftFill, RiMailSendLine, RiUserShared2Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { FaBuildingUser } from "react-icons/fa6";
import { LuWorkflow } from "react-icons/lu";
import { TbReport } from "react-icons/tb";
import { MdMessage } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SubMenu";
import "./styles/layout.css";
import NavbarLayout from "./NavbarLayout";
import { useDispatch, useSelector } from "react-redux";
import { countDraftReport } from "../../features/reportSlice";
import { useCookies } from "react-cookie";
import { jwtDecode as jwtDecode } from "jwt-decode";
const adminRoutes = (draftCount) => [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: <RxDashboard />,
    },
    {
        path: "/reports",
        name: "Reports",
        icon: <MdMessage />,
        subRoutes: [
            {
                path: "/manage-report",
                name: "Manage Reports",
                icon: <TbReport />,
            },
            {
                path: "/manage-report/send-email",
                name: "Send Report",
                icon: <RiMailSendLine />,
            },
            {
                path: "/manage-report/draft",
                name: "Draft",
                icon: (
                    <div className="icon-with-badge">
                        <RiDraftFill />
                        <span className="badge">{draftCount}</span>
                    </div>
                ),
            }
        ],
    },
    {
        path: "/manage-person",
        name: "People",
        icon: <HiMiniUserGroup />,
    },
    {
        path: "/assignments-project",
        name: "Assignments",
        icon: <RiUserShared2Line />,
    },
    {
        path: "/manage-company",
        name: "Company Info",
        icon: <FaBuildingUser />,
    },
    {
        path: "/manage-project",
        name: "Projects",
        icon: <LuWorkflow />,
    },


    {
        path: "/master/data",
        name: "Master Data",
        icon: <MdMessage />,
        subRoutes: [
            {
                path: "/master-user",
                name: "User",
                icon: <FaUser />,
            },
            {
                path: "/master-role",
                name: "Role",
                icon: <FaLock />,
            },
            {
                path: "/master-position",
                name: "Position",
                icon: <FaMoneyBill />,
            },
        ],
    },
];


const userRoutes = () => [
    {
        path: "/home",
        name: "Home",
        icon: <RxDashboard />,
    },
    {
        path: "/my-reportt",
        name: "My Report",
        icon: <HiMiniUserGroup />,
    }
];
const Layout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const dispatch = useDispatch();
    const [cookies, , removeCookie] = useCookies(["token"]);
    const draftCount = useSelector((state) => state.report.draftCount || 0);
    const [userData, setUserData] = useState({ fullName: "User", photo: "", role: "" });

    useEffect(() => {
        dispatch(countDraftReport());
    }, [dispatch]);

    useEffect(() => {
        if (cookies.token) {
            try {
                const decoded = jwtDecode(cookies.token);
                setUserData({
                    fullName: decoded.fullName || "User",
                    photo: decoded.photo || "",
                    role: decoded.role || ""
                });
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }, [cookies.token]);

    const routes =
        userData.role === "ADMIN"
            ? adminRoutes(draftCount)
            : userRoutes();

    const inputAnimation = {
        hidden: {
            width: 0,
            padding: 0,
            transition: {
                duration: 0.2,
            },
        },
        show: {
            width: "140px",
            padding: "5px 15px",
            transition: {
                duration: 0.2,
            },
        },
    };

    const showAnimation = {
        hidden: {
            width: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
            },
        },
        show: {
            opacity: 1,
            width: "auto",
            transition: {
                duration: 0.5,
            },
        },
    };
    return (
        <>

            <div className="main-container">
                <motion.div
                    animate={{
                        width: isOpen ? "300px" : "45px",

                        transition: {
                            duration: 0.5,
                            type: "spring",
                            damping: 10,
                        },
                    }}
                    className={`sidebar `}
                >
                    <div className="top_section">
                        <AnimatePresence>
                            {isOpen && (
                                <motion.h1
                                    variants={showAnimation}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="logo"
                                >
                                    {/* Hrd Cerdas */}
                                </motion.h1>
                            )}
                        </AnimatePresence>

                        <div className="bars">
                            <FaBars onClick={toggle} />
                        </div>
                    </div>
                    <section className="routes">
                        {routes.map((route, index) => {
                            if (route.subRoutes) {
                                return (
                                    <SidebarMenu
                                        setIsOpen={setIsOpen}
                                        route={route}
                                        showAnimation={showAnimation}
                                        isOpen={isOpen}
                                        key={route.path}
                                    />
                                );
                            }

                            return (
                                <NavLink
                                    to={route.path}
                                    key={index}
                                    className={({ isActive }) =>
                                        isActive ? "link active" : "link"
                                    }
                                >
                                    <div className="icon">{route.icon}</div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                variants={showAnimation}
                                                initial="hidden"
                                                animate="show"
                                                exit="hidden"
                                                className="link_text"
                                            >
                                                {route.name}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </NavLink>

                            );
                        })}
                    </section>
                </motion.div>

                <div className="main-content">
                    <NavbarLayout />
                    <div className="content-adjust">

                        <Outlet />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Layout