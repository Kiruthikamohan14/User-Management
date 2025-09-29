import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { message } from "antd"; // 👈 import message
import Login from "./pages/Login";
import UsersList from "./pages/UsersPage";
import PrivateRoute from "./components/PrivateRoute";

message.config({
  getContainer: () => document.body,
  top: 100,
  duration: 2,
});

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersList />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
