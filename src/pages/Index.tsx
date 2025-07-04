
import React from 'react';
import Layout from '@/components/layout/Layout';
import ContactForm from "@/components/ContactForm";
import HeroSection from '@/components/home/HeroSection';
import PartnersSection from '@/components/home/PartnersSection';
import ProcessStepsSection from '@/components/home/ProcessStepsSection';
import NewFeaturesSection from '@/components/home/NewFeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FounderSection from '@/components/home/FounderSection';
import CTASection from '@/components/home/CTASection';

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
      <FounderSection />
      <ContactForm />
      <CTASection />
    </Layout>
  );
};

export default Index;
