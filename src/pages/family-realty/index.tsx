import { Routes, Route } from "react-router-dom";
import { FRAuthProvider } from "./auth/FRAuthProvider";
import RequireFRAuth from "./auth/RequireFRAuth";
import FRLogin from "./pages/FRLogin";
import FRForgotPassword from "./pages/FRForgotPassword";
import FRResetPassword from "./pages/FRResetPassword";
import FRDashboard from "./pages/FRDashboard";
import { I18nProvider } from "./lib/i18n";

export default function FamilyRealty() {
  return (
    <I18nProvider>
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
    </I18nProvider>
  );
}
