import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelRoomTypes } from "../../api/hotel.api";
import { createBooking } from "../../api/booking.api";
import { useAuth } from "../../auth/AuthContext";

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roomTypes, setRoomTypes] = useState([]);
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
        fetchRoomTypes();
    }, [id]);

    const fetchRoomTypes = async () => {
        try {
            const res = await getHotelRoomTypes(id);
            setRoomTypes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (room) => {
        if (!user) {
            navigate("/login");
            return;
        }
        setSelectedRoom(room);
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
            setMessage(`Booking Successful! ID: ${res.data.bookingId}, Amount: ₹${res.data.totalAmount}, Status: ${res.data.status}`);
            setSelectedRoom(null);
        } catch (err) {
            setMessage("Booking failed: " + (err.response?.data?.message || "Error"));
        }
    };

    if (loading) return <div>Loading room types...</div>;

    return (
        <div>
            <h2>Hotel Room Types</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
                {roomTypes.map((room) => (
                    <div key={room.roomTypeId} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                        <h3>{room.type}</h3>
                        <p>Price per night: ₹{room.pricePerNight}</p>
                        <p>Capacity: {room.capacity} persons</p>
                        <p>Amenities: {room.amenities}</p>
                        <p>Total Rooms: {room.totalRooms}</p>
                        <button onClick={() => handleBookNow(room)}>Book Now</button>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <div style={{ marginTop: "2rem", border: "2px solid #000", padding: "1rem" }}>
                    <h3>Booking for {selectedRoom.type}</h3>
                    <form onSubmit={handleBookingSubmit}>
                        <div>
                            <label>Check-in:</label>
                            <input type="date" required value={bookingData.checkInDate} onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })} />
                        </div>
                        <div>
                            <label>Check-out:</label>
                            <input type="date" required value={bookingData.checkOutDate} onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })} />
                        </div>
                        <div>
                            <label>Rooms:</label>
                            <input type="number" min="1" required value={bookingData.numberOfRooms} onChange={(e) => setBookingData({ ...bookingData, numberOfRooms: e.target.value })} />
                        </div>
                        <div>
                            <label>Guests:</label>
                            <input type="number" min="1" required value={bookingData.numberOfGuests} onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: e.target.value })} />
                        </div>
                        <button type="submit">Confirm Booking</button>
                        <button type="button" onClick={() => setSelectedRoom(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {message && <div style={{ marginTop: "1rem", padding: "1rem", background: "#e0f7fa" }}>{message}</div>}
        </div>
    );
};

export default HotelDetails;
