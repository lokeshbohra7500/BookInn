import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllHotels,
    getHotelsByCity,
    searchHotelsByName,
    sortHotelsByRating,
    sortRoomsPriceLowToHigh,
    sortRoomsPriceHighToLow
} from "../../api/hotel.api";
import SearchFilters from "../../components/SearchFilters";

const Landing = () => {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All Hotels");

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

    const getMinPrice = (roomTypes) => {
        if (!roomTypes || roomTypes.length === 0) return 1499; // Default if no rooms
        const prices = roomTypes.map(rt => rt.pricePerNight);
        return Math.min(...prices);
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        setActiveFilter("All Hotels");
        try {
            const res = await getAllHotels();
            setHotels(res.data);
            setRooms(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (type, value) => {
        setLoading(true);
        if (type === "city") setActiveFilter(`Hotels in ${value}`);
        else if (type === "name") setActiveFilter(`Search results for "${value}"`);
        else if (type === "rating") setActiveFilter("Top Rated Hotels");
        else if (type === "sort") setActiveFilter("Price Sorted Results");

        try {
            let res;
            if (type === "city") res = await getHotelsByCity(value);
            else if (type === "name") res = await searchHotelsByName(value);
            else if (type === "rating") {
                res = await sortHotelsByRating();
                setHotels(res.data);
                setRooms(null);
                return;
            } else if (type === "sort") {
                if (value === "asc") res = await sortRoomsPriceLowToHigh();
                else res = await sortRoomsPriceHighToLow();
                setRooms(res.data);
                setHotels([]);
                return;
            }

            setHotels(res.data);
            setRooms(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sidebarWidth = "280px";

    const containerStyle = {
        display: "flex",
        minHeight: "calc(100vh - 80px)"
    };

    const mainContentStyle = {
        flex: 1,
        padding: "2rem",
        backgroundColor: "var(--oyo-light-gray)"
    };

    const horizontalCardStyle = {
        display: "flex",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "1.5rem",
        boxShadow: "var(--card-shadow)",
        border: "1px solid var(--oyo-border)",
        height: "240px",
        transition: "transform 0.2s"
    };

    const imageWrapperStyle = {
        width: "350px",
        minWidth: "350px",
        height: "100%",
        backgroundColor: "#eee"
    };

    const contentWrapperStyle = {
        padding: "1.5rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };

    return (
        <div style={containerStyle}>
            <SearchFilters onFilter={handleFilter} />

            <div style={mainContentStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.6rem" }}>
                        {loading ? "Searching..." : `${hotels.length || (rooms ? rooms.length : 0)} matches for ${activeFilter}`}
                    </h2>
                    <button className="oyo-btn-secondary" onClick={fetchHotels} style={{ padding: "0.5rem 1rem" }}>
                        Reset All
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
                ) : (
                    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                        {/* Hotel Listings */}
                        {hotels.map((hotel) => (
                            <div key={hotel.hotelId} style={horizontalCardStyle} className="hover-card">
                                <div style={imageWrapperStyle}>
                                    <img
                                        src={getHotelImage(hotel.hotelId, hotel.imageUrl)}
                                        alt={hotel.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={contentWrapperStyle}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{hotel.name}</h3>
                                            <div style={{ backgroundColor: "var(--oyo-green)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "0.9rem" }}>
                                                {hotel.starRating}⭐
                                            </div>
                                        </div>
                                        <p style={{ color: "var(--oyo-gray)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                                            {hotel.address}, {hotel.city}, {hotel.state}
                                        </p>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <span style={{ fontSize: "0.75rem", border: "1px solid var(--oyo-border)", padding: "2px 8px", borderRadius: "12px", color: "var(--oyo-gray)" }}>WiFi</span>
                                            <span style={{ fontSize: "0.75rem", border: "1px solid var(--oyo-border)", padding: "2px 8px", borderRadius: "12px", color: "var(--oyo-gray)" }}>AC</span>
                                            <span style={{ fontSize: "0.75rem", border: "1px solid var(--oyo-border)", padding: "2px 8px", borderRadius: "12px", color: "var(--oyo-gray)" }}>TV</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                        <div>
                                            <span style={{ color: "var(--oyo-gray)", fontSize: "0.8rem" }}>Starts from</span>
                                            <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#000" }}>₹{getMinPrice(hotel.roomTypes)}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.8rem" }}>
                                            <Link to={`/hotels/${hotel.hotelId}`} className="oyo-btn-secondary" style={{ padding: "0.6rem 1.2rem" }}>Details</Link>
                                            <Link to={`/hotels/${hotel.hotelId}`} className="oyo-btn-primary" style={{ padding: "0.6rem 1.2rem" }}>Book Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Room Listings (from Sort/Price) */}
                        {rooms && rooms.map((room) => (
                            <div key={`${room.hotelId}-${room.roomTypeId}`} style={horizontalCardStyle}>
                                <div style={imageWrapperStyle}>
                                    <img
                                        src={getHotelImage(room.hotelId, room.hotelImage)}
                                        alt={room.hotelName}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={contentWrapperStyle}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{room.hotelName}</h3>
                                            <div style={{ backgroundColor: "var(--oyo-green)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "0.9rem" }}>
                                                {room.starRating}⭐
                                            </div>
                                        </div>
                                        <p style={{ color: "var(--oyo-gray)", fontSize: "1rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                                            {room.type} Room
                                        </p>
                                        <p style={{ color: "var(--oyo-gray)", fontSize: "0.85rem" }}>
                                            <span style={{ fontWeight: "600" }}>Location:</span> {room.city}, {room.state}
                                        </p>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                        <div>
                                            <span style={{ color: "var(--oyo-gray)", fontSize: "0.8rem" }}>Price per night</span>
                                            <p style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--oyo-green)" }}>₹{room.pricePerNight}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.8rem" }}>
                                            <Link to={`/hotels/${room.hotelId}`} className="oyo-btn-secondary" style={{ padding: "0.6rem 1.2rem" }}>Details</Link>
                                            <Link to={`/hotels/${room.hotelId}`} className="oyo-btn-primary" style={{ padding: "0.6rem 1.2rem" }}>Book Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {hotels.length === 0 && !rooms && !loading && (
                            <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#fff", borderRadius: "8px" }}>
                                <p style={{ fontSize: "1.2rem", color: "var(--oyo-gray)" }}>No hotels found matching your selection.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
