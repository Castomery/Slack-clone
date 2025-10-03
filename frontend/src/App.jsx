import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { Navigate, Route, Routes } from "react-router";

function App() {
  return (
    <>
      <SignedIn>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to={"/"} replace />} />
        </Routes>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={"/auth"} replace />} />
        </Routes>
        <SignInButton mode="modal" />
      </SignedOut>
    </>
  );
}

export default App;
