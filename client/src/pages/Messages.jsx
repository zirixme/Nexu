import { useState, useEffect, useRef } from "react";
import { getConversations, sendMessage, getMessages } from "../api/auth.js";
import { socket } from "../api/socket.js";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../components/AuthContext.jsx";
import { getRelativeTime } from "../utils/utils.js";
import { useLocation } from "react-router";
export const Messages = () => {
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const { state } = useLocation();
  const selectedUserFromState = state?.selectedUser;
  const selectedUserId = selectedUserFromState?.id || state?.selectedUserId;

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    const fromList = conversations.find((u) => u.id === selectedUserId);
    if (fromList) {
      setSelectedUser(fromList);
      return;
    }

    if (selectedUserFromState) {
      setSelectedUser(selectedUserFromState);

      // show it in the sidebar even with no history yet
      setConversations((prev) =>
        prev.some((u) => u.id === selectedUserFromState.id)
          ? prev
          : [
              {
                ...selectedUserFromState,
                lastMessage: "",
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]
      );
    }
  }, [selectedUserId, selectedUserFromState, conversations]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return;
    const fetchUserMessages = async () => {
      try {
        const res = await getMessages(selectedUser.id);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserMessages();
  }, [selectedUser]);

  // Socket.IO registration & listener
  useEffect(() => {
    if (!user) return;

    socket.emit("register", user.id);

    socket.on("receive_message", (msg) => {
      if (
        selectedUser &&
        (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }

      setConversations((prev) => {
        const index = prev.findIndex(
          (u) => u.id === msg.senderId || u.id === msg.receiverId
        );
        if (index !== -1) {
          const updated = [...prev];
          updated[index].lastMessage = msg.text;
          return updated;
        }
        return prev;
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, user]);

  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit("send_message", {
      senderId: user.id,
      receiverId: selectedUser.id,
      text,
    });

    // Add locally for immediate UI feedback
    setText("");
  };

  if (loadingUsers) return <p>Loading users...</p>;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden" : ""
        }md:inline md:w-80 xl:pl-4 border-r border-gray-400 overflow-y-auto`}
      >
        {conversations.map((user) => (
          <div
            key={user.id}
            className={`px-4 py-3 hover:bg-gray-200 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex gap-2">
              <img
                src={user.avatar_url || "/user.svg"}
                alt={user.username}
                className="w-10 h-10 rounded-full inline-block mr-2 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold">{user.username}</span>
                {user.lastMessage && (
                  <span className="text-sm text-gray-400">
                    {user.lastMessage}
                    <span className="ml-4 text-sm">
                      {"• " + getRelativeTime(user.createdAt)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat panel */}
      <div className="flex flex-col flex-1 ">
        {!selectedUser ? (
          <p className={`p-4 `}>Select a conversation</p>
        ) : (
          <>
            {/* Header */}
            <div
              className={`${
                selectedUser ? "flex" : "hidden"
              } flex gap-6 px-4 py-3 border-b border-gray-300 items-center`}
            >
              <button
                className="cursor-pointer"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowLeft />
              </button>
              <div className="flex gap-2 items-center">
                <img
                  src={selectedUser.avatar_url || "/user.svg"}
                  alt="avatar"
                  className="h-10 w-10 rounded-full"
                />
                <h2 className="font-bold">{selectedUser.username}</h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-xs bg-gray-200 ${
                    msg.senderId === user.id
                      ? "self-end bg-blue-200"
                      : "self-start bg-gray-200"
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
