"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Circle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useAppStore } from "@/lib/app-store";
import { employees, getInitials } from "@/lib/mock-data";

export function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { chatMessages, addChatMessage, markChatRead, onlineUsers } =
    useAppStore();

  const myId = user?.employee.id || "";

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeChat]);

  useEffect(() => {
    if (activeChat) {
      markChatRead(activeChat, myId);
    }
  }, [activeChat, markChatRead, myId]);

  if (!user) return null;

  const otherEmployees = employees.filter((e) => e.id !== myId);

  const chatPartners = otherEmployees.map((emp) => {
    const msgs = chatMessages.filter(
      (m) =>
        (m.from === emp.id && m.to === myId) ||
        (m.from === myId && m.to === emp.id)
    );
    const lastMsg = msgs[msgs.length - 1];
    const unread = msgs.filter(
      (m) => m.from === emp.id && m.to === myId && !m.read
    ).length;
    return { employee: emp, lastMsg, unread, isOnline: onlineUsers.has(emp.id) };
  });

  chatPartners.sort((a, b) => {
    if (a.lastMsg && b.lastMsg)
      return (
        new Date(b.lastMsg.time).getTime() -
        new Date(a.lastMsg.time).getTime()
      );
    if (a.lastMsg) return -1;
    if (b.lastMsg) return 1;
    return a.employee.name.localeCompare(b.employee.name);
  });

  const activeMessages = activeChat
    ? chatMessages.filter(
        (m) =>
          (m.from === activeChat && m.to === myId) ||
          (m.from === myId && m.to === activeChat)
      )
    : [];

  const activeEmployee = activeChat
    ? employees.find((e) => e.id === activeChat)
    : null;

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    addChatMessage({
      from: myId,
      fromName: user.employee.name,
      to: activeChat,
      text: message.trim(),
    });
    setMessage("");
  };

  const totalUnread = chatPartners.reduce((sum, p) => sum + p.unread, 0);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-teal-600 transition-colors flex items-center justify-center z-50"
        >
          <MessageCircle className="w-5 h-5" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center px-1">
              {totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 w-80 h-[460px] bg-card border border-border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            {activeChat && activeEmployee ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChat(null)}
                  className="text-xs text-muted-foreground hover:text-foreground mr-1"
                >
                  &larr;
                </button>
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                    {getInitials(activeEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {activeEmployee.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Circle
                      className={`w-1.5 h-1.5 fill-current ${
                        onlineUsers.has(activeChat)
                          ? "text-status-present"
                          : "text-muted-foreground"
                      }`}
                    />
                    {onlineUsers.has(activeChat) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">Messages</p>
                <p className="text-[10px] text-muted-foreground">
                  {onlineUsers.size} online
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setOpen(false);
                setActiveChat(null);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact list or messages */}
          {!activeChat ? (
            <div className="flex-1 overflow-y-auto">
              {chatPartners.map((partner) => (
                <button
                  key={partner.employee.id}
                  onClick={() => setActiveChat(partner.employee.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                        {getInitials(partner.employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-card ${
                        partner.isOnline
                          ? "bg-status-present"
                          : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {partner.employee.name}
                      </p>
                      {partner.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center shrink-0">
                          {partner.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {partner.lastMsg
                        ? partner.lastMsg.text
                        : partner.employee.department}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {activeMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-8">
                    No messages yet. Start the conversation!
                  </p>
                )}
                {activeMessages.map((msg) => {
                  const isMe = msg.from === myId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isMe
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEnd} />
              </div>
              <div className="px-3 py-2 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="text-sm h-9"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="w-9 h-9 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-teal-600 disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
