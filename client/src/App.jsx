import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { store } from "./Redux/store";
import SocketHandler from "./socketHandler";
import ProtectedRoutes from "./ProtectedRoutes";

import Login from "./authorizationpages/Login";
import Signup from "./authorizationpages/Signup";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Alert from "./pages/Alert";
import Messages from "./pages/Messages";
import MessagePanel from "./components/MessagesPanel";
import Profile from "./pages/Profile";
import PublicUserProfile from "./pages/PublicUserProfile";
import Setting from "./pages/Setting";

// ✅ Reusable wrapper for page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// ✅ Routes component with transitions, declared inside BrowserRouter
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route
            path="home"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Home />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />
          <Route
            path="explore"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Explore />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Create />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Setting />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />
          <Route
            path="messages"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Messages />
                </PageWrapper>
              </ProtectedRoutes>
            }
          >
            <Route
              path="chat/:userId"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <MessagePanel />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
          </Route>
          <Route
            path="direct-message"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <MessagePanel />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* 👤 Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <PageWrapper>
                <Profile />
              </PageWrapper>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoutes>
              <PageWrapper>
                <PublicUserProfile />
              </PageWrapper>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// ✅ Main App with BrowserRouter wrapping everything
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SocketHandler />
        <AnimatedRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
