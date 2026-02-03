import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ManagerLayout = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ManagerLayout;
