// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
//import Dashboard from "./pages/Dashboard";

// Use default export
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
