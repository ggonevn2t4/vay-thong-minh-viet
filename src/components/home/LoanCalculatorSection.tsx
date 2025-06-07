
import LoanCalculator from "@/components/LoanCalculator";

/**
 * Section component that wraps the loan calculator
 * Provides consistent styling and layout for the calculator on the homepage
 * @returns {JSX.Element} The loan calculator section
 */
const LoanCalculatorSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <LoanCalculator />
        </div>
      </div>
    </section>
  );
};

export default LoanCalculatorSection;
