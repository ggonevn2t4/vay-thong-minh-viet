
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import OnePageLoanApplicationForm from '@/components/loan-flow/OnePageLoanApplicationForm';

createRoot(document.getElementById("root")!).render(<App />);
