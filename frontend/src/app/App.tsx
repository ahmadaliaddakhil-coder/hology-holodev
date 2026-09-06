import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { FarmerDashboard } from "../pages/farmer/FarmerDashboard";
import { LandListPage } from "../pages/farmer/LandListPage";
import { AddLandPage } from "../pages/farmer/AddLandPage";
import { LocationMapPage } from "../pages/farmer/LocationMapPage";
import { CropContextPage } from "../pages/farmer/CropContextPage";
import { LandDetailPage } from "../pages/farmer/LandDetailPage";
import { LandReviewPage } from "../pages/farmer/LandReviewPage";
import { IrrigationPulsePage } from "../pages/farmer/IrrigationPulsePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { ProfilePage } from "../pages/farmer/ProfilePage";
import HistoryPage from "../pages/farmer/HistoryPage";
import { HistoryDetailPage } from "../pages/farmer/HistoryDetailPage";
import { ConditionWaterPage } from "../pages/farmer/ConditionWaterPage";
import { ConditionSummaryPage } from "../pages/farmer/ConditionSummaryPage";
import { ActionAlternativesPage } from "../pages/farmer/ActionAlternativesPage";
import { OptionalReviewPage } from "../pages/farmer/OptionalReviewPage";
import { SelectReviewerPage } from "../pages/farmer/SelectReviewerPage";
import { FinalDecisionPage } from "../pages/farmer/FinalDecisionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
        
        <Route path="/farmer/lands" element={<ProtectedRoute><LandListPage /></ProtectedRoute>} />
        
        <Route path="/farmer/lands/new" element={<ProtectedRoute><AddLandPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/new/location" element={<ProtectedRoute><LocationMapPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/new/details" element={<ProtectedRoute><CropContextPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId" element={<ProtectedRoute><LandDetailPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/review" element={<ProtectedRoute><LandReviewPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/irrigation" element={<ProtectedRoute><IrrigationPulsePage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/condition" element={<ProtectedRoute><ConditionWaterPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/summary" element={<ProtectedRoute><ConditionSummaryPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/action-alternatives" element={<ProtectedRoute><ActionAlternativesPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/optional-review" element={<ProtectedRoute><OptionalReviewPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/select-reviewer" element={<ProtectedRoute><SelectReviewerPage /></ProtectedRoute>} />
        <Route path="/farmer/lands/:landId/final-decision" element={<ProtectedRoute><FinalDecisionPage /></ProtectedRoute>} />
        
        <Route path="/farmer/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        <Route path="/farmer/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/farmer/history/:historyId" element={<ProtectedRoute><HistoryDetailPage /></ProtectedRoute>} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
