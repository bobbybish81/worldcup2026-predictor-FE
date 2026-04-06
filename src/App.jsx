import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import GroupTables from "./components/GroupTables";
import QualifiedTeams from "./components/QualifiedTeams";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupStage from "./pages/GroupStage";
import Leaderboard from "./pages/Leaderboard";
import KnockoutStage from "./pages/KnockoutStage";
import AdminDashboard from "./pages/AdminDashboard";

import RequireAuth from "./context/RequireAuth";
import AdminRoute from "./context/AdminRoute";

import "./styles/app.css";

function App() {
  return (
    <Routes>
     <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/group" element={
        <RequireAuth>
          <GroupStage />
        </RequireAuth>} />
      <Route path="/knockout" element={
        <RequireAuth>
          <KnockoutStage />
        </RequireAuth>} />
      <Route path="/tables" element={
        <RequireAuth>
          <GroupTables />
        </RequireAuth>} />
      <Route path="/knockout/qualified" element={
        <RequireAuth>
          <QualifiedTeams />
        </RequireAuth>} />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;