"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Sparkles, User2, Info, X } from "lucide-react"; // Import X for close icon
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState } from "react"; // Import useState

interface MessageProps {
  message: {
    sender: string;
    text: string;
    timestamp: string;
    url?: string;
    fileUrl?: string;
  };
  chatName: string;
  chatEmail: string;
  isStaff?: boolean;
  staffInfo?: {
    id: string;
    name: string;
    email: string;
    websiteId: string;
  };
  dashboardUserId?: string;
}

export function Message({
  message,
  chatName,
  chatEmail,
  isStaff,
  staffInfo,
  dashboardUserId,
}: MessageProps) {
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(
    null
  ); // State to store the URL of the image to display in fullscreen

  console.log("test message", message);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderMarkdown = (markdownText: string) => {
    if (!markdownText) return { __html: "" };
    const rawMarkup = marked.parse(markdownText, {
      breaks: true,
      gfm: true,
    }) as string;
    return { __html: DOMPurify.sanitize(rawMarkup) };
  };

  const isUserMessageFromWidget = message.sender === "user";
  const isOwnerMessageFromDashboard = message.sender === "owner";
  const isStaffMessageWithPrefix = message.sender.startsWith("staff-");

  const isOutgoingMessage =
    (dashboardUserId && isOwnerMessageFromDashboard) ||
    (isStaff &&
      isStaffMessageWithPrefix &&
      staffInfo?.name &&
      message.sender.split("-")[1] === staffInfo.name);

  const isIncomingMessage = !isOutgoingMessage;

  let avatarComponent = null;
  let messageBubbleClass = "";
  let messageMetaColor = "";
  let senderDisplayText = "";
  let messageIcon = null;

  if (isOutgoingMessage) {
    messageBubbleClass = isStaffMessageWithPrefix
      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
      : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md";
    messageMetaColor = isStaffMessageWithPrefix
      ? "text-blue-100"
      : "text-emerald-100";
    senderDisplayText = "You";
    avatarComponent = (
      <Avatar
        className={`w-8 h-8 md:w-9 md:h-9 flex-shrink-0 ring-2 ring-white shadow-sm ${
          isStaffMessageWithPrefix
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-emerald-500 to-emerald-600"
        }`}
      >
        <AvatarFallback
          className={`text-white text-xs font-semibold ${
            isStaffMessageWithPrefix
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : "bg-gradient-to-br from-emerald-500 to-emerald-600"
          }`}
        >
          {isStaffMessageWithPrefix
            ? staffInfo?.name
              ? getInitials(staffInfo.name)
              : "S"
            : getInitials(chatName || "U")}
        </AvatarFallback>
      </Avatar>
    );
  } else {
    messageBubbleClass = `bg-white text-slate-900 border border-slate-200`;
    messageMetaColor = `text-slate-500`;

    if (message.sender === "bot") {
      messageIcon = <Bot className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-gradient-to-br from-orange-50 to-orange-100 text-slate-900 border-2 border-orange-200 shadow-md";
      messageMetaColor = "text-orange-600 font-medium";
      senderDisplayText = "Bot Response";
    } else if (message.sender === "ai") {
      messageIcon = <Sparkles className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-gradient-to-br from-purple-50 to-purple-100 text-slate-900 border-2 border-purple-200 shadow-md";
      messageMetaColor = "text-purple-600 font-medium";
      senderDisplayText = "AI Assistant";
    } else if (isUserMessageFromWidget) {
      messageIcon = <User2 className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-gradient-to-br from-emerald-50 to-emerald-100 text-slate-900 border-2 border-emerald-200 shadow-md";
      messageMetaColor = "text-emerald-600 font-medium";
      senderDisplayText = chatName || chatEmail || "Visitor";
    } else if (isStaffMessageWithPrefix) {
      messageIcon = <User2 className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-gradient-to-br from-blue-50 to-blue-100 text-slate-900 border-2 border-blue-200 shadow-md";
      messageMetaColor = "text-blue-600 font-medium";
      senderDisplayText = message.sender.split("-")[1] || "Staff";
    } else if (isOwnerMessageFromDashboard && isStaff) {
      messageIcon = <User2 className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-gradient-to-br from-amber-50 to-amber-100 text-slate-900 border-2 border-amber-200 shadow-md";
      messageMetaColor = "text-amber-700 font-medium";
      senderDisplayText = "Owner";
    } else if (message.sender === "system") {
      messageIcon = <Info className="w-3 h-3 text-white" />;
      messageBubbleClass =
        "bg-slate-100 text-slate-700 border border-slate-200 shadow-sm text-center";
      messageMetaColor = "text-slate-500";
      senderDisplayText = "System";
    }

    avatarComponent = (
      <Avatar
        className={`w-8 h-8 md:w-9 md:h-9 flex-shrink-0 ring-2 ring-white shadow-sm ${
          message.sender === "bot"
            ? "bg-gradient-to-br from-orange-500 to-orange-600"
            : message.sender === "ai"
            ? "bg-gradient-to-br from-purple-500 to-purple-600"
            : isUserMessageFromWidget
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
            : isStaffMessageWithPrefix
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : isOwnerMessageFromDashboard && isStaff
            ? "bg-gradient-to-br from-amber-500 to-amber-600"
            : message.sender === "system"
            ? "bg-slate-500"
            : "bg-slate-400"
        }`}
      >
        <AvatarFallback
          className={`text-white text-xs font-semibold ${
            message.sender === "bot"
              ? "bg-gradient-to-br from-orange-500 to-orange-600"
              : message.sender === "ai"
              ? "bg-gradient-to-br from-purple-500 to-purple-600"
              : isUserMessageFromWidget
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
              : isStaffMessageWithPrefix
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : isOwnerMessageFromDashboard && isStaff
              ? "bg-gradient-to-br from-amber-500 to-amber-600"
              : message.sender === "system"
              ? "bg-slate-500"
              : "bg-slate-400"
          }`}
        >
          {messageIcon || <User2 className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div
      className={`flex ${isOutgoingMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-end space-x-2 md:space-x-3 ${
          message.fileUrl
            ? "max-w-full"
            : "max-w-[280px] sm:max-w-xs lg:max-w-md"
        } ${isOutgoingMessage ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {avatarComponent}

        <div className="space-y-1 max-w-[60%]">
          <div
            className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl relative shadow-sm ${messageBubbleClass}`}
          >
            {isIncomingMessage &&
              (message.sender === "bot" || message.sender === "ai") && (
                <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-current/20">
                  {message.sender === "bot" ? (
                    <Bot className="w-3 h-3 text-orange-600" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-purple-600" />
                  )}
                  <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                    {message.sender === "bot" ? "Bot Response" : "AI Assistant"}
                  </span>
                </div>
              )}
            {/* Conditional rendering for image */}
            {message.fileUrl && (
              <div
                className="mb-2 cursor-pointer"
                onClick={() => setFullscreenImageUrl(message.fileUrl!)}
              >
                <img
                  src={message.fileUrl}
                  alt="Attached file"
                  className="rounded-lg w-full h-auto" // Changed to w-full
                  style={{
                    maxHeight: "300px", // Increased max height for better viewing
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
            {/* Markdown parsing applied here */}
            <p
              className="markdown-content text-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={renderMarkdown(message.text)}
            />
          </div>
          <p
            className={`text-xs px-2 ${
              isOutgoingMessage
                ? isStaffMessageWithPrefix
                  ? "text-blue-300"
                  : "text-emerald-300"
                : messageMetaColor
            } ${isOutgoingMessage ? "text-right" : "text-left"}`}
          >
            {senderDisplayText} •{" "}
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Full-screen image modal */}
      {fullscreenImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setFullscreenImageUrl(null)} // Close on background click
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl z-60"
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing when clicking the button
              setFullscreenImageUrl(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={fullscreenImageUrl}
            alt="Full screen"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          />
        </div>
      )}
    </div>
  );
}
