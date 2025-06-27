
import React from 'react';
import Layout from '@/components/layout/Layout';
import ContactForm from "@/components/ContactForm";
import HeroSection from '@/components/home/HeroSection';
import PartnersSection from '@/components/home/PartnersSection';
import ProcessStepsSection from '@/components/home/ProcessStepsSection';
import NewFeaturesSection from '@/components/home/NewFeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CTASection from '@/components/home/CTASection';
import LoanCalculatorSection from '@/components/home/LoanCalculatorSection';

/**
 * Homepage component that displays the main landing page
 * Contains hero section, features, and call-to-action sections
 * @returns {JSX.Element} The complete homepage layout
 */
const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PartnersSection />
      <ProcessStepsSection />
      <NewFeaturesSection />
      <BenefitsSection />
      <ContactForm />
      <CTASection />
      <LoanCalculatorSection />
    </Layout>
  );
};

export default Index;
