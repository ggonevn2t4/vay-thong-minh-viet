
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx'
import './index.css'

// Use environment variable or a hardcoded key for development
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_Z2l2aW5nLWNoaW1wYW56ZWUtNjkuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Demo key for development only

// Ensure the key is not the placeholder
if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("REPLACE_WITH_YOUR")) {
  console.error("Please set your VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
