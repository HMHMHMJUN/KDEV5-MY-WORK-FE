// src/routes/MainRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import PostPage from "@/features/post/pages/PostPage";
// import LoginPage from "@features/auth/pages/LoginPage";
import MainLayout from "@/layouts/MainLayout";

export default function MainRoutes() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id/posts" element={<PostPage />} />
      </Route>
    </Routes>
  );
}
