import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/user.api";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        state: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Password mismatch! Please make sure both passwords are the same.");
            return;
        }

        setLoading(true);
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = formData;
            await registerUser(registerData);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
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
        fontSize: "0.9rem",
        color: "#333"
    };

    const inputStyle = {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s"
    };

    return (
        <div style={{ backgroundColor: "#f4f4f4", minHeight: "calc(100vh - 72px)", padding: "1px" }}>
            <div style={containerStyle}>
                <h1 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>Create Account</h1>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>Join BookInn to start booking your stays.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>First Name</label>
                            <input
                                type="text" name="firstName" required style={inputStyle}
                                value={formData.firstName} onChange={handleChange}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Last Name</label>
                            <input
                                type="text" name="lastName" required style={inputStyle}
                                value={formData.lastName} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email" name="email" required style={inputStyle}
                            value={formData.email} onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>City</label>
                            <input
                                type="text" name="city" required style={inputStyle}
                                value={formData.city} onChange={handleChange}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>State</label>
                            <input
                                type="text" name="state" required style={inputStyle}
                                value={formData.state} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password" name="password" required style={inputStyle}
                            value={formData.password} onChange={handleChange}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password" name="confirmPassword" required style={inputStyle}
                            value={formData.confirmPassword} onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="oyo-btn-primary"
                        style={{ width: "100%", padding: "1rem", marginTop: "1rem", fontSize: "1.1rem" }}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
                        Already have an account? <Link to="/login" style={{ color: "var(--oyo-red)", fontWeight: "600", textDecoration: "none" }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
