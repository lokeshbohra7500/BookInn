import React, { useState, useEffect } from "react";
import { getAllPayments } from "../../api/payment.api";

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setError(null);
            const res = await getAllPayments();
            setPayments(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "SUCCESS": return "var(--oyo-green)";
            case "FAILED": return "var(--oyo-red)";
            case "CREATED": return "var(--oyo-gray)";
            default: return "var(--oyo-black)";
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading transactions...</div>;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Payment History</h1>
                <p style={{ color: "var(--oyo-gray)" }}>Monitor and track all financial transactions across the platform.</p>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "var(--card-shadow)", overflow: "hidden", border: "1px solid var(--oyo-border)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid var(--oyo-border)" }}>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>Transaction ID</th>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>Booking ID</th>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>User ID</th>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>Amount</th>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>Status</th>
                            <th style={{ padding: "1.2rem", color: "var(--oyo-black)", fontWeight: "700" }}>Gateway</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--oyo-red)" }}>
                                    Error: {error}. (Make sure the payment-service is running and restarted)
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--oyo-gray)" }}>No payment records found.</td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.paymentId} style={{ borderBottom: "1px solid #f1f1f1" }}>
                                    <td style={{ padding: "1.2rem", fontSize: "0.9rem" }}>{payment.gatewayPaymentId || "N/A"}</td>
                                    <td style={{ padding: "1.2rem" }}>#{payment.bookingId}</td>
                                    <td style={{ padding: "1.2rem" }}>{payment.userId}</td>
                                    <td style={{ padding: "1.2rem", fontWeight: "700" }}>₹{payment.amount}</td>
                                    <td style={{ padding: "1.2rem" }}>
                                        <span style={{
                                            padding: "0.3rem 0.6rem",
                                            borderRadius: "4px",
                                            fontSize: "0.75rem",
                                            fontWeight: "700",
                                            backgroundColor: `${getStatusColor(payment.status)}15`,
                                            color: getStatusColor(payment.status)
                                        }}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1.2rem", color: "var(--oyo-gray)", fontSize: "0.8rem" }}>{payment.gateway} (Order: {payment.gatewayOrderId})</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManagement;
