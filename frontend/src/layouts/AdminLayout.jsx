import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
    return (
        <div>
            <Navbar />
            <header style={{ padding: "1rem", background: "#ffebee" }}>Admin Layout (Placeholder)</header>
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
