import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import ProtectedRoute from '../components/layout/protectedLayout';
import Admin403 from '../pages/Admin403';
import Overview from '../pages/dashboard/overview';

const DefaultRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect dari root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path='/403' element={<Admin403 />} />
        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        {/* Halaman 404/Not Found (Opsional) */}
        <Route path="*" element={<h1 className="text-3xl text-center mt-20">404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default DefaultRouter;