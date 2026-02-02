import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const CustomerLayout = () => {
    return (
        <div>
            <Navbar />
            <header style={{ padding: "1rem", background: "#e0f7fa" }}>Customer Layout</header>
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
