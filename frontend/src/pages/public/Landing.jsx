import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllHotels,
    getHotelsByCity,
    searchHotelsByName,
    sortHotelsByRating,
    searchRoomsUnderPrice,
    sortRoomsPriceLowToHigh,
    sortRoomsPriceHighToLow
} from "../../api/hotel.api";
import SearchFilters from "../../components/SearchFilters";

const Landing = () => {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState(null); // For price-based search results
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
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
        try {
            let res;
            if (type === "city") res = await getHotelsByCity(value);
            else if (type === "name") res = await searchHotelsByName(value);
            else if (type === "rating") {
                res = await sortHotelsByRating();
                setHotels(res.data);
                setRooms(null);
                return;
            } else if (type === "price") {
                res = await searchRoomsUnderPrice(value);
                setRooms(res.data);
                setHotels([]);
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

    if (loading) return <div>Loading hotels...</div>;

    return (
        <div>
            <h1>BookInn – Find Your Perfect Stay</h1>
            <SearchFilters onFilter={handleFilter} />
            <button onClick={fetchHotels}>Show All Hotels</button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                {hotels.map((hotel) => (
                    <div key={hotel.hotelId} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                        {hotel.imageUrl && <img src={hotel.imageUrl} alt={hotel.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />}
                        <h3>{hotel.name}</h3>
                        <p>{hotel.city}, {hotel.state}</p>
                        <p>Rating: {hotel.starRating}⭐</p>
                        <Link to={`/hotels/${hotel.hotelId}`}>View Details</Link>
                    </div>
                ))}

                {rooms && rooms.map((room) => (
                    <div key={`${room.hotelId}-${room.roomTypeId}`} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                        {room.hotelImage && <img src={room.hotelImage} alt={room.hotelName} style={{ width: "100%", height: "150px", objectFit: "cover" }} />}
                        <h3>{room.hotelName || "Unknown Hotel"}</h3>
                        <p><strong>Address:</strong> {room.address || "No address"}</p>
                        <p><strong>Location:</strong> {room.city}, {room.state}</p>
                        <p><strong>Room Type:</strong> {room.type || "Standard"}</p>
                        <p style={{ color: "green", fontSize: "1.2rem" }}><strong>₹{room.pricePerNight} / night</strong></p>
                        <Link to={`/hotels/${room.hotelId}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
