
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type LogType = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  admin: string;
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Use any for the type (activity_logs is not in Database type)
        const { data, error } = await supabase
          .from<any>('activity_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (error) throw error;
        setLogs(
          (data || [])
            .filter((row: any) => row.id && row.action && row.details && row.timestamp && row.admin)
            .map((row: any) => ({
              id: row.id,
              action: row.action,
              details: row.details,
              timestamp: row.timestamp,
              admin: row.admin,
            }))
        );
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <Card className="mt-2 p-4">
      <div className="mb-2 font-semibold">Activity Logs</div>
      {loading ? (
        <div>Loading logs...</div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.admin}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {logs.length === 0 && <div className="text-center text-sm text-gray-400 my-2">No logs yet.</div>}
        </div>
      )}
    </Card>
  );
};

export default ActivityLogs;
