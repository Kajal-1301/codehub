import React, { useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "./authContext";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import UserProfile from "./components/user/UserProfile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import LandingPage from "./components/landingPage/LandingPage";
import CreateRepository from "./components/repo/CreateRepo";
import RepoPage from "./components/repo/RepoPage";
import CreateIssue from "./components/issue/CreateIssue";
import IssuePage from "./components/issue/issuePage";
import AllRepositories from "./components/repo/AllRepositories";
import AllIssues from "./components/issue/AllIssues";

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        // Restore logged-in user after page refresh

        if (userId && !currentUser) {
            setCurrentUser(userId);
        }

        // User is NOT logged in
        if (
            !userId &&
            location.pathname !== "/" &&
            location.pathname !== "/login" &&
            location.pathname !== "/signup"
        ) {
            navigate("/login", { replace: true });
        }

        // User IS logged in but trying to visit login
        if (
            userId &&
            (location.pathname === "/login" || location.pathname === "/signup")
        ) {
            navigate("/dashboard", { replace: true });
        }
    }, [currentUser, location.pathname, navigate, setCurrentUser]);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/userProfile/:id" element={<UserProfile />} />
                <Route path="/repo/create" element={<CreateRepository />} />
                <Route path="/repo/id/:id" element={<RepoPage />} />
                <Route path="/repo/id/:id/issue/create" element={<CreateIssue />} />
                <Route path="/issue/:issueId" element={<IssuePage />} />
                <Route path="/repositories" element={<AllRepositories />} />
                <Route path="/issues" element={<AllIssues />} />
            </Route>
        </Routes>
    );

};

export default ProjectRoutes;