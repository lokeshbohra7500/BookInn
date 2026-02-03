import React, { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../../api/booking.api";
import { initiatePayment, verifyPayment } from "../../api/payment.api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getHotelImage = (hotelId, imageUrl) => {
        if (imageUrl && !imageUrl.includes("placeholder")) return imageUrl;

        const dummyImages = [
            "/images/luxury.png",
            "/images/resort.png",
            "/images/budget.png",
            "/images/standard.png"
        ];
        // Use hotelId to pick a consistent dummy image
        const index = (hotelId || 0) % dummyImages.length;
        return dummyImages[index];
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await cancelBooking(bookingId);
                alert("Booking cancelled successfully.");
                fetchBookings();
            } catch (error) {
                alert("Cancellation failed: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            const res = await initiatePayment(bookingId);
            const data = res.data;

            const options = {
                key: data.razorpayKey,
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                name: "BookInn",
                description: `Payment for Booking #${bookingId}`,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            bookingId: bookingId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        alert("Payment successful!");
                        fetchBookings();
                    } catch (error) {
                        alert("Payment verification failed!");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Payment initiation failed: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading your bookings...</div>;

    const containerStyle = {
        padding: "2rem",
        backgroundColor: "var(--oyo-light-gray)",
        minHeight: "calc(100vh - 80px)"
    };

    const listContainerStyle = {
        maxWidth: "1000px",
        margin: "0 auto"
    };

    const bookingCardStyle = {
        display: "flex",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "1.5rem",
        boxShadow: "var(--card-shadow)",
        border: "1px solid var(--oyo-border)",
        height: "240px"
    };

    const imageWrapperStyle = {
        width: "350px",
        minWidth: "350px",
        backgroundColor: "#eee"
    };

    const contentStyle = {
        padding: "1.5rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };

    const statusBadgeStyle = (status) => {
        let color = "#767676";
        let bgColor = "#f3f5f7";
        if (status === "CONFIRMED") { color = "white"; bgColor = "var(--oyo-green)"; }
        if (status === "PENDING") { color = "white"; bgColor = "#ffc107"; } // Amber
        if (status === "CANCELLED") { color = "white"; bgColor = "#f44336"; }

        return {
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: "700",
            backgroundColor: bgColor,
            color: color,
            textTransform: "uppercase"
        };
    };

    return (
        <div style={containerStyle}>
            <div style={listContainerStyle}>
                <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>My Bookings</h1>

                {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#fff", borderRadius: "8px" }}>
                        <p style={{ fontSize: "1.2rem", color: "var(--oyo-gray)" }}>You haven't made any bookings yet.</p>
                    </div>
                ) : (
                    <div>
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} style={bookingCardStyle}>
                                <div style={imageWrapperStyle}>
                                    <img
                                        src={getHotelImage(booking.hotelId, booking.hotelImage)}
                                        alt={booking.hotelName}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={contentStyle}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{booking.hotelName || `Booking #${booking.bookingId}`}</h3>
                                            <span style={statusBadgeStyle(booking.status)}>{booking.status}</span>
                                        </div>
                                        <p style={{ color: "var(--oyo-gray)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                                            {booking.city}, {booking.state} • {booking.roomTypeName || "Standard"} Room
                                        </p>
                                        <div style={{ display: "flex", gap: "2rem", marginTop: "10px" }}>
                                            <div>
                                                <span style={{ fontSize: "0.75rem", color: "var(--oyo-gray)", display: "block" }}>CHECK-IN</span>
                                                <span style={{ fontWeight: "700" }}>{booking.checkInDate}</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: "0.75rem", color: "var(--oyo-gray)", display: "block" }}>CHECK-OUT</span>
                                                <span style={{ fontWeight: "700" }}>{booking.checkOutDate}</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: "0.75rem", color: "var(--oyo-gray)", display: "block" }}>QTY</span>
                                                <span style={{ fontWeight: "700" }}>{booking.numberOfRooms} Room(s)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                        <div>
                                            <span style={{ color: "var(--oyo-gray)", fontSize: "0.8rem" }}>Total Amount</span>
                                            <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#000" }}>₹{booking.totalAmount}</p>
                                        </div>

                                        {booking.status === "PENDING" && (
                                            <div style={{ display: "flex", gap: "0.8rem" }}>
                                                <button onClick={() => handleCancel(booking.bookingId)} className="oyo-btn-secondary" style={{ padding: "0.6rem 1.2rem" }}>Cancel</button>
                                                <button onClick={() => handlePayment(booking.bookingId)} className="oyo-btn-primary" style={{ padding: "0.6rem 1.2rem" }}>Pay Now</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
