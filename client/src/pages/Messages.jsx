import { useState, useEffect, useRef } from "react";
import { GetChatUsers, getConversations, sendMessage } from "../api/auth.js";
import { socket } from "../api/socket.js";

export const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const [maintenance, setMaintenance] = useState(true);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch all chat users (followers/following)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await GetChatUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
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

  // Poll messages every 3s
  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages(selectedUser.id);
    const interval = setInterval(() => fetchMessages(selectedUser.id), 3000);
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
  if (maintenance)
    return (
      <p className="text-center absolute top-2/12 text-5xl font-bold">
        <img
          src="https://i.pinimg.com/originals/68/5e/b4/685eb4a66bfe809067fc677bb2a361ea.gif"
          alt="Funny GIF"
          className="w-2xl object-cover mb-4"
        />
        <p className="flex justify-center gap-3">
          Soon...
          <img
            src="https://i.pinimg.com/736x/94/71/12/947112393216f5aa4abfa76ade48c2f0.jpg"
            className="w-20"
          />
        </p>
      </p>
    );
  if (loadingUsers) return <p>Loading users...</p>;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-400 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`px-4 py-3 hover:bg-gray-200 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.avatar_url || "/user.svg"}
              alt={user.username}
              className="w-10 h-10 rounded-full inline-block mr-2 object-cover"
            />
            {user.username}
          </div>
        ))}
      </div>

      {/* Chat panel */}
      <div className="flex flex-col flex-1">
        {!selectedUser ? (
          <p className="p-4">Select a conversation</p>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-xs bg-gray-200 ${
                    msg.senderId === selectedUser.id
                      ? "self-start "
                      : "self-end "
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
