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

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h2>Customer Dashboard</h2>
            {profile && (
                <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                    <h3>Welcome, {profile.firstName} {profile.lastName}</h3>
                    <p>Email: {profile.email}</p>
                    <p>City: {profile.city}, {profile.state}</p>
                    <p>Role: {profile.role}</p>
                </div>
            )}
            <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/" style={{ padding: "0.5rem 1rem", border: "1px solid #000", textDecoration: "none" }}>Browse Hotels</Link>
                <Link to="/customer/bookings" style={{ padding: "0.5rem 1rem", border: "1px solid #000", textDecoration: "none" }}>My Bookings</Link>
            </div>
        </div>
    );
};

export default Dashboard;
