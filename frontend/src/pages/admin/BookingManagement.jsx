import React, { useState, useEffect } from "react";
import { getAllBookings } from "../../api/booking.api";

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await getAllBookings();
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = filterStatus === "ALL"
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading bookings...</div>;

    const tableHeaderStyle = {
        backgroundColor: "white",
        padding: "1rem 1.5rem",
        borderBottom: "2px solid var(--oyo-border)",
        textAlign: "left",
        fontWeight: "700",
        color: "var(--oyo-gray)",
        textTransform: "uppercase",
        fontSize: "0.85rem"
    };

    const tableCellStyle = {
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--oyo-border)",
        color: "var(--oyo-black)",
        fontSize: "0.95rem"
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'var(--oyo-green)';
            case 'CANCELLED': return 'var(--oyo-red)';
            case 'PENDING': return '#f39c12';
            default: return 'var(--oyo-gray)';
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Booking Management</h1>
                    <p style={{ color: "var(--oyo-gray)" }}>Monitor and manage all bookings across all hotels.</p>
                </div>
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: "0.8rem 1rem",
                            borderRadius: "8px",
                            border: "1px solid var(--oyo-border)",
                            fontSize: "1rem",
                            backgroundColor: "white"
                        }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "var(--card-shadow)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Booking ID</th>
                            <th style={tableHeaderStyle}>User ID</th>
                            <th style={tableHeaderStyle}>Hotel</th>
                            <th style={tableHeaderStyle}>Dates</th>
                            <th style={tableHeaderStyle}>Amount</th>
                            <th style={tableHeaderStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(booking => (
                            <tr key={booking.bookingId} style={{ transition: "background 0.2s ease" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <td style={tableCellStyle}>
                                    <span style={{ fontWeight: "700" }}>#{booking.bookingId}</span>
                                </td>
                                <td style={tableCellStyle}>User #{booking.userId}</td>
                                <td style={tableCellStyle}>
                                    <div>
                                        <div style={{ fontWeight: "600" }}>{booking.hotelName}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--oyo-gray)" }}>{booking.roomTypeName}</div>
                                    </div>
                                </td>
                                <td style={tableCellStyle}>
                                    <div style={{ fontSize: "0.85rem" }}>
                                        <div>{booking.checkInDate}</div>
                                        <div style={{ color: "var(--oyo-gray)" }}>to {booking.checkOutDate}</div>
                                    </div>
                                </td>
                                <td style={tableCellStyle}>
                                    <span style={{ fontWeight: "700" }}>₹{booking.totalAmount.toLocaleString()}</span>
                                </td>
                                <td style={tableCellStyle}>
                                    <span style={{
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        backgroundColor: `${getStatusColor(booking.status)}15`,
                                        color: getStatusColor(booking.status),
                                        border: `1px solid ${getStatusColor(booking.status)}30`
                                    }}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--oyo-gray)" }}>
                        No bookings found for the selected status.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingManagement;
