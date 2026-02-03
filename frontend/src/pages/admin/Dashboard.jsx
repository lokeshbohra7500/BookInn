import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../api/user.api";
import { getAllHotels } from "../../api/hotel.api";
import { getAllBookings } from "../../api/booking.api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalHotels: 0,
        totalBookings: 0,
        activeHotels: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, hotelsRes, bookingsRes] = await Promise.all([
                    getAllUsers(),
                    getAllHotels(),
                    getAllBookings()
                ]);

                setStats({
                    totalUsers: usersRes.data.length,
                    totalHotels: hotelsRes.data.length,
                    totalBookings: bookingsRes.data.length,
                    activeHotels: hotelsRes.data.filter(h => h.status === 'ACTIVE').length
                });
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading overview...</div>;

    const statCardStyle = {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
        border: "1px solid var(--oyo-border)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
    };

    const quickActionStyle = {
        display: "flex",
        alignItems: "center",
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
        border: "1px solid var(--oyo-border)",
        textDecoration: "none",
        color: "var(--oyo-black)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        gap: "1rem"
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "900", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
                <p style={{ color: "var(--oyo-gray)", fontSize: "1.1rem" }}>Welcome back! Here's what's happening today.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                <div style={statCardStyle}>
                    <span style={{ fontSize: "0.9rem", color: "var(--oyo-gray)", fontWeight: "600", textTransform: "uppercase" }}>Total Registered Users</span>
                    <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--oyo-red)" }}>{stats.totalUsers}</span>
                </div>
                <div style={statCardStyle}>
                    <span style={{ fontSize: "0.9rem", color: "var(--oyo-gray)", fontWeight: "600", textTransform: "uppercase" }}>Total Hotels</span>
                    <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--oyo-black)" }}>{stats.totalHotels}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--oyo-green)" }}>{stats.activeHotels} Active</span>
                </div>
                <div style={statCardStyle}>
                    <span style={{ fontSize: "0.9rem", color: "var(--oyo-gray)", fontWeight: "600", textTransform: "uppercase" }}>Total Bookings</span>
                    <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "#3498db" }}>{stats.totalBookings}</span>
                </div>
            </div>

            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
                <Link to="/admin/hotels" style={quickActionStyle} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#ffebee", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🏨</div>
                    <div>
                        <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>Add New Hotel</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--oyo-gray)" }}>Register a new property to the system</div>
                    </div>
                </Link>
                <Link to="/admin/users" style={quickActionStyle} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#e3f2fd", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>👥</div>
                    <div>
                        <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>Manage Users</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--oyo-gray)" }}>View and moderate registered accounts</div>
                    </div>
                </Link>
                <Link to="/admin/bookings" style={quickActionStyle} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#e8f5e9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📅</div>
                    <div>
                        <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>Recent Bookings</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--oyo-gray)" }}>Check the latest booking activities</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
