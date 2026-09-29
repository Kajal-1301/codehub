import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default DashboardLayout;