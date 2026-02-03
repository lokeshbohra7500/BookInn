import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../../api/user.api";

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getMe();
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading dashboard...</div>;

    const containerStyle = {
        maxWidth: "800px",
        margin: "3rem auto",
        padding: "0 1rem"
    };

    const profileCardStyle = {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
        overflow: "hidden",
        border: "1px solid var(--oyo-border)",
        display: "flex",
        flexDirection: "column"
    };

    const headerStyle = {
        backgroundColor: "var(--oyo-red)",
        padding: "2.5rem 2rem",
        color: "white",
        textAlign: "center"
    };

    const detailsStyle = {
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem"
    };

    const infoGroupStyle = {
        marginBottom: "1rem"
    };

    const labelStyle = {
        color: "var(--oyo-gray)",
        fontSize: "0.85rem",
        fontWeight: "600",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "0.4rem"
    };

    const valueStyle = {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "var(--oyo-black)"
    };

    const actionContainerStyle = {
        padding: "1.5rem 2rem",
        borderTop: "1px solid var(--oyo-border)",
        display: "flex",
        gap: "1.5rem",
        justifyContent: "center",
        backgroundColor: "var(--oyo-light-gray)"
    };

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "900" }}>Your Profile</h1>
                <p style={{ color: "var(--oyo-gray)" }}>Manage your account and view your bookings</p>
            </div>

            {profile && (
                <div style={profileCardStyle}>
                    <div style={headerStyle}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: "50%",
                            margin: "0 auto 1.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2.5rem",
                            fontWeight: "900"
                        }}>
                            {profile.firstName[0]}{profile.lastName[0]}
                        </div>
                        <h2 style={{ fontSize: "2rem", color: "white" }}>{profile.firstName} {profile.lastName}</h2>
                        <p style={{ opacity: 0.9 }}>{profile.role} Member</p>
                    </div>

                    <div style={detailsStyle}>
                        <div style={infoGroupStyle}>
                            <label style={labelStyle}>Email Address</label>
                            <span style={valueStyle}>{profile.email}</span>
                        </div>
                        <div style={infoGroupStyle}>
                            <label style={labelStyle}>City / Location</label>
                            <span style={valueStyle}>{profile.city || "Not set"}</span>
                        </div>
                        <div style={infoGroupStyle}>
                            <label style={labelStyle}>State / Region</label>
                            <span style={valueStyle}>{profile.state || "Not set"}</span>
                        </div>
                        <div style={infoGroupStyle}>
                            <label style={labelStyle}>Status</label>
                            <span style={{ ...valueStyle, color: "var(--oyo-green)" }}>{profile.status}</span>
                        </div>
                    </div>

                    <div style={actionContainerStyle}>
                        <Link to="/" className="oyo-btn-secondary" style={{ flex: 1, textAlign: "center" }}>Browse Hotels</Link>
                        <Link to="/customer/bookings" className="oyo-btn-primary" style={{ flex: 1, textAlign: "center" }}>View My Bookings</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
