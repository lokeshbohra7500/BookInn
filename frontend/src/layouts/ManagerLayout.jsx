import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ManagerLayout = () => {
    return (
        <div>
            <Navbar />
            <header style={{ padding: "1rem", background: "#fff3e0" }}>Manager Layout (Placeholder)</header>
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;
