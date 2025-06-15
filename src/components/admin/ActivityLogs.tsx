
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActivityLog } from "@/types/custom";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporarily disable activity logs until database schema is updated
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        user_id: 'user1',
        action: 'blood_request_created',
        entity_type: 'blood_request',
        entity_id: 'req1',
        details: { reason: 'Emergency surgery' },
        ip_address: '192.168.1.1',
        user_agent: 'Chrome',
        created_at: new Date().toISOString()
      }
    ];
    
    setLogs(mockLogs);
    setLoading(false);
  }, []);

  const getActionBadge = (action: string) => {
    const actionColors: Record<string, string> = {
      'blood_request_created': 'bg-blue-100 text-blue-800',
      'blood_request_approved': 'bg-green-100 text-green-800',
      'blood_request_rejected': 'bg-red-100 text-red-800',
      'blood_request_cancelled': 'bg-gray-100 text-gray-800',
      'donation_created': 'bg-purple-100 text-purple-800',
      'donor_registered': 'bg-cyan-100 text-cyan-800',
      'user_login': 'bg-yellow-100 text-yellow-800',
      'user_logout': 'bg-orange-100 text-orange-800',
    };

    return (
      <Badge variant="outline" className={actionColors[action] || 'bg-gray-100 text-gray-800'}>
        {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const formatDetails = (details: Record<string, any>) => {
    if (!details || Object.keys(details).length === 0) return 'N/A';
    
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <Card className="mt-2 p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <p className="text-sm text-gray-600">Track system activity and user actions (Demo mode)</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading activity logs...</div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.user_id ? (
                      <span className="text-blue-600">User #{log.user_id.slice(-8)}</span>
                    ) : (
                      <span className="text-gray-500">System</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <span className="font-medium">{log.entity_type}</span>
                      {log.entity_id && (
                        <div className="text-xs text-gray-500">
                          #{log.entity_id.slice(-8)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs max-w-xs">
                    <div className="truncate" title={formatDetails(log.details)}>
                      {formatDetails(log.details)}
                    </div>
                    {log.ip_address && (
                      <div className="text-gray-500 mt-1">
                        IP: {log.ip_address}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {logs.length === 0 && (
            <div className="text-center text-sm text-gray-400 my-8">
              No activity logs found.
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ActivityLogs;
