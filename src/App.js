import React from 'react';
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Redirect from "./pages/Redirect";
import MailForm from "./pages/MailForm";
import Team from "./pages/Team";
import Files from "./pages/Files";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="auth/redirect" element={<Redirect/>}/>
        <Route path="/" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="/mails" element={
          <ProtectedRoute>
            <MailForm/>
          </ProtectedRoute>
        }/>
        <Route path="/team" element={
          <ProtectedRoute>
            <Team/>
          </ProtectedRoute>
        }/>
        <Route path="/files" element={
          <ProtectedRoute>
            <Files/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
