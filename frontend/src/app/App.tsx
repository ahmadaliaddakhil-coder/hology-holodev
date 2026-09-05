import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { FarmerDashboard } from "../pages/farmer/FarmerDashboard";
import { LandListPage } from "../pages/farmer/LandListPage";
import { AddLandPage } from "../pages/farmer/AddLandPage";
import { LocationMapPage } from "../pages/farmer/LocationMapPage";
import { CropContextPage } from "../pages/farmer/CropContextPage";
import { LandDetailPage } from "../pages/farmer/LandDetailPage";
import { LandReviewPage } from "../pages/farmer/LandReviewPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/lands" element={<LandListPage />} />
        <Route path="/farmer/lands/new" element={<AddLandPage />} />
        <Route path="/farmer/lands/new/location" element={<LocationMapPage />} />
        <Route path="/farmer/lands/new/details" element={<CropContextPage />} />
        <Route path="/farmer/lands/:landId" element={<LandDetailPage />} />
        <Route path="/farmer/lands/:landId/review" element={<LandReviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
