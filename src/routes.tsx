import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import DashboardPage from 'pages/DashboardPage';
import FriendsPage from 'pages/FriendsPage';
import FeedPage from 'pages/FeedPage';
import NotesPage from 'pages/NotesPage';
import ChatPage from 'pages/ChatPage';
import ResetPasswordPage from 'pages/ResetPasswordPage';
import ProtectedRoute from 'components/ProtectedRoute';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  <Route path="/reset-password" element={<ResetPasswordPage />} />

    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
    <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
    <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
