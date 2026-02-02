import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
    return (
        <div>
            <Navbar />
            <header style={{ padding: "1rem", background: "#f4f4f4" }}>Public Layout</header>
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
