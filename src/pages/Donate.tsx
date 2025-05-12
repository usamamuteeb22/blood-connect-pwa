
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import RequestForm from "@/components/donation/RequestForm";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("donate");
  
  // Eligibility criteria
  const eligibilityCriteria = [
    { text: "You must be at least 18 years old", icon: <Check className="h-4 w-4" /> },
    { text: "You must weigh at least 110 pounds (50 kg)", icon: <Check className="h-4 w-4" /> },
    { text: "You must be in good health and feeling well", icon: <Check className="h-4 w-4" /> },
    { text: "You must not have donated blood in the last 8 weeks", icon: <Check className="h-4 w-4" /> },
  ];
  
  // Donation process steps
  const donationProcess = [
    {
      title: "Registration",
      description: "Complete the donor registration form with your personal details",
    },
    {
      title: "Screening",
      description: "Brief health check including blood pressure, pulse, and hemoglobin levels",
    },
    {
      title: "Donation",
      description: "The actual donation takes only 8-10 minutes, with the entire process taking about an hour",
    },
    {
      title: "Refreshments",
      description: "Rest and enjoy light refreshments to help your body recover",
    },
  ];

  // Handle button clicks
  const handleCheckEligibility = () => {
    toast({
      title: "Eligibility Check",
      description: "Based on the criteria, you appear to be eligible to donate blood. Please consult with a healthcare professional for a final determination.",
    });
  };

  const handleFullEligibilityCheck = () => {
    toast({
      title: "Full Eligibility Guide",
      description: "Please answer a few questions to determine your eligibility to donate blood.",
    });
    // In a real app, this would open a modal or navigate to a detailed eligibility questionnaire
  };

  const handleFindDonationCenters = () => {
    toast({
      title: "Donation Centers",
      description: "We're finding donation centers near your location.",
    });
    // In a real app, this would show a map of nearby donation centers
  };

  const handleScheduleDonation = () => {
    toast({
      title: "Schedule Donation",
      description: "Please sign in to schedule your blood donation appointment.",
    });
    navigate("/auth");
  };

  const handleEmergencyRequest = () => {
    toast({
      variant: "destructive",
      title: "Emergency Request Initiated",
      description: "Our team will contact you immediately for this emergency blood request.",
    });
    setActiveTab("request");
  };

  const handleViewPastRequests = () => {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your past blood requests.",
    });
    navigate("/auth");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
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
              onClick={handleCheckEligibility}
            >
              Check Eligibility
            </Button>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-lg grid-cols-2">
                  <TabsTrigger value="donate">I Want to Donate</TabsTrigger>
                  <TabsTrigger value="request">I Need Blood</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="donate">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Eligibility Criteria</CardTitle>
                        <CardDescription>
                          Check if you're eligible to donate blood
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {eligibilityCriteria.map((criterion, index) => (
                            <li key={index} className="flex items-center">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 mr-3">
                                {criterion.icon}
                              </span>
                              <span>{criterion.text}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full mt-6 bg-blood hover:bg-blood-600"
                          onClick={handleFullEligibilityCheck}
                        >
                          Check Full Eligibility
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Important Information</CardTitle>
                        <CardDescription>
                          What you need to know before donating
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Before Donation</h3>
                          <p className="text-sm text-gray-600">
                            Drink plenty of fluids, eat a healthy meal, and get adequate sleep the night before.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">During Donation</h3>
                          <p className="text-sm text-gray-600">
                            The process is safe and supervised by healthcare professionals. It takes about 8-10 minutes.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">After Donation</h3>
                          <p className="text-sm text-gray-600">
                            Rest for 10-15 minutes, have a snack and drink, and avoid strenuous activities for 24 hours.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Donation Process</CardTitle>
                        <CardDescription>
                          What to expect when you donate blood
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {donationProcess.map((step, index) => (
                            <div key={index} className="flex">
                              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blood text-white font-bold mr-4">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Register for Donation</CardTitle>
                        <CardDescription>
                          Schedule your blood donation
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Ready to donate? Register here and we'll help you schedule your donation at a nearby blood bank or donation center.
                        </p>
                        <div className="flex space-x-3">
                          <Button 
                            className="flex-1 bg-blood hover:bg-blood-600"
                            onClick={handleFindDonationCenters}
                          >
                            Find Donation Centers
                          </Button>
                          <Button 
                            className="flex-1" 
                            variant="outline"
                            onClick={handleScheduleDonation}
                          >
                            Schedule Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="request">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <RequestForm />
                  </div>
                  
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Emergency Requests</CardTitle>
                        <CardDescription>For critical and urgent blood needs</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                          For life-threatening situations requiring immediate blood transfusion, please use our emergency channel.
                        </p>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={handleEmergencyRequest}
                        >
                          Emergency Request
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Status</CardTitle>
                        <CardDescription>Track your ongoing blood requests</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                          <p className="text-gray-500 mb-4">You don't have any active blood requests</p>
                          <Button 
                            variant="outline"
                            onClick={handleViewPastRequests}
                          >
                            View Past Requests
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
