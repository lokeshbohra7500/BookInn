import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const sidebarStyle = {
        width: isSidebarOpen ? "280px" : "80px",
        height: "calc(100vh - 72px)",
        backgroundColor: "#fff",
        borderRight: "1px solid var(--oyo-border)",
        transition: "width 0.3s ease",
        position: "sticky",
        top: "72px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0"
    };

    const navItemStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        padding: "1rem 1.5rem",
        color: isActive ? "var(--oyo-red)" : "var(--oyo-black)",
        backgroundColor: isActive ? "rgba(238, 42, 36, 0.05)" : "transparent",
        borderLeft: isActive ? "4px solid var(--oyo-red)" : "4px solid transparent",
        textDecoration: "none",
        fontWeight: isActive ? "700" : "500",
        transition: "all 0.2s ease",
        gap: "1rem"
    });

    const mainContentStyle = {
        flex: 1,
        backgroundColor: "var(--oyo-light-gray)",
        minHeight: "calc(100vh - 72px)",
        padding: "2rem"
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex", flex: 1 }}>
                <aside style={sidebarStyle}>
                    <NavLink to="/admin/dashboard" style={navItemStyle} end>
                        <span style={{ fontSize: "1.2rem" }}>📊</span>
                        {isSidebarOpen && <span>Overview</span>}
                    </NavLink>
                    <NavLink to="/admin/users" style={navItemStyle}>
                        <span style={{ fontSize: "1.2rem" }}>👥</span>
                        {isSidebarOpen && <span>Users</span>}
                    </NavLink>
                    <NavLink to="/admin/hotels" style={navItemStyle}>
                        <span style={{ fontSize: "1.2rem" }}>🏨</span>
                        {isSidebarOpen && <span>Hotels</span>}
                    </NavLink>
                    <NavLink to="/admin/bookings" style={navItemStyle}>
                        <span style={{ fontSize: "1.2rem" }}>📅</span>
                        {isSidebarOpen && <span>Bookings</span>}
                    </NavLink>
                    <NavLink to="/admin/payments" style={navItemStyle}>
                        <span style={{ fontSize: "1.2rem" }}>💳</span>
                        {isSidebarOpen && <span>Payments</span>}
                    </NavLink>

                    <div style={{ marginTop: "auto", borderTop: "1px solid var(--oyo-border)", padding: "1rem" }}>
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid var(--oyo-border)",
                                borderRadius: "4px",
                                background: "white",
                                cursor: "pointer"
                            }}
                        >
                            {isSidebarOpen ? "Collapse" : "»"}
                        </button>
                    </div>
                </aside>
                <main style={{ ...mainContentStyle, display: "flex", flexDirection: "column", padding: 0 }}>
                    <div style={{ flex: 1, padding: "2rem" }}>
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
