import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);

        if (result.success) {
            if (result.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (result.role === "MANAGER") {
                navigate("/manager/dashboard");
            } else {
                navigate("/customer/dashboard");
            }
        } else {
            setError(result.message);
        }
    };

    const containerStyle = {
        maxWidth: "400px",
        margin: "5rem auto",
        padding: "2.5rem",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        border: "1px solid var(--oyo-border)"
    };

    const inputGroupStyle = {
        marginBottom: "1.2rem"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "600",
        color: "#333"
    };

    const inputStyle = {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "1rem"
    };

    return (
        <div style={{ backgroundColor: "#f4f4f4", minHeight: "calc(100vh - 72px)", padding: "1px" }}>
            <div style={containerStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login to BookInn</h2>
                {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="oyo-btn-primary"
                        style={{ width: "100%", padding: "1rem", marginTop: "1rem", fontSize: "1.1rem" }}
                    >
                        Login
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--oyo-red)", fontWeight: "600", textDecoration: "none" }}>Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
