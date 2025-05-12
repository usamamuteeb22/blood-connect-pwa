
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ImpactStat {
  value: string;
  label: string;
  description: string;
}

const ImpactStats = () => {
  const stats: ImpactStat[] = [
    {
      value: "100K+",
      label: "Registered Donors",
      description: "Active community ready to donate"
    },
    {
      value: "50K+",
      label: "Lives Saved",
      description: "Through successful blood donations"
    },
    {
      value: "98%",
      label: "Request Success Rate",
      description: "Matching donors to recipients"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-blood mb-4">{stat.value}</div>
                <p className="text-lg">{stat.label}</p>
                <p className="text-gray-600 mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
