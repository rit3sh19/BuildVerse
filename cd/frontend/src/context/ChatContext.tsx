import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { getUserChats } from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  loading: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chat history when the provider mounts
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getUserChats();
        setMessages(data.chats);
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, addMessage, clearMessages, loading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}; 