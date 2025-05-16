
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RequestCallToAction = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-8">
            Your donation can save up to three lives. Join our community of donors today and make a real impact.
          </p>
          <Link to="/donate">
            <Button className="bg-blood hover:bg-blood-600 text-white px-8 py-6 text-lg">
              I Want to Donate
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RequestCallToAction;
