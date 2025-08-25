import { useState, useEffect, useRef } from "react";
import { GetChatUsers, getConversations, sendMessage } from "../api/auth.js";

export const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch users once
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

  // Fetch messages for selected user
  const fetchMessages = async (userId) => {
    try {
      const res = await getConversations(userId);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages initially and set up polling
  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser.id);

    const interval = setInterval(() => {
      fetchMessages(selectedUser.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      const res = await sendMessage(selectedUser.id, text);
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex w-full h-screen">
      {/* Left panel */}
      <div className="w-80 border-r border-gray-400 overflow-y-auto">
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
      <div className="flex flex-col flex-1">
        {!selectedUser ? (
          <p className="p-4">Select a conversation</p>
        ) : (
          <>
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-xs bg-gray-200 ${
                    msg.senderId === selectedUser.id
                      ? " self-start"
                      : "self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 bg-black text-white rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
