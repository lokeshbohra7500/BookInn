import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const footerStyle = {
        backgroundColor: "#222",
        color: "#fff",
        padding: "4rem 2rem 2rem 2rem",
        marginTop: "auto",
        borderTop: "4px solid var(--oyo-red)"
    };

    const containerStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "3rem",
    };

    const columnStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
    };

    const headingStyle = {
        fontSize: "1.2rem",
        fontWeight: "700",
        marginBottom: "0.5rem",
        color: "var(--oyo-red)",
        textTransform: "uppercase",
        letterSpacing: "1px"
    };

    const linkStyle = {
        color: "#bbb",
        textDecoration: "none",
        fontSize: "0.95rem",
        transition: "color 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
    };

    const bottomStyle = {
        marginTop: "4rem",
        paddingTop: "2rem",
        borderTop: "1px solid #333",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#666",
        letterSpacing: "0.5px"
    };

    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <div style={columnStyle}>
                    <h3 style={{ ...headingStyle, color: "#fff", fontSize: "1.8rem", letterSpacing: "-1px", textTransform: "none" }}>BOOKINN</h3>
                    <p style={{ color: "#888", fontSize: "0.95rem", lineHeight: "1.7" }}>
                        The world's fastest growing hotel chain. Providing affordable stays with premium quality and seamless booking experiences since 2024.
                    </p>
                </div>

                <div style={columnStyle}>
                    <h4 style={headingStyle}>Contact Us</h4>
                    <div style={linkStyle}>
                        <span>📞</span> +91 6396611392
                    </div>
                    <div style={linkStyle}>
                        <span>✉️</span> lokeshbohra7500@gmail.com
                    </div>
                    <div style={linkStyle}>
                        <span>📍</span> Haridwar, Uttarakhand, India
                    </div>
                </div>

                <div style={columnStyle}>
                    <h4 style={headingStyle}>Quick Links</h4>
                    <Link to="/" style={linkStyle}>Browse Hotels</Link>
                    <Link to="/login" style={linkStyle}>Sign In</Link>
                    <Link to="/register" style={linkStyle}>Join Now</Link>
                    <Link to="/" style={linkStyle}>Hotel List</Link>
                </div>

                <div style={columnStyle}>
                    <h4 style={headingStyle}>Legal & Support</h4>
                    <Link to="/" style={linkStyle}>Privacy Policy</Link>
                    <Link to="/" style={linkStyle}>Terms of Service</Link>
                    <Link to="/" style={linkStyle}>Refund Policy</Link>
                    <Link to="/" style={linkStyle}>Help Center</Link>
                </div>
            </div>

            <div style={bottomStyle}>
                © {new Date().getFullYear()} BookInn Technologies Pvt. Ltd. Made with ❤️ for travelers worldwide.
            </div>
        </footer>
    );
};

export default Footer;
