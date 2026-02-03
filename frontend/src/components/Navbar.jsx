import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navStyle = {
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid var(--oyo-border)",
        position: "sticky",
        top: 0,
        zIndex: 1000
    };

    const logoStyle = {
        fontSize: "2rem",
        fontWeight: "900",
        color: "var(--oyo-red)",
        letterSpacing: "-1px"
    };

    const linkContainerStyle = {
        display: "flex",
        gap: "2rem",
        alignItems: "center"
    };

    const linkStyle = {
        fontWeight: "600",
        fontSize: "1rem",
        color: "var(--oyo-black)",
        transition: "color 0.2s"
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>BOOKINN</Link>

            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Browse Hotels</Link>

                {user ? (
                    <>
                        <Link
                            to={user.role === "ADMIN" ? "/admin/dashboard" : user.role === "MANAGER" ? "/manager/dashboard" : "/customer/dashboard"}
                            style={linkStyle}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "none",
                                border: "1px solid var(--oyo-border)",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px"
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Link to="/register" className="oyo-btn-secondary" style={{ padding: "0.5rem 1.5rem", border: "1px solid var(--oyo-border)" }}>Register</Link>
                        <Link to="/login" className="oyo-btn-primary" style={{ padding: "0.5rem 1.5rem" }}>Login</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
