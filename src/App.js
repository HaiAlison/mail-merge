import React from 'react';
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Redirect from "./pages/Redirect";
import MailForm from "./pages/MailForm";
import ListFile from "./components/Files/ListFile";
import Inbox from "./pages/Inbox";
import Sender from "./components/Senders/Sender";

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
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/mails/send" element={
          <ProtectedRoute>
            <MailForm />
          </ProtectedRoute>
        } />
        <Route path="/mails/inbox" element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } />
        <Route path="/sender" element={
          <ProtectedRoute>
            <Sender />
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
