import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useParams } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/Auth";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import FetchSharedContent from "./components/FetchSharedContent";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared-content"
          element={
            <ProtectedRoute>
              <FetchSharedContentWrapper />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />{" "}
      </Routes>
    </Router>
  );
}

const FetchSharedContentWrapper = () => {
  const { link } = useParams(); // Get the link from URL params
  return <FetchSharedContent link={link} />;
};

export default App;
