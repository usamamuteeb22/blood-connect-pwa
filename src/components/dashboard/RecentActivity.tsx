
import { useState } from "react";
import { BloodRequest, Donation } from "@/types/custom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, User, Heart, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

interface RecentActivityProps {
  userRequests: BloodRequest[];
  userDonations: Donation[];
  donorRequests: BloodRequest[];
}

const RecentActivity = ({ userRequests, userDonations, donorRequests }: RecentActivityProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'donations' | 'donor-requests'>('all');
  const [showAll, setShowAll] = useState(false);
  
  // Combine all activities with type information
  const allActivities = [
    ...userRequests.map(req => ({
      ...req,
      type: 'request' as const,
      date: req.created_at,
      title: 'Blood Request Created',
      description: `${req.blood_type} blood needed in ${req.city}`,
      status: req.status
    })),
    ...userDonations.map(donation => ({
      ...donation,
      type: 'donation' as const,
      date: donation.donation_date,
      title: 'Blood Donation',
      description: `Donated ${donation.blood_type} to ${donation.recipient_name}`,
      status: donation.status
    })),
    ...donorRequests.map(req => ({
      ...req,
      type: 'donor-request' as const,
      date: req.created_at,
      title: 'Donation Request Received',
      description: `${req.blood_type} blood requested by ${req.requester_name}`,
      status: req.status
    }))
  ];

  // Sort by date (most recent first)
  const sortedActivities = allActivities.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter activities based on active filter
  const filteredActivities = sortedActivities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'requests') return activity.type === 'request';
    if (activeFilter === 'donations') return activity.type === 'donation';
    if (activeFilter === 'donor-requests') return activity.type === 'donor-request';
    return true;
  });

  // Limit to show only recent items unless "Show All" is clicked
  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge variant="outline" className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'donation': return <Heart className="w-4 h-4 text-red-600" />;
      case 'donor-request': return <User className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleContactClick = (contact: string) => {
    window.open(`tel:${contact}`, '_blank');
  };

  const hasActivity = allActivities.length > 0;

  return (
    <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        {hasActivity && (
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button
              variant={activeFilter === 'requests' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('requests')}
            >
              My Requests
            </Button>
            <Button
              variant={activeFilter === 'donations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('donations')}
            >
              Donations
            </Button>
            {donorRequests.length > 0 && (
              <Button
                variant={activeFilter === 'donor-requests' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('donor-requests')}
              >
                Received
              </Button>
            )}
          </div>
        )}
      </div>

      {!hasActivity ? (
        <p className="text-gray-500 text-center py-6">
          No recent activity to display. Start by making a blood request or registering as a donor!
        </p>
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(activity.date), 'MMM dd, yyyy')}
                      </div>
                      
                      {activity.type !== 'donation' && 'city' in activity && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.city}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.status)}
                    
                    {activity.type !== 'donation' && 'contact' in activity && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactClick(activity.contact)}
                        className="h-6 w-6 p-0 hover:bg-green-50 hover:border-green-300"
                      >
                        <Phone className="h-3 w-3 text-green-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredActivities.length > 5 && !showAll && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
              >
                Show All ({filteredActivities.length} items)
              </Button>
            </div>
          )}
          
          {showAll && filteredActivities.length > 5 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAll(false)}
              >
                Show Less
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
