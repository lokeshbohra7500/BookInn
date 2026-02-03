import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelRoomTypes, getAllHotels } from "../../api/hotel.api";
import { createBooking } from "../../api/booking.api";
import { useAuth } from "../../auth/AuthContext";

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roomTypes, setRoomTypes] = useState([]);
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkInDate: "",
        checkOutDate: "",
        numberOfRooms: 1,
        numberOfGuests: 1
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both room types and hotel details
            const [roomsRes, hotelsRes] = await Promise.all([
                getHotelRoomTypes(id),
                getAllHotels()
            ]);

            setRoomTypes(roomsRes.data);

            // Find specific hotel from the list
            const foundHotel = hotelsRes.data.find(h => h.hotelId.toString() === id);
            setHotel(foundHotel);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getHotelImage = (hotelId, imageUrl) => {
        if (imageUrl && !imageUrl.includes("placeholder")) return imageUrl;
        const dummyImages = ["/images/luxury.png", "/images/resort.png", "/images/budget.png", "/images/standard.png"];
        const index = (hotelId || 0) % dummyImages.length;
        return dummyImages[index];
    };

    const handleBookNow = (room) => {
        if (!user) {
            navigate("/login");
            return;
        }
        setSelectedRoom(room);
        setTimeout(() => {
            document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                hotelId: id,
                roomTypeId: selectedRoom.roomTypeId,
                ...bookingData
            };
            const res = await createBooking(payload);
            setMessage(`✅ Booking Successful! ID: ${res.data.bookingId}, Total: ₹${res.data.totalAmount}`);
            setSelectedRoom(null);
        } catch (err) {
            setMessage("❌ Booking failed: " + (err.response?.data?.message || "Error"));
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: "10rem", fontSize: "1.2rem", fontWeight: "600" }}>Loading hotel details...</div>;
    if (!hotel) return <div style={{ textAlign: "center", padding: "10rem" }}>Hotel not found.</div>;

    const pageStyle = {
        backgroundColor: "#f7f8fa",
        minHeight: "100vh",
        paddingBottom: "4rem"
    };

    const heroSectionStyle = {
        width: "100%",
        height: "450px",
        position: "relative",
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${getHotelImage(hotel.hotelId, hotel.imageUrl)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
        padding: "3rem 0",
        color: "white"
    };

    const containerStyle = {
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "0 1.5rem"
    };

    const badgeStyle = {
        backgroundColor: "var(--oyo-green)",
        color: "white",
        padding: "5px 12px",
        borderRadius: "4px",
        fontWeight: "700",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        marginBottom: "1rem"
    };

    const infoCardStyle = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "2.5rem",
        marginTop: "-60px",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        marginBottom: "2rem"
    };

    const sectionTitleStyle = {
        fontSize: "1.8rem",
        fontWeight: "800",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    };

    const roomCardStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 250px",
        backgroundColor: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        border: "1px solid #efefef",
        marginBottom: "1.5rem",
        transition: "transform 0.2s"
    };

    const bookingBoxStyle = {
        marginTop: "3rem",
        padding: "2.5rem",
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "2px solid var(--oyo-red)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.12)"
    };

    const inputGroupStyle = {
        marginBottom: "1.5rem"
    };

    const labelStyle = {
        display: "block",
        fontWeight: "700",
        marginBottom: "0.6rem",
        fontSize: "0.9rem",
        color: "#444"
    };

    const inputStyle = {
        width: "100%",
        padding: "0.9rem",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "1rem"
    };

    return (
        <div style={pageStyle}>
            <div style={heroSectionStyle}>
                <div style={containerStyle}>
                    <div style={badgeStyle}>{hotel.starRating} ★ Rating</div>
                    <h1 style={{ fontSize: "3.5rem", fontWeight: "900", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>{hotel.name}</h1>
                    <p style={{ fontSize: "1.2rem", fontWeight: "400", opacity: 0.9 }}>{hotel.city}, {hotel.state}</p>
                </div>
            </div>

            <div style={containerStyle}>
                <div style={infoCardStyle}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 130px", gap: "2rem" }}>
                        <div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#222", marginBottom: "0.8rem" }}>Description</h2>
                            <p style={{ color: "#666", lineHeight: "1.7", fontSize: "1.05rem" }}>
                                {hotel.description || "Welcome to " + hotel.name + ". Enjoy a premium stay with world-class amenities and exceptional hospitalitity in the heart of " + hotel.city + "."}
                            </p>

                            <div style={{ marginTop: "2rem", display: "flex", gap: "10px" }}>
                                <span style={{ padding: "8px 16px", borderRadius: "20px", background: "#f0f2f5", fontSize: "0.9rem", color: "#555" }}>Free WiFi</span>
                                <span style={{ padding: "8px 16px", borderRadius: "20px", background: "#f0f2f5", fontSize: "0.9rem", color: "#555" }}>Air Conditioning</span>
                                <span style={{ padding: "8px 16px", borderRadius: "20px", background: "#f0f2f5", fontSize: "0.9rem", color: "#555" }}>Room Service</span>
                            </div>
                        </div>
                        <div style={{ textAlign: "right", borderLeft: "1px solid #eee", paddingLeft: "1.5rem" }}>
                            <h3 style={{ fontSize: "0.9rem", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Location</h3>
                            <p style={{ fontWeight: "700", fontSize: "1rem" }}>{hotel.address}</p>
                            <p style={{ fontSize: "0.9rem", color: "#666" }}>{hotel.city}</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "3rem" }}>
                    <h2 style={sectionTitleStyle}>
                        Available Room Categories
                    </h2>

                    <div style={{ display: "grid", gap: "1.5rem" }}>
                        {roomTypes.map((room) => (
                            <div key={room.roomTypeId} style={roomCardStyle} className="hover-card">
                                <div style={{ padding: "2rem" }}>
                                    <h3 style={{ fontSize: "1.6rem", color: "var(--oyo-red)", fontWeight: "800", marginBottom: "0.8rem" }}>{room.type}</h3>
                                    <p style={{ color: "var(--oyo-gray)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                                        {room.amenities || "Includes premium bedding, ensuite bathroom, and modern guest facilities."}
                                    </p>
                                    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <strong>Capacity:</strong> {room.capacity} Guests
                                        </span>
                                        <span style={{ fontSize: "0.95rem", border: "1px solid #eee", padding: "4px 12px", borderRadius: "4px", backgroundColor: "#fafafa" }}>
                                            Instant Confirmation
                                        </span>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#fcfcfc", borderLeft: "1px solid #efefef", padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <p style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "0.2rem" }}>₹{room.pricePerNight}</p>
                                    <p style={{ fontSize: "0.85rem", color: "#999", marginBottom: "1.5rem" }}>per night</p>
                                    <button className="oyo-btn-primary" style={{ width: "100%", padding: "0.8rem" }} onClick={() => handleBookNow(room)}>Select & Book</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedRoom && (
                    <div style={bookingBoxStyle} id="booking-form">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2.2rem", fontWeight: "900" }}>Complete Your Booking</h2>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ color: "var(--oyo-red)", fontWeight: "700" }}>{selectedRoom.type}</p>
                                <p style={{ fontSize: "1.2rem", fontWeight: "800" }}>₹{selectedRoom.pricePerNight} / night</p>
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Check-in Date</label>
                                    <input style={inputStyle} type="date" required value={bookingData.checkInDate} onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Number of Rooms</label>
                                    <input style={inputStyle} type="number" min="1" required value={bookingData.numberOfRooms} onChange={(e) => setBookingData({ ...bookingData, numberOfRooms: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Check-out Date</label>
                                    <input style={inputStyle} type="date" required value={bookingData.checkOutDate} onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Number of Guests</label>
                                    <input style={inputStyle} type="number" min="1" required value={bookingData.numberOfGuests} onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ gridColumn: "span 2", display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                                <button type="submit" className="oyo-btn-primary" style={{ flex: 1, padding: "1.2rem", fontSize: "1.1rem", fontWeight: "800" }}>Confirm Reservation</button>
                                <button type="button" className="oyo-btn-secondary" style={{ padding: "0 2rem" }} onClick={() => setSelectedRoom(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {message && (
                    <div style={{
                        marginTop: "3rem",
                        padding: "2rem",
                        borderRadius: "12px",
                        backgroundColor: message.includes("Successful") ? "#e8f5e9" : "#ffebee",
                        color: message.includes("Successful") ? "#2e7d32" : "#c62828",
                        fontWeight: "700",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelDetails;
