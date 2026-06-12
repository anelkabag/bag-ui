"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, Send, Plus, Smile, ChevronLeft, Image as ImageIcon, Bell, Edit3, CheckCheck } from "lucide-react";

// Type definitions
interface Message {
    id: string;
    content: string;
    sender: "me" | "other";
    timestamp: string;
    type: "text" | "images";
}

interface Contact {
    id: string;
    name: string;
    avatar: string;
    messages: Message[];
}

// Contact data
interface ContactData extends Contact {
    tab: "friends" | "groups";
    online: boolean;
    time: string;
    lastMessage: string;
    unread?: number;
    verified?: boolean;
    lastSeen?: string;
}

const contacts: ContactData[] = [
    {
        id: "1",
        name: "Alice Mensah",
        avatar: "AM",
        messages: [
            { id: "1", content: "Salut! Comment vas-tu?", sender: "other", timestamp: "14:30", type: "text" },
            { id: "2", content: "Très bien, et toi?", sender: "me", timestamp: "14:31", type: "text" },
            { id: "3", content: "Cool! On se voit ce weekend?", sender: "other", timestamp: "14:32", type: "text" },
        ],
        tab: "friends",
        online: true,
        time: "14:32",
        lastMessage: "On se voit ce weekend?",
        unread: 3,
        verified: true,
    },
    {
        id: "2",
        name: "Alex Chen",
        avatar: "AC",
        messages: [
            { id: "1", content: "Projet finalisé? 📁", sender: "other", timestamp: "13:15", type: "text" },
            { id: "2", content: "Oui, c'est bon!", sender: "me", timestamp: "13:16", type: "text" },
        ],
        tab: "friends",
        online: true,
        time: "13:16",
        lastMessage: "Oui, c'est bon!",
        verified: true,
    },
    {
        id: "3",
        name: "Ivan Goldberg",
        avatar: "IG",
        messages: [
            { id: "1", content: "À bientôt!", sender: "other", timestamp: "12:45", type: "text" },
        ],
        tab: "friends",
        online: false,
        time: "12:45",
        lastMessage: "À bientôt!",
        lastSeen: "il y a 2h",
    },
    {
        id: "4",
        name: "Christina Brown",
        avatar: "CB",
        messages: [],
        tab: "friends",
        online: false,
        time: "Hier",
        lastMessage: "Merci pour tout!",
    },
    {
        id: "5",
        name: "Frontend Engineers",
        avatar: "FE",
        messages: [],
        tab: "groups",
        online: true,
        time: "11:20",
        lastMessage: "Vous: Cool! 👍",
        unread: 7,
    },
    {
        id: "6",
        name: "React Mentors",
        avatar: "RM",
        messages: [],
        tab: "groups",
        online: true,
        time: "Hier",
        lastMessage: "À bientôt pour le meeting",
    },
    {
        id: "7",
        name: "Team Rework",
        avatar: "TR",
        messages: [],
        tab: "groups",
        online: false,
        time: "Lundi",
        lastMessage: "Bonne chance!",
    },
    {
        id: "8",
        name: "Open Ground",
        avatar: "OG",
        messages: [],
        tab: "groups",
        online: true,
        time: "Dimanche",
        lastMessage: "À ce soir!",
    },
    {
        id: "9",
        name: "Vera Simpson",
        avatar: "VS",
        messages: [],
        tab: "friends",
        online: true,
        time: "Samedi",
        lastMessage: "Super idée!",
    },
];

const avatarColors: Record<string, string> = {
    AM: "bg-gradient-to-br from-indigo-500 to-purple-600",
    AC: "bg-gradient-to-br from-pink-400 to-rose-500",
    IG: "bg-gradient-to-br from-orange-400 to-red-500",
    CB: "bg-gradient-to-br from-red-700 to-red-900",
    FE: "bg-gradient-to-br from-yellow-400 to-amber-500",
    RM: "bg-gradient-to-br from-slate-500 to-slate-700",
    TR: "bg-gradient-to-br from-teal-400 to-emerald-500",
    OG: "bg-gradient-to-br from-green-500 to-emerald-700",
    VS: "bg-gradient-to-br from-sky-400 to-blue-600",
};

