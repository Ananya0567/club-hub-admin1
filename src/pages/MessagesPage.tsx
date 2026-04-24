import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

interface ChatUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  department?: string;
}

interface ChatMessage {
  _id?: string;
  text: string;
  sender: any;
  receiver?: any;
  createdAt?: string;
}

const MessagesPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("FETCH USERS ERROR:", data);
        setUsers([]);
        return;
      }

      setUsers(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedUser(data[0]);
      }
    } catch (err) {
      console.error("FETCH USERS FAILED:", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("FETCH MESSAGES ERROR:", data);
        setMessages([]);
        return;
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH MESSAGES FAILED:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (loggedInUser?._id) {
      socket.emit("register", {
        userId: loggedInUser._id,
        role: loggedInUser.role,
      });
    }

    socket.on("new_message", (message) => {
      const senderId =
        typeof message.sender === "string"
          ? message.sender
          : message.sender?._id;

      const receiverId =
        typeof message.receiver === "string"
          ? message.receiver
          : message.receiver?._id;

      const selectedId = selectedUser?._id;

      if (
        selectedId &&
        (senderId === selectedId || receiverId === selectedId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          text: input.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Message failed");
        return;
      }

      setMessages((prev) => [...prev, data]);
      setInput("");
    } catch (err) {
      console.error("SEND MESSAGE FAILED:", err);
      alert("Message failed. Check backend.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-50px)] bg-background text-foreground">
      <div className="w-1/4 min-w-[260px] border-r border-border p-4">
        <h2 className="font-bold mb-3">Messages</h2>

        {loadingUsers ? (
          <p className="text-sm text-muted-foreground">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 cursor-pointer rounded-lg mb-2 border ${
                selectedUser?._id === user._id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:bg-muted"
              }`}
            >
              <p className="font-medium">{user.name}</p>
              <p
                className={`text-xs capitalize ${
                  selectedUser?._id === user._id
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {user.role}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4 font-semibold">
          {selectedUser ? selectedUser.name : "Select a user"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {!selectedUser ? (
            <p className="text-sm text-muted-foreground">
              Select a user to start chatting.
            </p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((msg, i) => {
              const senderId =
                typeof msg.sender === "string"
                  ? msg.sender
                  : msg.sender?._id;

              const isMe = senderId === loggedInUser?._id;

              return (
                <div
                  key={msg._id || i}
                  className={`mb-2 flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-border flex gap-2">
          <input
            className="flex-1 border border-border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedUser ? "Type a message" : "Select a user first"
            }
            disabled={!selectedUser}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            className="bg-primary text-primary-foreground px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={!selectedUser || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;