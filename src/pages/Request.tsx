
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StandardRequestForm from "@/components/request/StandardRequestForm";

const Request = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      answer: "No, our platform is designed for peer-to-peer blood donation. You can request blood directly from donors without a prescription.",
    },
    {
      question: "Can I request blood for someone else?",
      answer: "Yes, you can request blood on behalf of a family member or friend. Just provide their details in the request form.",
    },
    {
      question: "What information do I need to provide for a blood request?",
      answer: "You'll need to provide your name, blood type, contact information, city, and address where the donation is needed.",
    },
    {
      question: "Is there a fee for using OneDrop's blood request service?",
      answer: "Our platform is free to use. We connect donors and recipients directly without any intermediary fees.",
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
            <Button 
              className="bg-blood hover:bg-blood-600 text-white"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/dashboard");
                } else {
                  navigate("/auth");
                }
              }}
            >
              {isAuthenticated ? "View Your Requests" : "Sign In to Request Blood"}
            </Button>
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
              <StandardRequestForm />
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Request Status Tracker</CardTitle>
                  <CardDescription>Track the progress of your blood request</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    {isAuthenticated ? (
                      <>
                        <p className="text-gray-500 mb-4">View all your blood requests in one place</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/dashboard")}
                        >
                          Go to Dashboard
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-4">Sign in to view your blood requests</p>
                        <Button 
                          variant="outline"
                          onClick={() => navigate("/auth")}
                        >
                          Sign In
                        </Button>
                      </>
                    )}
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
