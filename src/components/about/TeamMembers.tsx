
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamMembersProps {
  members: TeamMember[];
}

const TeamMembers = ({ members }: TeamMembersProps) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-blood mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
