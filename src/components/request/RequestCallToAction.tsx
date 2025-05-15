
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RequestCallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 bg-blood-50 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Need Blood Urgently?</h2>
        <p className="max-w-2xl mx-auto mb-6">Submit your blood request and connect with potential donors quickly.</p>
        <Button 
          className="bg-blood hover:bg-blood-600"
          onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
        >
          Create Blood Request
        </Button>
      </div>
    </section>
  );
};

export default RequestCallToAction;
