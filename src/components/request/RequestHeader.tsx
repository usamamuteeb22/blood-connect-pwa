
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RequestHeader = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-red-50 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Blood <span className="text-blood">Requests</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          View all active blood requests or create your own request if you need blood.
        </p>
        <Button 
          className="bg-blood hover:bg-blood-600 text-white"
          onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
        >
          I Need Blood
        </Button>
      </div>
    </section>
  );
};

export default RequestHeader;