// Artwork-style placeholder images using SVG data URIs
const artworkImages = [
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
    <defs>
      <linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#b8d4e8"/>
        <stop offset="100%" style="stop-color:#d4e9c8"/>
      </linearGradient>
    </defs>
    <rect width="200" height="180" fill="url(#sky1)"/>
    <ellipse cx="60" cy="60" rx="35" ry="30" fill="#5a8a3c" opacity="0.8"/>
    <ellipse cx="140" cy="50" rx="28" ry="25" fill="#4a7a2c" opacity="0.9"/>
    <ellipse cx="100" cy="70" rx="20" ry="18" fill="#6a9a4c" opacity="0.7"/>
    <rect x="55" y="85" width="8" height="40" fill="#6b4226"/>
    <rect x="133" y="72" width="6" height="35" fill="#6b4226"/>
    <rect x="0" y="130" width="200" height="50" fill="#8ab866" opacity="0.6"/>
    <rect x="0" y="145" width="200" height="35" fill="#7aa856" opacity="0.5"/>
    <ellipse cx="30" cy="155" rx="25" ry="8" fill="#5a8840" opacity="0.6"/>
    <ellipse cx="170" cy="160" rx="20" ry="6" fill="#4a7830" opacity="0.7"/>
    <path d="M0,140 Q50,125 100,135 Q150,145 200,130" fill="none" stroke="#6a9850" stroke-width="2" opacity="0.4"/>
  </svg>`)}`,

    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
    <defs>
      <linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#c8dff0"/>
        <stop offset="100%" style="stop-color:#e8d4a8"/>
      </linearGradient>
    </defs>
    <rect width="200" height="180" fill="url(#sky2)"/>
    <path d="M60,100 Q100,30 140,100" fill="#c8a870" opacity="0.3"/>
    <ellipse cx="100" cy="40" rx="40" ry="30" fill="#4a7a3c" opacity="0.7"/>
    <ellipse cx="70" cy="55" rx="25" ry="20" fill="#5a8a4c" opacity="0.8"/>
    <ellipse cx="130" cy="60" rx="22" ry="18" fill="#3a6a2c" opacity="0.9"/>
    <rect x="96" y="68" width="7" height="50" fill="#8b6343"/>
    <rect x="0" y="120" width="200" height="60" fill="#9cbd78" opacity="0.5"/>
    <rect x="0" y="135" width="200" height="45" fill="#8aad68"/>
    <circle cx="50" cy="125" r="15" fill="#6a9d48" opacity="0.6"/>
    <circle cx="155" cy="130" r="12" fill="#5a8d38" opacity="0.7"/>
    <path d="M20,145 Q80,130 160,140 Q180,143 200,138" fill="none" stroke="#7a9d58" stroke-width="3" opacity="0.5"/>
    <rect x="85" y="148" width="30" height="12" rx="3" fill="#c8b890" opacity="0.5"/>
    <circle cx="170" cy="25" rx="18" ry="18" fill="#f8e898" opacity="0.8"/>
  </svg>`)}`,

    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
    <defs>
      <linearGradient id="path1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#e8c878"/>
        <stop offset="100%" style="stop-color:#c8a850"/>
      </linearGradient>
    </defs>
    <rect width="200" height="180" fill="#d4e8b8"/>
    <rect x="0" y="100" width="200" height="80" fill="#c8b870"/>
    <path d="M70,180 Q100,90 130,180" fill="#d4c880" opacity="0.8"/>
    <ellipse cx="40" cy="80" rx="30" ry="25" fill="#4a8a3c" opacity="0.8"/>
    <ellipse cx="160" cy="75" rx="25" ry="22" fill="#5a9a4c" opacity="0.7"/>
    <rect x="35" y="103" width="8" height="45" fill="#7b5230"/>
    <rect x="155" y="95" width="6" height="38" fill="#7b5230"/>
    <ellipse cx="80" cy="140" rx="30" ry="15" fill="#d4a830" opacity="0.6"/>
    <ellipse cx="120" cy="148" rx="22" ry="12" fill="#c49820" opacity="0.7"/>
    <circle cx="85" cy="138" r="6" fill="#f8d840"/>
    <circle cx="115" cy="145" r="5" fill="#f8c830"/>
    <circle cx="100" cy="135" r="4" fill="#e8d850"/>
    <path d="M50,115 Q100,100 150,112" fill="none" stroke="#b89040" stroke-width="2" opacity="0.6"/>
  </svg>`)}`,
];

type Tab = "all" | "friends" | "groups";

