// import { useState } from 'react'
import "./App.css";
import Messages from "./pages/Messages";
import Login from "./authorizationpages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./authorizationpages/Signup";
import Home from "./pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Alert from "./pages/Alert"
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/Create"
              element={
                <ProtectedRoutes>
                  <Create />
                </ProtectedRoutes>
              }
            />

            {/* Protected Route for Explore */}

            <Route
              path="/Explore"
              element={
                <ProtectedRoutes>
                  <Explore />
                </ProtectedRoutes>
              }
            />

            {/* Protected Route for Profile */}

            <Route
              path="/home"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
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
                    <Home />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="explore"
                element={
                  <ProtectedRoutes>
                    <Explore />
                  </ProtectedRoutes>
                }
              />
            <Route
              path="Create"
              element={
                <ProtectedRoutes>
                  <Create />
                </ProtectedRoutes>
              }
            />
            <Route
              path="explore"
              element={
                <ProtectedRoutes>
                  <Explore />
                </ProtectedRoutes>
              }
            />
                        <Route
              path="alerts"
              element={
                <ProtectedRoutes>
                  <Alert/>
                </ProtectedRoutes>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoutes>
                  <Messages/>
                </ProtectedRoutes>
              }
            />

            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
