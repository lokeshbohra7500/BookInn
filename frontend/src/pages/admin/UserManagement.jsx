import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../api/user.api";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading users...</div>;

    const tableHeaderStyle = {
        backgroundColor: "white",
        padding: "1rem 1.5rem",
        borderBottom: "2px solid var(--oyo-border)",
        textAlign: "left",
        fontWeight: "700",
        color: "var(--oyo-gray)",
        textTransform: "uppercase",
        fontSize: "0.85rem"
    };

    const tableCellStyle = {
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--oyo-border)",
        color: "var(--oyo-black)",
        fontSize: "1rem"
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>User Management</h1>
                    <p style={{ color: "var(--oyo-gray)" }}>Manage and monitor all registered users in the system.</p>
                </div>
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "0.8rem 1rem",
                            borderRadius: "8px",
                            border: "1px solid var(--oyo-border)",
                            width: "300px",
                            fontSize: "1rem"
                        }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "var(--card-shadow)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>User</th>
                            <th style={tableHeaderStyle}>Email</th>
                            <th style={tableHeaderStyle}>Location</th>
                            <th style={tableHeaderStyle}>Role</th>
                            <th style={tableHeaderStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.userId} style={{ transition: "background 0.2s ease" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <td style={tableCellStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--oyo-light-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "var(--oyo-red)" }}>
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "700" }}>{user.firstName} {user.lastName}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--oyo-gray)" }}>ID: #{user.userId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={tableCellStyle}>{user.email}</td>
                                <td style={tableCellStyle}>{user.city}, {user.state}</td>
                                <td style={tableCellStyle}>
                                    <span style={{
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        backgroundColor: user.role === 'ADMIN' ? 'rgba(238, 42, 36, 0.1)' : 'rgba(118, 118, 118, 0.1)',
                                        color: user.role === 'ADMIN' ? 'var(--oyo-red)' : 'var(--oyo-gray)'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={tableCellStyle}>
                                    <span style={{ color: user.status === 'ACTIVE' ? 'var(--oyo-green)' : 'var(--oyo-red)', fontWeight: "600" }}>
                                        ● {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--oyo-gray)" }}>
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
