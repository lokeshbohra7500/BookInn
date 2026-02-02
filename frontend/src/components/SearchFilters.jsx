import React, { useState } from "react";

const SearchFilters = ({ onFilter }) => {
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [rating, setRating] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("asc");

    return (
        <div style={{ padding: "1rem", border: "1px solid #ddd", marginBottom: "1rem" }}>
            <h3>Search & Filters</h3>
            <div>
                <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <button onClick={() => onFilter("city", city)}>Search by City</button>
            </div>
            <div>
                <input placeholder="Hotel Name" value={name} onChange={(e) => setName(e.target.value)} />
                <button onClick={() => onFilter("name", name)}>Search by Name</button>
            </div>
            <div>
                <button onClick={() => onFilter("rating", null)}>Sort by Rating (High to Low)</button>
            </div>
            <div>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
                <button onClick={() => onFilter("sort", sort)}>Sort by Price</button>
            </div>
        </div>
    );
};

export default SearchFilters;
