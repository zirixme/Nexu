import { useState, useEffect, useRef } from "react";
import { getConversations, sendMessage, getMessages } from "../api/auth.js";
import { socket } from "../api/socket.js";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../components/AuthContext.jsx";
import { getRelativeTime } from "../utils/utils.js";
import { useLocation } from "react-router";
export const Messages = () => {
  const messagesEndRef = useRef(null);
  const { user, onlineUsers } = useAuth();

  const { state } = useLocation();
  const selectedUserFromState = state?.selectedUser;
  const selectedUserId = selectedUserFromState?.id || state?.selectedUserId;

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
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

    setText("");
  };

  if (loadingUsers) return <p>Loading users...</p>;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden" : "inline w-full"
        } md:inline md:w-80 xl:pl-4 border-r border-gray-400 dark:border-gray-600 overflow-y-auto`}
      >
        {conversations.map((user) => (
          <div
            key={user.id}
            className={`px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-200 dark:bg-gray-800" : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex gap-2">
              <div className="relative">
                <img
                  src={user.avatar_url || "/user.svg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full inline-block mr-2 object-cover"
                />
                <span
                  className={` w-3 h-3 rounded-full absolute right-2 top-0 ${
                    onlineUsers.includes(user.id)
                      ? "bg-green-400"
                      : "bg-gray-400"
                  } `}
                ></span>
              </div>
              <div className="flex flex-col relative">
                <span className="font-bold">{user.username}</span>
                {user.lastMessage && (
                  <span className="text-sm text-gray-400">
                    {user.lastMessage.length <= 20
                      ? user.lastMessage
                      : user.lastMessage.substring(0, 20) + "..."}
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
      <div className="flex flex-col flex-1 relative">
        {!selectedUser ? (
          <p className={`p-4 hidden `}>Select a conversation</p>
        ) : (
          <>
            {/* Header */}
            <div
              className={` flex gap-6 px-4 py-3 border-b border-gray-400 dark:border-gray-600 dark: items-center fixed w-full bg-gray-50 dark:bg-black`}
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
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 mb-17">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-3xs md:max-w-xs xl:max-w-xl bg-gray-200 dark:bg-gray-800 break-words ${
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
            <div className="p-4 z-12 border-t border-gray-400 dark:border-gray-600 flex gap-2 md:p-4 fixed bottom-0 w-full bg-gray-50 dark:bg-bg-black">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-400 dark:border-gray-600 rounded outline-0 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 bg-black dark:bg-white dark:text-black text-white rounded cursor-pointer"
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
