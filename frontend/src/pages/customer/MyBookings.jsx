import React, { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../../api/booking.api";
import { initiatePayment, verifyPayment } from "../../api/payment.api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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
            // 1. Initiate 
            const res = await initiatePayment(bookingId);
            const data = res.data;

            // 2. Razorpay Options
            const options = {
                key: data.razorpayKey,
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                name: "BookInn",
                description: `Payment for Booking #${bookingId}`,
                handler: async function (response) {
                    try {
                        // 3. Verify
                        await verifyPayment({
                            bookingId: bookingId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        alert("Payment successful!");
                        fetchBookings(); // Refresh list
                    } catch (error) {
                        alert("Payment verification failed!");
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment modal closed");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Payment initiation failed: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading your bookings...</div>;

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                    {bookings.map((booking) => (
                        <div key={booking.bookingId} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                            <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                            <p><strong>Hotel ID:</strong> {booking.hotelId}</p>
                            <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                            <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                            <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            {booking.status === "PENDING" && (
                                <div style={{ marginTop: "10px" }}>
                                    <button
                                        onClick={() => handlePayment(booking.bookingId)}
                                        style={{ marginRight: "10px", padding: "5px 10px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none" }}
                                    >
                                        Pay Now
                                    </button>
                                    <button
                                        onClick={() => handleCancel(booking.bookingId)}
                                        style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#f44336", color: "white", border: "none" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
