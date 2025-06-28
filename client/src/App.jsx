import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";

import { store } from "./Redux/store";
import { socket } from "./socket";

import Login from "./authorizationpages/Login";
import Signup from "./authorizationpages/Signup";
import ProtectedRoutes from "./ProtectedRoutes";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Alert from "./pages/Alert";
import Messages from "./pages/Messages";
import MessagePanel from "../src/components/MessagesPanel";

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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
            path="direct-message"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <MessagePanel/>
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
            path="alerts"
            element={
              <ProtectedRoutes>
                <PageWrapper>
                  <Alert />
                </PageWrapper>
              </ProtectedRoutes>
            }
          />

          {/* 📩 Messages Page */}
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
                  <MessagePanel />
                </ProtectedRoutes>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("receiveMessage", (data) => {
      console.log("📨 New message:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
