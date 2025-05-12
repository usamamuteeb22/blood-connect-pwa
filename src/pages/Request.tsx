
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequestForm from "@/components/donation/RequestForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Request = () => {
  const bloodTypeInfo = [
    {
      type: "A+",
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
      canDonateTo: ["A+", "AB+"],
    },
    {
      type: "A-",
      canReceiveFrom: ["A-", "O-"],
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
    },
    {
      type: "B+",
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
      canDonateTo: ["B+", "AB+"],
    },
    {
      type: "B-",
      canReceiveFrom: ["B-", "O-"],
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
    },
    {
      type: "AB+",
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canDonateTo: ["AB+"],
    },
    {
      type: "AB-",
      canReceiveFrom: ["A-", "B-", "AB-", "O-"],
      canDonateTo: ["AB+", "AB-"],
    },
    {
      type: "O+",
      canReceiveFrom: ["O+", "O-"],
      canDonateTo: ["A+", "B+", "AB+", "O+"],
    },
    {
      type: "O-",
      canReceiveFrom: ["O-"],
      canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
  ];

  const faqs = [
    {
      question: "How quickly can I receive blood after submitting a request?",
      answer: "Once your request is verified, we typically find a match within 24-48 hours. In emergency situations, we prioritize requests and can often find donors within hours.",
    },
    {
      question: "Do I need a doctor's prescription to request blood?",
      answer: "Yes, all blood requests require a valid prescription or medical documentation from a licensed healthcare provider.",
    },
    {
      question: "Can I request blood for someone else?",
      answer: "Yes, you can request blood on behalf of a family member or friend. You'll need to provide their medical information and documentation.",
    },
    {
      question: "What information do I need to provide for a blood request?",
      answer: "You'll need to provide the patient's name, blood type, quantity needed, reason for transfusion, hospital name, doctor's contact information, and medical documentation.",
    },
    {
      question: "Is there a fee for using OneDrop's blood request service?",
      answer: "Our platform is free to use. However, there may be costs associated with blood processing, testing, and delivery which vary by location and healthcare facility.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-red-50 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Request <span className="text-blood">Blood</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Need blood urgently? Our platform connects you with compatible donors quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-blood hover:bg-blood-600 text-white">
                Standard Request
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Emergency Request
              </Button>
            </div>
          </div>
        </section>
        
        {/* Request Form Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Submit Your Request</h2>
              <p className="text-gray-700 mb-6">
                Fill out the form below with accurate information to help us find the right blood match for your needs.
              </p>
              <RequestForm />
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Request Status Tracker</CardTitle>
                  <CardDescription>Track the progress of your blood request</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 mb-4">You don't have any active blood requests</p>
                    <Button variant="outline">Sign In to View Your Requests</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>Our support team is available 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      If you need assistance with your blood request or have any questions, our support team is here to help.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button className="bg-blood hover:bg-blood-600 flex-1">
                        Contact Support
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Call Helpline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Blood Compatibility Chart */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Blood Type Compatibility Chart</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-blood text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Blood Type</th>
                    <th className="py-3 px-4 text-left">Can Receive From</th>
                    <th className="py-3 px-4 text-left">Can Donate To</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodTypeInfo.map((blood, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-4 px-4 font-medium">{blood.type}</td>
                      <td className="py-4 px-4">{blood.canReceiveFrom.join(", ")}</td>
                      <td className="py-4 px-4">{blood.canDonateTo.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Request;
