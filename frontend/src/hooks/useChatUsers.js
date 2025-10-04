import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

export const useChatUsers = (client) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client?.user) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { users: allUsers } = await client.queryUsers(
          { id: { $ne: client.user.id } },
          { name: 1 },
          { limit: 100 }
        );

        setUsers(allUsers.filter(u => !u.id.startsWith("recording-")));
      } catch (err) {
        setError("Failed to load users");
        Sentry.captureException(err, {
          tags: { hook: "useChatUsers" },
          extra: { context: "fetch_users" },
        });
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [client]);

  return {users, loading, error};
}