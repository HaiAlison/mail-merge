import React from 'react';
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Redirect from "./pages/Redirect";
import MailForm from "./pages/MailForm";
import ListFile from "./components/Files/ListFile";
import Inbox from "./pages/Inbox";
import Recipient from "./components/Recipients/Recipient";
import Dashboard from "./components/Dashboard/Dashboard";
import Template from "./components/Template/Tempate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="auth/redirect" element={<Redirect />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/mails/send" element={
          <ProtectedRoute>
            <MailForm />
          </ProtectedRoute>
        } />
        <Route path="/mails/sent-list" element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } />
        <Route path="/mails/template" element={
          <ProtectedRoute>
            <Template />
          </ProtectedRoute>
        } />
        <Route path="/recipient" element={
          <ProtectedRoute>
            <Recipient />
          </ProtectedRoute>
        } />
        <Route path="/files" element={
          <ProtectedRoute>
            <ListFile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
