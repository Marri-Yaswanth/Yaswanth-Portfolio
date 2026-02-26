import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EducationPage from './pages/EducationPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import ContactPage from './pages/ContactPage';
import AddProjectPage from './pages/AddProjectPage';
import AddCertificationPage from './pages/AddCertificationPage';
import AddSkillPage from './pages/AddSkillPage';
import UpdateResumePage from './pages/UpdateResumePage';
import AdminManagePage from './pages/AdminManagePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/animations.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="skills/add" element={<AddSkillPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/add" element={<AddProjectPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="certifications/add" element={<AddCertificationPage />} />
        <Route path="resume/update" element={<UpdateResumePage />} />
        <Route path="yashu" element={<AdminManagePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;