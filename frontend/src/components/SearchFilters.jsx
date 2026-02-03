import React, { useState } from "react";

const SearchFilters = ({ onFilter }) => {
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [sort, setSort] = useState("asc");

    const filterGroupStyle = {
        marginBottom: "2rem",
        borderBottom: "1px solid var(--oyo-border)",
        paddingBottom: "1.5rem"
    };

    const labelStyle = {
        display: "block",
        fontWeight: "700",
        marginBottom: "0.8rem",
        fontSize: "0.9rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    };

    const inputStyle = {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "4px",
        border: "1px solid var(--oyo-border)",
        marginBottom: "0.8rem"
    };

    const sidebarStyle = {
        width: "var(--sidebar-width)",
        padding: "1.5rem",
        backgroundColor: "#fff",
        borderRight: "1px solid var(--oyo-border)",
        height: "calc(100vh - 80px)",
        position: "sticky",
        top: "80px",
        overflowY: "auto"
    };

    return (
        <aside style={sidebarStyle}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Filters</h2>

            {/* City Filter */}
            <div style={filterGroupStyle}>
                <label style={labelStyle}>Popular Locations</label>
                <input
                    style={inputStyle}
                    placeholder="Search City (e.g. Mumbai)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button
                    className="oyo-btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => onFilter("city", city)}
                >
                    Search City
                </button>
            </div>

            {/* Name Filter */}
            <div style={filterGroupStyle}>
                <label style={labelStyle}>Hotel Name</label>
                <input
                    style={inputStyle}
                    placeholder="Explore by name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    className="oyo-btn-secondary"
                    style={{ width: "100%" }}
                    onClick={() => onFilter("name", name)}
                >
                    Search Name
                </button>
            </div>

            {/* Rating Filter */}
            <div style={filterGroupStyle}>
                <label style={labelStyle}>Guest Ratings</label>
                <button
                    className="oyo-btn-secondary"
                    style={{ width: "100%", textAlign: "left" }}
                    onClick={() => onFilter("rating", null)}
                >
                    ⭐ Sort by Rating (High)
                </button>
            </div>

            {/* Price Sort Filter */}
            <div style={filterGroupStyle}>
                <label style={labelStyle}>Price Preference</label>
                <select
                    style={inputStyle}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
                <button
                    className="oyo-btn-secondary"
                    style={{ width: "100%" }}
                    onClick={() => onFilter("sort", sort)}
                >
                    Update Sorting
                </button>
            </div>
        </aside>
    );
};

export default SearchFilters;
