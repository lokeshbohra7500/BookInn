import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <Link to="/">Home</Link> |{" "}
            {user ? (
                <>
                    {user.role === "CUSTOMER" && <Link to="/customer/dashboard">Dashboard</Link>}
                    {user.role === "ADMIN" && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                    {user.role === "MANAGER" && <Link to="/manager/dashboard">Manager Dashboard</Link>}
                    {" | "}
                    <button onClick={handleLogout}>Logout</button>
                    <span style={{ marginLeft: "10px" }}>({user.email})</span>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