function ArtworkGallery() {
    return (
        <div className="relative w-56 h-52 my-1">
            {artworkImages.map((src, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, rotate: [-8, 3, -4][i] }}
                    animate={{ opacity: 1, scale: 1, rotate: [-8, 3, -4][i] }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    style={{
                        position: "absolute",
                        top: `${[0, 20, 45][i]}px`,
                        left: `${[10, 30, 5][i]}px`,
                        zIndex: i + 1,
                    }}
                    whileHover={{ scale: 1.05, zIndex: 10, transition: { duration: 0.2 } }}
                    className="w-36 h-28 rounded-xl overflow-hidden shadow-lg border-2 border-white cursor-pointer"
                >
                    <img src={src} alt={`Artwork ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
}

function Sidebar({ selectedContact, onSelectContact, isMobileOpen, onMobileClose }: {
    selectedContact: ContactData | null;
    onSelectContact: (contact: ContactData) => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const [search, setSearch] = useState("");

    const tabs: { label: string; key: Tab; count: number }[] = [
        { label: "All", key: "all", count: contacts.length },
        { label: "Friends", key: "friends", count: contacts.filter(c => c.tab === "friends").length },
        { label: "Groups", key: "groups", count: contacts.filter(c => c.tab === "groups").length },
    ];

    const filtered = contacts.filter(c => {
        const matchTab = activeTab === "all" || c.tab === activeTab;
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-20 md:hidden"
                        onClick={onMobileClose}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ x: isMobileOpen ? 0 : undefined }}
                className={`
          fixed md:relative z-30 md:z-auto
          w-[320px] md:w-[320px] lg:w-[340px]
          h-full flex flex-col
          bg-white border-r border-gray-100
          transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">Me</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                            <Bell size={18} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search chats"
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 pb-3 flex items-center gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? "text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <motion.span
                                    layoutId="tab-bg"
                                    className="absolute inset-0 bg-gray-100 rounded-full"
                                />
                            )}
                            <span className="relative">{tab.label}</span>
                            <span className={`relative text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                activeTab === tab.key ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                {tab.count}
              </span>
                        </button>
                    ))}
                </div>

                {/* Contact list */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((contact, i) => (
                            <motion.button
                                key={contact.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.18, delay: i * 0.03 }}
                                onClick={() => { onSelectContact(contact); onMobileClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                                    selectedContact?.id === contact.id
                                        ? "bg-gray-100"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full ${avatarColors[contact.avatar] || "bg-gray-400"} flex items-center justify-center text-white font-semibold text-sm`}>
                                        {contact.avatar}
                                    </div>
                                    {contact.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <span className="font-semibold text-gray-900 text-sm truncate">{contact.name}</span>
                                            {contact.verified && (
                                                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <CheckCheck size={9} className="text-white" />
                        </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{contact.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                                        {contact.unread && (
                                            <span className="ml-2 min-w-5 h-5 px-1 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {contact.unread}
                      </span>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* New chat button */}
                <div className="p-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-medium text-sm transition-colors"
                    >
                        <Edit3 size={16} />
                        Start a new chat
                    </motion.button>
                </div>
            </motion.aside>
        </>
    );
}

function ChatWindow({ contact, onBack }: { contact: ContactData | null; onBack: () => void }) {
    const [messages, setMessages] = useState<Message[]>(contact?.messages || []);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(contact?.messages || []);
    }, [contact]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            content: input,
            sender: "me",
            timestamp: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
            type: "text",
        };
        setMessages(prev => [...prev, newMsg]);
        setInput("");

        // Simulate reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = ["Super! 😊", "Je vois, intéressant!", "Merci pour l'info!", "D'accord, on en parle bientôt.", "👍"];
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: replies[Math.floor(Math.random() * replies.length)],
                sender: "other",
                timestamp: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
                type: "text",
            }]);
        }, 1500);
    };

    if (!contact) {
        return (
            <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Sélectionne une conversation</p>
                    <p className="text-gray-400 text-sm mt-1">Choisis un contact pour commencer</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0"
            >
                <button
                    onClick={onBack}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${avatarColors[contact.avatar] || "bg-gray-400"} flex items-center justify-center text-white font-semibold text-xs`}>
                        {contact.avatar}
                    </div>
                    {contact.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{contact.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                        {contact.online ? "En ligne" : contact.lastSeen ? `Vu ${contact.lastSeen}` : "Hors ligne"}
                    </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <Search size={17} />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <MoreVertical size={17} />
                    </button>
                </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => {
                        const isSent = msg.sender === "me";
                        const isFirst = i === 0 || messages[i - 1].sender !== msg.sender;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`flex flex-col ${isSent ? "items-end" : "items-start"} ${isFirst ? "mt-4" : "mt-1"}`}
                            >
                                {msg.type === "images" ? (
                                    <ArtworkGallery />
                                ) : (
                                    <div
                                        className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                            isSent
                                                ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-br-sm"
                                                : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                                        }`}
                                    >
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${isSent ? "text-blue-100" : "text-gray-400"} text-right`}>
                                            {msg.timestamp}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-end gap-2 mt-2"
                        >
                            <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.span
                                        key={i}
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                        className="w-2 h-2 rounded-full bg-gray-400 block"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 flex-shrink-0"
                    >
                        <Plus size={18} />
                    </motion.button>

                    <div className="flex-1 relative">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message"
                            className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition-all pr-10"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Smile size={17} />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendMessage}
                        className={`w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
                            input.trim()
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-400"
                        }`}
                    >
                        <Send size={16} className={input.trim() ? "" : "opacity-50"} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default function ChatApp() {
    const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
            />
            {selectedContact ? (
                <ChatWindow contact={selectedContact} onBack={() => setSelectedContact(null)} />
            ) : (
                <ChatWindow contact={null} onBack={() => {}} />
            )}
        </div>
    );
}
