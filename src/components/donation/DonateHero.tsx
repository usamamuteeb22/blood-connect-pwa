
import { Button } from "@/components/ui/button";

interface DonateHeroProps {
  onCheckEligibility: () => void;
}

const DonateHero = ({ onCheckEligibility }: DonateHeroProps) => {
  return (
    <section className="py-16 bg-red-50 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Become a <span className="text-blood">Life Saver</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Your blood donation can help save up to three lives. Join thousands of donors and make a difference today.
        </p>
        <Button 
          className="bg-blood hover:bg-blood-600 text-white px-8 py-6 text-lg"
          onClick={onCheckEligibility}
        >
          Check Eligibility
        </Button>
      </div>
    </section>
  );
};

export default DonateHero;
