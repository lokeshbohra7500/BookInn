import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import HotelDetails from "../pages/public/HotelDetails";
import CustomerDashboard from "../pages/customer/Dashboard";
import Checkout from "../pages/customer/Checkout";
import MyBookings from "../pages/customer/MyBookings";
import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import HotelManagement from "../pages/admin/HotelManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import PaymentManagement from "../pages/admin/PaymentManagement";
import ManagerDashboard from "../pages/manager/Dashboard";

import RequireAuth from "../auth/RequireAuth";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />
            </Route>

            {/* Customer Routes */}
            <Route
                element={
                    <RequireAuth>
                        <CustomerLayout />
                    </RequireAuth>
                }
            >
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/checkout/:id" element={<Checkout />} />
                <Route path="/customer/bookings" element={<MyBookings />} />
            </Route>

            {/* Admin Routes */}
            <Route
                element={
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/hotels" element={<HotelManagement />} />
                <Route path="/admin/bookings" element={<BookingManagement />} />
                <Route path="/admin/payments" element={<PaymentManagement />} />
            </Route>

            {/* Manager Routes */}
            <Route
                element={
                    <RequireAuth>
                        <ManagerLayout />
                    </RequireAuth>
                }
            >
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
