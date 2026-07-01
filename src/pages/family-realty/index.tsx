import { Routes, Route } from "react-router-dom";
import { FRAuthProvider } from "./auth/FRAuthProvider";
import RequireFRAuth from "./auth/RequireFRAuth";
import FRLogin from "./pages/FRLogin";
import FRForgotPassword from "./pages/FRForgotPassword";
import FRResetPassword from "./pages/FRResetPassword";
import FRDashboard from "./pages/FRDashboard";

export default function FamilyRealty() {
  return (
    <FRAuthProvider>
      <Routes>
        <Route path="login" element={<FRLogin />} />
        <Route path="forgot-password" element={<FRForgotPassword />} />
        <Route path="reset-password" element={<FRResetPassword />} />
        <Route
          path="*"
          element={
            <RequireFRAuth>
              <FRDashboard />
            </RequireFRAuth>
          }
        />
      </Routes>
    </FRAuthProvider>
  );
}
