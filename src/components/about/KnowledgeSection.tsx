
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KnowledgeSection = () => {
  const knowledgeItems = [
    {
      title: "Blood Types Compatibility",
      content: "Understanding blood type compatibility is crucial for safe transfusions. Type O- is the universal donor, while AB+ is the universal recipient. Each blood type has specific compatibility rules that ensure patient safety."
    },
    {
      title: "Donation Process",
      content: "The blood donation process typically takes 45-60 minutes. This includes registration, health screening, the actual donation (8-10 minutes), and recovery time. Donors can give whole blood every 8 weeks."
    },
    {
      title: "Health Benefits of Donating",
      content: "Regular blood donation can help reduce iron levels, lower blood pressure, and provide health screenings. It also gives donors a sense of purpose knowing they're helping save lives in their community."
    },
    {
      title: "Eligibility Requirements",
      content: "Donors must be at least 18 years old, weigh at least 50kg, and be in good health. Certain medications, travel history, and medical conditions may temporarily or permanently defer donation eligibility."
    },
    {
      title: "Blood Components and Uses",
      content: "Donated blood is separated into red cells, plasma, and platelets. Red cells help trauma patients, plasma aids burn victims, and platelets assist cancer patients. One donation can help save up to three lives."
    },
    {
      title: "Emergency Response",
      content: "Blood banks maintain emergency reserves for disasters and sudden demand spikes. Type O- blood is especially critical as it can be given to any patient in emergency situations when time doesn't allow for blood typing."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Blood Donation Knowledge</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn important information about blood donation, compatibility, and the life-saving impact of your contribution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {knowledgeItems.map((item, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-blood">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeSection;
