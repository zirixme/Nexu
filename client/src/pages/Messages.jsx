import { useState, useEffect } from "react";
import { GetChatUsers, getConversations } from "../api/auth.js";

export const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await GetChatUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await getConversations(selectedUser.id);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex w-full h-screen">
      {/* Left panel */}
      <div className="border-r border-gray-400 overflow-y-auto w-80">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-2 hover:bg-gray-200 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover inline-block mr-2"
            />
            {user.username}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="p-4 flex flex-col justify-between w-full">
        {!selectedUser ? (
          <p>Select a conversation</p>
        ) : (
          <>
            <div className="overflow-y-auto flex flex-col w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded ${
                    msg.senderId === selectedUser.id
                      ? "bg-gray-200 text-left w-fit"
                      : "bg-gray-200 text-right self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="mt-2">{/* input box for sending messages */}</div>
          </>
        )}
      </div>
    </div>
  );
};
