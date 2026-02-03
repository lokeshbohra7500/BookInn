import React, { useState, useEffect } from "react";
import { getAllHotels, addHotel, disableHotel, getHotelRoomTypes, addRoomType, getInactiveHotels, enableHotel } from "../../api/hotel.api";

const HotelManagement = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [roomLoading, setRoomLoading] = useState(false);

    const [newHotel, setNewHotel] = useState({
        name: "",
        city: "",
        state: "",
        address: "",
        description: "",
        starRating: 5,
        imageUrl: ""
    });

    const [newRoomType, setNewRoomType] = useState({
        type: "",
        pricePerNight: "",
        totalRooms: "",
        capacity: 2,
        amenities: ""
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const [activeRes, inactiveRes] = await Promise.all([
                getAllHotels(),
                getInactiveHotels()
            ]);
            // Combine both lists
            setHotels([...activeRes.data, ...inactiveRes.data]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        try {
            await addHotel(newHotel);
            setShowAddModal(false);
            fetchHotels();
            setNewHotel({ name: "", city: "", state: "", address: "", description: "", starRating: 5, imageUrl: "" });
        } catch (err) {
            alert("Error adding hotel: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDisableHotel = async (id) => {
        if (!window.confirm("Are you sure you want to disable this hotel?")) return;
        try {
            await disableHotel(id);
            fetchHotels();
        } catch (err) {
            console.error(err);
            alert("Error disabling hotel: " + (err.response?.data?.message || err.message));
        }
    };

    const handleEnableHotel = async (id) => {
        if (!window.confirm("Are you sure you want to enable this hotel?")) return;
        try {
            await enableHotel(id);
            fetchHotels();
        } catch (err) {
            console.error(err);
            alert("Error enabling hotel: " + (err.response?.data?.message || err.message));
        }
    };

    const handleManageRooms = async (hotel) => {
        setSelectedHotel(hotel);
        setShowRoomModal(true);
        setRoomLoading(true);
        try {
            const res = await getHotelRoomTypes(hotel.hotelId);
            setRoomTypes(res.data);
        } catch (err) {
            console.error("Error fetching room types:", err);
            setRoomTypes([]);
        } finally {
            setRoomLoading(false);
        }
    };

    const handleAddRoomType = async (e) => {
        e.preventDefault();
        try {
            await addRoomType(selectedHotel.hotelId, newRoomType);
            // Refresh room types
            const res = await getHotelRoomTypes(selectedHotel.hotelId);
            setRoomTypes(res.data);
            setNewRoomType({
                type: "",
                pricePerNight: "",
                totalRooms: "",
                capacity: 2,
                amenities: ""
            });
        } catch (err) {
            alert("Error adding room type: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading hotels...</div>;

    const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: "white",
        padding: "2.5rem",
        borderRadius: "12px",
        width: "700px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    };

    const inputGroupStyle = {
        marginBottom: "1.2rem"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "600",
        color: "var(--oyo-black)"
    };

    const inputStyle = {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "4px",
        border: "1px solid var(--oyo-border)",
        fontSize: "1rem"
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Hotel Management</h1>
                    <p style={{ color: "var(--oyo-gray)" }}>Add, view, and manage hotels and their configurations.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="oyo-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>+</span> Add New Hotel
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
                {hotels.map(hotel => (
                    <div key={hotel.hotelId} style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "var(--card-shadow)", overflow: "hidden", border: "1px solid var(--oyo-border)" }}>
                        <div style={{ height: "180px", position: "relative" }}>
                            <img src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: "white", padding: "0.3rem 0.6rem", borderRadius: "4px", fontWeight: "700", fontSize: "0.8rem" }}>
                                ⭐ {hotel.starRating}
                            </div>
                        </div>
                        <div style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                <h3 style={{ fontSize: "1.2rem" }}>{hotel.name}</h3>
                                <span style={{
                                    fontSize: "0.75rem",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "4px",
                                    backgroundColor: hotel.status === 'ACTIVE' ? 'rgba(37, 160, 25, 0.1)' : 'rgba(238, 42, 36, 0.1)',
                                    color: hotel.status === 'ACTIVE' ? 'var(--oyo-green)' : 'var(--oyo-red)',
                                    fontWeight: "700"
                                }}>
                                    {hotel.status}
                                </span>
                            </div>
                            <p style={{ color: "var(--oyo-gray)", fontSize: "0.9rem", marginBottom: "1rem" }}>📍 {hotel.city}, {hotel.state}</p>

                            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
                                <button onClick={() => handleManageRooms(hotel)} className="oyo-btn-secondary" style={{ flex: 1, padding: "0.6rem", fontSize: "0.85rem" }}>Manage Rooms</button>
                                {hotel.status === 'ACTIVE' ? (
                                    <button
                                        onClick={() => handleDisableHotel(hotel.hotelId)}
                                        style={{
                                            flex: 1,
                                            padding: "0.6rem",
                                            fontSize: "0.85rem",
                                            backgroundColor: "transparent",
                                            color: "var(--oyo-red)",
                                            border: "1px solid var(--oyo-red)",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Disable
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEnableHotel(hotel.hotelId)}
                                        style={{
                                            flex: 1,
                                            padding: "0.6rem",
                                            fontSize: "0.85rem",
                                            backgroundColor: "transparent",
                                            color: "var(--oyo-green)",
                                            border: "1px solid var(--oyo-green)",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Enable
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Hotel Modal */}
            {showAddModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.5rem" }}>Add New Hotel</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                        </div>
                        <form onSubmit={handleAddHotel}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Hotel Name</label>
                                <input type="text" required style={inputStyle} value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>City</label>
                                    <input type="text" required style={inputStyle} value={newHotel.city} onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>State</label>
                                    <input type="text" required style={inputStyle} value={newHotel.state} onChange={(e) => setNewHotel({ ...newHotel, state: e.target.value })} />
                                </div>
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Full Address</label>
                                <textarea required style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={newHotel.address} onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={newHotel.description} onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Star Rating (1-5)</label>
                                    <input type="number" min="1" max="5" required style={inputStyle} value={newHotel.starRating} onChange={(e) => setNewHotel({ ...newHotel, starRating: parseInt(e.target.value) })} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Main Image URL</label>
                                    <input type="url" style={inputStyle} value={newHotel.imageUrl} onChange={(e) => setNewHotel({ ...newHotel, imageUrl: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="oyo-btn-primary" style={{ width: "100%", marginTop: "1rem", padding: "1rem" }}>Save Hotel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Room Management Modal */}
            {showRoomModal && selectedHotel && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalStyle, width: "800px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.5rem" }}>Manage Rooms - {selectedHotel.name}</h2>
                            <button onClick={() => setShowRoomModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
                            {/* List of existing rooms */}
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Existing Room Types</h3>
                                {roomLoading ? (
                                    <p>Loading rooms...</p>
                                ) : roomTypes.length === 0 ? (
                                    <p>No room types added yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {roomTypes.map((rt) => (
                                            <div key={rt.roomTypeId} style={{ padding: "1rem", border: "1px solid var(--oyo-border)", borderRadius: "8px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <h4 style={{ fontWeight: "600" }}>{rt.type}</h4>
                                                    <span style={{ fontWeight: "700", color: "var(--oyo-red)" }}>₹{rt.pricePerNight}</span>
                                                </div>
                                                <p style={{ fontSize: "0.85rem", color: "var(--oyo-gray)", margin: "0.5rem 0" }}>{rt.amenities}</p>
                                                <div style={{ fontSize: "0.8rem", display: "flex", gap: "1rem" }}>
                                                    <span>👥 {rt.capacity} Persons</span>
                                                    <span>🏩 {rt.totalRooms} Rooms</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add room type form */}
                            <div style={{ borderLeft: "1px solid var(--oyo-border)", paddingLeft: "2rem" }}>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Add New Room Type</h3>
                                <form onSubmit={handleAddRoomType}>
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Room Type (e.g. DELUXE)</label>
                                        <input
                                            placeholder="DELUXE, STANDARD, etc."
                                            type="text" required style={inputStyle}
                                            value={newRoomType.type}
                                            onChange={(e) => setNewRoomType({ ...newRoomType, type: e.target.value })}
                                        />
                                    </div>
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Price per Night</label>
                                        <input
                                            type="number" required style={inputStyle}
                                            value={newRoomType.pricePerNight}
                                            onChange={(e) => setNewRoomType({ ...newRoomType, pricePerNight: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Total Rooms</label>
                                            <input
                                                type="number" min="1" required style={inputStyle}
                                                value={newRoomType.totalRooms}
                                                onChange={(e) => setNewRoomType({ ...newRoomType, totalRooms: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Capacity</label>
                                            <input
                                                type="number" min="1" required style={inputStyle}
                                                value={newRoomType.capacity}
                                                onChange={(e) => setNewRoomType({ ...newRoomType, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Amenities (comma separated)</label>
                                        <textarea
                                            placeholder="WiFi, AC, etc."
                                            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                                            value={newRoomType.amenities}
                                            onChange={(e) => setNewRoomType({ ...newRoomType, amenities: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="oyo-btn-primary" style={{ width: "100%", padding: "0.8rem" }}>Add Room Type</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelManagement;
