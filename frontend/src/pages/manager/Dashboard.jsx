import React, { useState } from "react";
import { getBookingsByHotel, getBookingForHotel } from "../../api/booking.api";
import { getUserById } from "../../api/user.api";

const ManagerDashboard = () => {
    const [hotelId, setHotelId] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [userQueryId, setUserQueryId] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchBookingsForHotel = async () => {
        setLoading(true);
        setError("");
        setSelectedBooking(null);
        try {
            const res = await getBookingsByHotel(hotelId);
            setBookings(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecificBooking = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getBookingForHotel(hotelId, bookingId);
            setSelectedBooking(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch booking");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserById = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getUserById(userQueryId);
            setUserDetails(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        maxWidth: "1100px",
        margin: "2rem auto",
        padding: "0 1rem"
    };

    const sectionStyle = {
        backgroundColor: "white",
        border: "1px solid var(--oyo-border)",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
        padding: "1.5rem",
        marginBottom: "1.5rem"
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem"
    };

    const listCardStyle = {
        backgroundColor: "white",
        border: "1px solid var(--oyo-border)",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "0.75rem"
    };

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "900" }}>Manager Dashboard</h1>
                <p style={{ color: "var(--oyo-gray)" }}>Access hotel bookings and user details</p>
            </div>

            {error && (
                <div style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcdd2", color: "#b71c1c", padding: "0.75rem 1rem", borderRadius: "6px", marginBottom: "1rem" }}>
                    {error}
                </div>
            )}

            <div style={gridStyle}>
                <div style={sectionStyle}>
                    <h2 style={{ marginBottom: "1rem" }}>Bookings by Hotel</h2>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                        <input
                            type="number"
                            placeholder="Hotel ID"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button className="oyo-btn-primary" onClick={fetchBookingsForHotel} disabled={!hotelId || loading}>Fetch</button>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            {bookings.length === 0 ? (
                                <div style={{ color: "var(--oyo-gray)" }}>No bookings found for this hotel.</div>
                            ) : (
                                bookings.map((b) => (
                                    <div key={b.bookingId} style={listCardStyle}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <strong>Booking #{b.bookingId}</strong> — User #{b.userId}
                                                <div style={{ color: "var(--oyo-gray)", fontSize: "0.9rem" }}>
                                                    {b.checkInDate} → {b.checkOutDate} • Rooms: {b.numberOfRooms} • Guests: {b.numberOfGuests}
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: "700", color: b.status === "CONFIRMED" ? "var(--oyo-green)" : "var(--oyo-black)" }}>
                                                {b.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div style={sectionStyle}>
                    <h2 style={{ marginBottom: "1rem" }}>Find Booking in Hotel</h2>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                        <input
                            type="number"
                            placeholder="Hotel ID"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="number"
                            placeholder="Booking ID"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button className="oyo-btn-secondary" onClick={fetchSpecificBooking} disabled={!hotelId || !bookingId || loading}>Fetch</button>
                    </div>
                    {selectedBooking ? (
                        <div style={listCardStyle}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>Booking #{selectedBooking.bookingId}</strong> — Hotel #{selectedBooking.hotelId} — User #{selectedBooking.userId}
                                    <div style={{ color: "var(--oyo-gray)", fontSize: "0.9rem" }}>
                                        {selectedBooking.checkInDate} → {selectedBooking.checkOutDate} • Rooms: {selectedBooking.numberOfRooms} • Guests: {selectedBooking.numberOfGuests}
                                    </div>
                                </div>
                                <span style={{ fontWeight: "700", color: selectedBooking.status === "CONFIRMED" ? "var(--oyo-green)" : "var(--oyo-black)" }}>
                                    {selectedBooking.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: "var(--oyo-gray)" }}>Enter IDs and fetch booking.</div>
                    )}
                </div>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ marginBottom: "1rem" }}>Lookup User by ID</h2>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", maxWidth: "520px" }}>
                    <input
                        type="number"
                        placeholder="User ID"
                        value={userQueryId}
                        onChange={(e) => setUserQueryId(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button className="oyo-btn-primary" onClick={fetchUserById} disabled={!userQueryId || loading}>Fetch</button>
                </div>
                {userDetails ? (
                    <div style={listCardStyle}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</div>
                            <div><strong>Email:</strong> {userDetails.email}</div>
                            <div><strong>Status:</strong> {userDetails.status}</div>
                            <div><strong>Role:</strong> {userDetails.role}</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ color: "var(--oyo-gray)" }}>Enter an ID to view user details.</div>
                )}
            </div>

            {loading && (
                <div style={{ textAlign: "center", marginTop: "1rem", color: "var(--oyo-gray)" }}>
                    Loading...
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
