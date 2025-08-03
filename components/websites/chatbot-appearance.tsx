"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette, Sparkles, Save, Loader2, RefreshCw, Sun, Moon, Zap, Image,
  ImageIcon, LayoutGrid, Upload, MessageSquare, Link, BookOpen, Send,
  HelpCircle, Home, XCircle, Plus, Trash2, ArrowRight, CornerDownRight,
  ClipboardList, ListChecks, FileText, Users, User, Heading as HeadingIcon,
  Paintbrush,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- GLOBAL ICON DEFINITIONS & HELPERS ---
// This remains a map for easy lookup by icon name when defining.
const ICON_SVG_LOOKUP: { [key: string]: string } = {
  'MessageSquare': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>',
  'Link': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>',
  'BookOpen': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.03 0-1.979.317-2.816.894M12 6.042V6a7.5 7.5 0 0 1 7.5 7.5v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 0-2.25 2.25m-1.5-1.5v2.25m-1.5-1.5v3.75V16.5m-1.5-1.5v3.75m-1.5-1.5h8.25m-3-9.75a3 3 0 0 1 3 3V16.5a3 3 0 0 1-3 3H7.5m.75-9.75h9.75" /></svg>',
  'Send': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>',
  'HelpCircle': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>',
  'Home': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
  'ClipboardList': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75 9.309-9.309a1.5 1.5 0 0 0 0-2.122 1.5 1.5 0 0 0-2.122 0L8.25 12.003m9.309 9.309a1.5 1.5 0 0 0 0-2.122 1.5 1.5 0 0 0-2.122 0M10.25 12.003L4.97 6.723M19.5 21l-9.309-9.309m0 0a3.375 3.375 0 1 1-4.773-4.773 3.375 3.375 0 0 1 4.773 4.773Z" /></svg>',
  'FileText': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75v-1.5A1.125 1.125 0 0 1 9.375 12h1.5a3.375 3.375 0 0 0 3.375-3.375V7.5m0 4.5a3.375 3.375 0 0 1-3.375 3.375H9.375a1.125 1.125 0 0 0-1.125 1.125v1.5a3.375 3.375 0 0 0 3.375 3.375h1.5a1.125 1.125 0 0 0 1.125-1.125V19.5M19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75V19.5a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 19.5V6.75A2.25 2.25 0 0 0 19.5 4.5Z" /></svg>',
};

// This is the array of objects { name: string, svg: string } used to populate the Select
const ICON_OPTIONS_ARRAY = Object.entries(ICON_SVG_LOOKUP).map(([name, svg]) => ({ name, svg }));

// Helper function to find the name (key) of an SVG string for display in UI
const getIconNameBySvg = (svgString: string | undefined): string | undefined => {
  if (!svgString) return undefined;
  for (const [key, svg] of Object.entries(ICON_SVG_LOOKUP)) {
    if (svg === svgString) {
      return key;
    }
  }
  return undefined; // Return undefined if no matching key is found
};
// --- END GLOBAL ICON DEFINITIONS & HELPERS ---


// --- Interface Definitions (as in your last provided code) ---
interface QuickActionButton {
  text: string;
  icon?: string; // This will now hold the SVG string directly
  deepLinkType: 'external' | 'internal';
  externalUrl?: string;
  internalTab?: 'home' | 'messages' | 'help';
  internalView?: 'conversations' | 'chat' | 'articles' | 'articleContent' | 'null';
  internalItemId?: string;
}

interface SelectedHelpArticle {
    id: string;
    title: string;
}

interface StaffMember {
  _id: string;
  name: string;
  email: string;
}

interface HeadingCustomization {
  text: string;
  color: string;
  shadow: boolean;
  shadowColor?: string;
  fontSize: string;
}

type BackgroundType = 'gradient' | 'image' | 'solid';

interface WebsitePreferences {
  colors: {
    gradient1: string;
    gradient2: string;
  };
  header: string;
  heading?: HeadingCustomization;
  allowAIResponses: boolean;
  allowedPaths?: string[];
  disallowedPaths?: string[];
  language?: string;
  dynamiclyAdaptToLanguage?: boolean;
  dailyTokenLimit?: number | null;
  theme?: "light" | "dark";
  branding?: boolean;
  logoUrl?: string;
  bgImageUrl?: string;
  bgColor?: string; // For solid background color
  backgroundType?: BackgroundType; // For background type selection
  tabsMode?: boolean;
  quickActions?: QuickActionButton[];
  selectedHomeTabHelpArticles?: SelectedHelpArticle[];
  showQuickActions?: boolean;
  showHomeTabHelpSection?: boolean;
  showStaffInitials?: boolean;
  selectedStaffInitials?: string[];
}

interface FAQ {
  _id: string;
  title: string;
  description: string;
  answer: string;
}

interface Website {
  _id: string;
  name: string;
  link: string;
  description: string;
  chatbotCode: string;
  chats: string[];
  plan: {
    _id: string;
    name: string;
    description: string;
    priceMonthly: number;
    maxStaffMembers: number;
    allowAI: boolean;
    creditBoostMonthly: number;
  };
  creditCount: number;
  staffMembers: string[];
  preferences: WebsitePreferences;
  predefinedAnswers: string;
  createdAt: string;
  updatedAt: string;
  stripeSubscriptionId?: string;
  faqs: FAQ[];
}

interface ChatbotAppearanceProps {
  website: Website;
  onUpdate: (website: Website) => void;
  userId: string;
}
// --- End of Interface Definitions ---


export function ChatbotAppearance({ website, onUpdate, userId }: ChatbotAppearanceProps) {
  const [header, setHeader] = useState(website?.preferences?.header || "Chat Support");
  const [headingText, setHeadingText] = useState(website?.preferences?.heading?.text || "Hi there 👋 <br/> How can we help you today?");
  const [headingColor, setHeadingColor] = useState(website?.preferences?.heading?.color || "#1f2937");
  const [headingShadow, setHeadingShadow] = useState(website?.preferences?.heading?.shadow ?? false);
  const [headingShadowColor, setHeadingShadowColor] = useState(website?.preferences?.heading?.shadowColor || "#000000");
  const [headingFontSize, setHeadingFontSize] = useState(website?.preferences?.heading?.fontSize || "24px");

  const [gradient1, setGradient1] = useState(website?.preferences?.colors?.gradient1 || "#10b981");
  const [gradient2, setGradient2] = useState(website?.preferences?.colors?.gradient2 || "#059669");
  const [theme, setTheme] = useState<"light" | "dark">(website?.preferences?.theme || "light");
  const [branding, setBranding] = useState(website?.preferences?.branding ?? true);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(website?.preferences?.logoUrl || "./logo.png");
  const [currentBgImageUrl, setCurrentBgImageUrl] = useState(website?.preferences?.bgImageUrl || "bg-image.png");
  const [tabsMode, setTabsMode] = useState(website?.preferences?.tabsMode ?? true);

  const [quickActions, setQuickActions] = useState<QuickActionButton[]>(
    website?.preferences?.quickActions?.map(action => ({
      ...action,
      icon: action.icon || undefined // Icon is already SVG string from preferences
    })) || []
  );
  const [showQuickActions, setShowQuickActions] = useState(website?.preferences?.showQuickActions ?? true);
  const [showHomeTabHelpSection, setShowHomeTabHelpSection] = useState(website?.preferences?.showHomeTabHelpSection ?? true);

  const [fetchedArticles, setFetchedArticles] = useState<FAQ[]>([]);
  const [selectedHomeTabHelpArticles, setSelectedHomeTabHelpArticles] = useState<SelectedHelpArticle[]>(
    website?.preferences?.selectedHomeTabHelpArticles || []
  );
  const [articleToAdd, setArticleToAdd] = useState<string>('');

  const [showStaffInitials, setShowStaffInitials] = useState(website?.preferences?.showStaffInitials ?? true);
  const [fetchedStaffMembers, setFetchedStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaffInitials, setSelectedStaffInitials] = useState<string[]>(
    website?.preferences?.selectedStaffInitials || []
  );
  const [staffMemberToAdd, setStaffMemberToAdd] = useState<string>('');

  const [backgroundType, setBackgroundType] = useState<BackgroundType>(website?.preferences?.backgroundType || 'gradient');
  const [singleBackgroundColor, setSingleBackgroundColor] = useState(website?.preferences?.bgColor || '#FFFFFF');

  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [bgImageFileName, setBgImageFileName] = useState<string | null>(null);

  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  // New: States for accordion open/close
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const [isHelpSectionOpen, setIsHelpSectionOpen] = useState(true);
  const [isStaffInitialsOpen, setIsStaffInitialsOpen] = useState(true);


  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  const isProOrEnterprise = ["Pro", "Enterprise"].includes(website.plan.name);

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    const initials = parts.map(part => part.charAt(0)).filter(char => char).join('').toUpperCase();
    return initials;
  };

  const buildDeepLink = (action: QuickActionButton): string => {
    const DEEPLINK_SEPARATOR = "->*cbhdeeplink^&^cbhdeeplink*->";
    if (action.deepLinkType === 'external' && action.externalUrl) {
      return `${action.externalUrl}${DEEPLINK_SEPARATOR}new`;
    } else if (action.deepLinkType === 'internal' && action.internalTab) {
      let deepLink = `${action.internalTab}${DEEPLINK_SEPARATOR}`;
      
      if (action.internalTab === 'messages') {
        const view = action.internalView === 'chat' ? 'chat' : 'conversations';
        const itemId = action.internalView === 'chat' ? 'null' : (action.internalItemId || 'null');

        console.log("VIEW", action.internalView, view)
        deepLink += `${view}${DEEPLINK_SEPARATOR}${itemId}`;
      } else if (action.internalTab === 'help') {
        const view = action.internalView || 'articles';
        const itemId = action.internalView === 'articleContent' && action.internalItemId ? action.internalItemId : 'null';
        deepLink += `${view}${DEEPLINK_SEPARATOR}${itemId}`;
      } else {
        deepLink += `null${DEEPLINK_SEPARATOR}null`;
      }

      console.log(deepLink)
      return deepLink;
    }
    return `null${DEEPLINK_SEPARATOR}null${DEEPLINK_SEPARATOR}null`;
  };


  // Effect to update local state when website prop changes
  useEffect(() => {
    setHeader(website.preferences?.header || "Chat Support");
    setHeadingText(website?.preferences?.heading?.text || "Hi there 👋 <br/> How can we help you today?");
    setHeadingColor(website?.preferences?.heading?.color || "#1f2937");
    setHeadingShadow(website?.preferences?.heading?.shadow ?? false);
    setHeadingShadowColor(website?.preferences?.heading?.shadowColor || "#000000");
    setHeadingFontSize(website?.preferences?.heading?.fontSize || "24px");

    setGradient1(website.preferences?.colors?.gradient1 || "#10b981");
    setGradient2(website.preferences?.colors?.gradient2 || "#059669");
    setTheme(website.preferences?.theme || "light");
    setBranding(website.preferences?.branding ?? true);
    setCurrentLogoUrl(website?.preferences?.logoUrl || "./logo.png");
    setCurrentBgImageUrl(website?.preferences?.bgImageUrl || "bg-image.png");
    setTabsMode(website?.preferences?.tabsMode ?? true);
    setShowQuickActions(website?.preferences?.showQuickActions ?? true);
    setShowHomeTabHelpSection(website?.preferences?.showHomeTabHelpSection ?? true);
    setShowStaffInitials(website?.preferences?.showStaffInitials ?? true);

    setQuickActions(
      website?.preferences?.quickActions?.map(action => ({
        ...action,
        icon: action.icon || undefined
      })) || []
    );
    setSelectedHomeTabHelpArticles(website?.preferences?.selectedHomeTabHelpArticles || []);
    setSelectedStaffInitials(website?.preferences?.selectedStaffInitials || []);

    setBackgroundType(website?.preferences?.backgroundType || 'gradient');
    setSingleBackgroundColor(website?.preferences?.bgColor || '#FFFFFF');


    setLogoFileName(
      website?.preferences?.logoUrl && !website.preferences.logoUrl.startsWith('data:') && website.preferences.logoUrl !== "./logo.png"
        ? website.preferences.logoUrl.split('/').pop() || null
        : null
    );
    setBgImageFileName(
      website?.preferences?.bgImageUrl && !website.preferences.bgImageUrl.startsWith('data:') && website.preferences.bgImageUrl !== "bg-image.png"
        ? website.preferences.bgImageUrl.split('/').pop() || null
        : null
    );
    
    setIframeKey(prevKey => prevKey + 1);
  }, [website]);

  // Effect to fetch articles when component mounts or chatbotCode changes
  useEffect(() => {
    const fetchArticles = async () => {
      if (!website.chatbotCode) return;
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/faqs/${website.chatbotCode}`);
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        setFetchedArticles(data.faqs || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to load articles.");
      }
    };
    fetchArticles();
  }, [website.chatbotCode]);

  // Effect to fetch staff members when component mounts, websiteId or userId changes
  useEffect(() => {
    const fetchStaff = async () => {
      if (!website._id || !userId) return;
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/${website._id}?userId=${userId}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch staff members');
        }
        const data = await res.json();
        setFetchedStaffMembers(data.staffMembers || []);
      } catch (error: any) {
        console.error("Error fetching staff members:", error);
        toast.error(error.message || "Failed to load staff members.");
      }
    };
    fetchStaff();
  }, [website._id, userId]);


  // Effect to trigger iframe re-render with debounce
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setIframeLoading(true);
    debounceTimeoutRef.current = setTimeout(() => {
      setIframeKey(prevKey => prevKey + 1);
    }, 500);
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    header, headingText, headingColor, headingShadow, headingShadowColor, headingFontSize,
    gradient1, gradient2, theme, branding, currentLogoUrl,
    currentBgImageUrl, tabsMode, quickActions, showQuickActions,
    showHomeTabHelpSection, selectedHomeTabHelpArticles,
    showStaffInitials, selectedStaffInitials,
    backgroundType, singleBackgroundColor
  ]);

  // Effect for handling iframe communication (sending config and listening for messages)
  useEffect(() => {
    const iframe = iframeRef.current;

    const postConfigToIframe = () => {
      if (iframe && iframe.contentWindow) {
        let bgColorToSend = undefined;
        let bgImageUrlToSend = undefined;

        if (backgroundType === 'solid') {
            bgColorToSend = singleBackgroundColor;
        } else if (backgroundType === 'image') {
            bgImageUrlToSend = currentBgImageUrl;
        }

        const config = {
          headerText: header,
          heading: {
            text: headingText,
            color: headingColor,
            shadow: headingShadow,
            shadowColor: headingShadowColor,
            fontSize: headingFontSize,
          },
          gradient1: gradient1,
          gradient2: gradient2,
          allowAIResponses: website.preferences.allowAIResponses,
          language: website.preferences.language,
          dynamiclyAdaptToLanguage: website.preferences.dynamiclyAdaptToLanguage,
          chatbotCode: website.chatbotCode,
          theme: theme,
          branding: branding,
          tabsMode: tabsMode,
          autoOpen: true,
          logoUrl: currentLogoUrl,
          ...(bgColorToSend && { bgColor: bgColorToSend }),
          ...(bgImageUrlToSend && { bgImageUrl: bgImageUrlToSend }),
          
          ...(showStaffInitials && {
              staffInitials: selectedStaffInitials
          }),
          homeTab: {
            ...(showQuickActions && {
                qickActionsButtons: quickActions.map(action => ({
                    text: action.text,
                    deepLink: buildDeepLink(action),
                    icon: action.icon || '' // action.icon is already the SVG string
                }))
            }),
            ...(showHomeTabHelpSection && {
                helpSection: selectedHomeTabHelpArticles.map(article => ({
                    title: article.title,
                    deepLink: `help->*cbhdeeplink^&^cbhdeeplink*->articleContent->*cbhdeeplink^&^cbhdeeplink*->${article.id}`
                }))
            })
          },
          translatedPhrases: {
            "We're here to help!": "Ми тут, щоб допомогти!",
            "Welcome!": "Ласкаво просимо!",
            "Please enter your email address to start a conversation with our support team.":
              "Будь ласка, введіть свою електронну адресу, щоб почати розмову з нашою службою підтримки.",
            "Enter your email address": "Введіть свою електронну адресу",
            "Start Conversation": "Почати розмову",
            "Your Conversations": "Ваші розмови",
            "Select a chat or start new one": "Виберіть чат або почніть новий",
            "No conversations yet": "Немає розмов",
            'Click "Start New Conversation" to begin!': "Натисніть \"Почати нову розмову\", щоб почати!",
            "Created:": "Створено:",
            "Last Update:": "Останнє оновлення:",
            "Click to view conversation": "Натисніть, щоб переглянути розмову",
            "✨ Start New Conversation": "✨ Почати нову розмову",
            "Live Chat": "Чат у реальному часі",
            "Connected with support": "Підключено до підтримки",
            "Support Team": "Команда підтримки",
            "Type your message...": "Введіть ваше повідомление...",
            "Send": "Надіслати",
            "You": "Ви",
            "Bot": "Бот",
            "AI Assistant": "AI Асистент",
            "Owner": "Власник",
            "Error loading chat history.": "Помилка завантаження історії чату.",
            "Error loading your chats.": "Помилка завантаження ваших чатів.",
            "Error starting a new chat.": "Помилка початку нового чату.",
            "This conversation has been closed.": "Цю розмову завершено.",
            "Hi! What is your name?": "Привіт! Як вас звати?",
            "open": "ВІДКРИТО",
            "closed": "ЗАКРИТО",
            "Please choose an option to continue.": "Будь ласка, виберіть варіант, щоб продовжити.",
            "Ok, I already transferred your message to the staff team, they will join this chat soon.":
              "Добре, я вже передав ваше повідомлення команді підтримки, вони скоро приєднаються до чату.",
            "Error processing your message.": "Помилка обробки вашого повідомлення.",
            "Powered by": "Працює на базі",
            "Home": "Головна",
            "Messages": "Повідомлення",
            "Help": "Допомога",
            "Search for help": "Пошук допомоги",
            "Find answers to common questions and get help with using our platform.":
              "Знайдіть відповіді на поширені запитання та отримайте допомогу щодо використання нашої платformи.",
            "Help & Support": "Допомога та підтримка",
          },
          socketIoUrl: "http://localhost:3001",
          backendUrl: "http://localhost:3001",
        };
        iframe.contentWindow.postMessage({ type: "chatbotConfig", config }, "*");
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!iframe) {
        console.warn('Chatbot iframe not found in message handler.');
        return;
      }

      const isMobile = window.innerWidth < 425;

      if (event.data && event.data.type === 'chatbotExpand') {
        if (isMobile) {
          iframe.style.width = '100vw';
          iframe.style.height = '100vh';
          iframe.style.bottom = '0';
          iframe.style.right = '0';
          iframe.style.borderRadius = '0';
        } else {
          iframe.style.width = event.data.width;
          iframe.style.height = event.data.height;
          iframe.style.bottom = '1.5rem';
          iframe.style.right = '1.5rem';
          iframe.style.borderRadius = '20px';
        }
        iframe.style.boxShadow = "0 25px 80px rgba(0, 0, 0, 0.15), 0 10px 40px rgba(0, 0, 0, 0.1)";
      } else if (event.data && (event.data.type === 'chatbotCollapse' || event.data.type === 'initialized')) {
        setTimeout(() => {
          iframe.style.width = '400px';
          iframe.style.height = '631px';
          iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          iframe.style.bottom = 'auto';
          iframe.style.right = 'auto';
          iframe.style.borderRadius = '20px';
        }, 500);
      }
    };

    window.addEventListener('message', handleMessage);

    const currentIframe = iframeRef.current;
    if (currentIframe) {
      currentIframe.onload = () => {
        setIframeLoading(false);
        postConfigToIframe();
      };
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (currentIframe) {
        currentIframe.onload = null;
      }
    };
  }, [iframeKey]);

  const filterFontSizeInput = (value: string): string => {
    return value.replace(/[^0-9.pxemrvw%]/g, '');
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentLogoUrl(reader.result as string);
        setLogoFileName(file.name);
        toast.info("Logo uploaded for preview.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentBgImageUrl(reader.result as string);
        setBgImageFileName(file.name);
        toast.info("Background image uploaded for preview.");
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuickActionButton = () => {
    setQuickActions([
      ...quickActions,
      { text: "", deepLinkType: "external", externalUrl: "", icon: ICON_SVG_LOOKUP.MessageSquare }, // Default to SVG string directly
    ]);
  };

  const updateQuickActionButton = (index: number, field: keyof QuickActionButton, value: any) => {
    const updatedActions = [...quickActions];
    console.log(field, value)
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    if (field === 'deepLinkType') {
      if (value === 'external') {
        updatedActions[index].internalTab = undefined;
        updatedActions[index].internalView = undefined;
        updatedActions[index].internalItemId = undefined;
      } else { // internal
        updatedActions[index].externalUrl = undefined;
      }
    } else if (field === 'internalTab') {
        updatedActions[index].internalView = undefined;
        updatedActions[index].internalItemId = undefined;
    } else if (field === 'internalView' && value !== 'articleContent') {
        updatedActions[index].internalItemId = undefined;
    }
    setQuickActions(updatedActions);
  };

  const removeQuickActionButton = (index: number) => {
    setQuickActions(quickActions.filter((_, i) => i !== index));
  };

  // Handlers for Help Section articles
  const handleAddHelpArticle = () => {
    const article = fetchedArticles.find(a => a._id === articleToAdd);
    if (article && !selectedHomeTabHelpArticles.some(a => a.id === article._id)) {
      setSelectedHomeTabHelpArticles([...selectedHomeTabHelpArticles, { id: article._id, title: article.title }]);
      setArticleToAdd(''); // Clear selection
    } else if (article) {
        toast.info("Article already added.");
    } else {
        toast.error("Please select an article to add.");
    }
  };

  const handleRemoveHelpArticle = (id: string) => {
    setSelectedHomeTabHelpArticles(selectedHomeTabHelpArticles.filter(a => a.id !== id));
  };

  // Handlers for Staff Initials
  const handleAddStaffInitial = () => {
    const staff = fetchedStaffMembers.find(s => s._id === staffMemberToAdd);
    if (staff) {
      const initials = getInitials(staff.name);
      if (!selectedStaffInitials.includes(initials)) {
        setSelectedStaffInitials([...selectedStaffInitials, initials]);
        setStaffMemberToAdd(''); // Clear selection
      } else {
        toast.info("Staff member's initials already added.");
      }
    } else {
      toast.error("Please select a staff member to add initials.");
    }
  };

  const handleRemoveStaffInitial = (initial: string) => {
    setSelectedStaffInitials(selectedStaffInitials.filter(i => i !== initial));
  };


  const handleSaveAppearance = async () => {
    setButtonLoading(true);
    try {
      const updatedPreferences = {
        ...website.preferences,
        header,
        heading: {
          text: headingText,
          color: headingColor,
          shadow: headingShadow,
          shadowColor: headingShadowColor,
          fontSize: headingFontSize,
        },
        colors: {
          gradient1,
          gradient2,
        },
        theme,
        branding,
        tabsMode: tabsMode,
        backgroundType: backgroundType,
        // Conditionally save bgImageUrl or bgColor based on type
        ...(backgroundType === 'image' && { bgImageUrl: currentBgImageUrl === './bg-image.png' ? undefined : currentBgImageUrl }),
        ...(backgroundType === 'solid' && { bgColor: singleBackgroundColor }),
        // If 'gradient', neither bgImageUrl nor bgColor is passed (or they are explicitly undefined)

        ...(showQuickActions && {
            quickActions: quickActions.map(action => ({
                text: action.text,
                deepLinkType: action.deepLinkType,
                externalUrl: action.externalUrl,
                internalTab: action.internalTab,
                internalView: action.internalView,
                internalItemId: action.internalItemId,
                icon: action.icon // Icon is already SVG string
            }))
        }),
        ...(showHomeTabHelpSection && {
            selectedHomeTabHelpArticles: selectedHomeTabHelpArticles
        }),
        ...(showStaffInitials && {
            selectedStaffInitials: selectedStaffInitials
        }),
        showQuickActions: showQuickActions,
        showHomeTabHelpSection: showHomeTabHelpSection,
        showStaffInitials: showStaffInitials
      };

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: updatedPreferences,
          userId: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update chatbot appearance.");
      }

      const responseData = await res.json();
      if (onUpdate) {
        const updatedWebsite = {
            ...responseData.website,
            preferences: {
                ...responseData.website.preferences,
                quickActions: responseData.website.preferences.quickActions?.map((action: any) => ({
                    ...action,
                    // When onUpdate is called, the icon received from DB will be SVG string, no mapping needed.
                    icon: action.icon // Already SVG string from DB
                })),
                showQuickActions: responseData.website.preferences.showQuickActions,
                showHomeTabHelpSection: responseData.website.preferences.showHomeTabHelpSection,
                selectedHomeTabHelpArticles: responseData.website.preferences.selectedHomeTabHelpArticles,
                showStaffInitials: responseData.website.preferences.showStaffInitials,
                selectedStaffInitials: responseData.website.preferences.selectedStaffInitials,
                heading: responseData.website.preferences.heading ? {
                    text: responseData.website.preferences.heading.text,
                    color: responseData.website.preferences.heading.color,
                    shadow: responseData.website.preferences.heading.shadow,
                    shadowColor: responseData.website.preferences.heading.shadowColor,
                    fontSize: responseData.website.preferences.heading.fontSize,
                } : undefined,
                backgroundType: responseData.website.preferences.backgroundType,
                bgColor: responseData.website.preferences.bgColor
            }
        };
        onUpdate(updatedWebsite);
      }
      toast.success("Chatbot appearance saved successfully!");
    } catch (error: any) {
      console.error("Error saving chatbot appearance:", error);
      toast.error(error.message || "Failed to update chatbot appearance. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  const resetToDefaults = () => {
    setHeader("Chat Support");
    setHeadingText("Hi there 👋 <br/> How can we help you today?");
    setHeadingColor("#1f2937");
    setHeadingShadow(false);
    setHeadingShadowColor("#000000");
    setHeadingFontSize("24px");

    setGradient1("#10b981");
    setGradient2("#059669");
    setTheme("light");
    setBranding(true);
    setCurrentLogoUrl("./logo.png");
    setCurrentBgImageUrl("bg-image.png");
    setLogoFileName(null);
    setBgImageFileName(null);
    setTabsMode(true);
    setQuickActions([]);
    setShowQuickActions(true);
    setShowHomeTabHelpSection(true);
    setSelectedHomeTabHelpArticles([]);
    setShowStaffInitials(true);
    setSelectedStaffInitials([]);
    setBackgroundType('gradient');
    setSingleBackgroundColor('#FFFFFF');
    toast.info("Chatbot appearance reset to defaults");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      {/* Left Column: Customization Options */}
      <div className="lg:w-1/2">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden h-full max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-2xl" />

          <CardHeader className="pb-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Chatbot Appearance</CardTitle>
                <p className="text-slate-600 text-sm font-medium">Customize your chatbot's visual style</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 relative z-10">
            {/* --- General Settings Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">General Settings</h4>
              </div>

              {/* Chat Header Title */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-sm">Chat Header Title</Label>
                <Input
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  placeholder="e.g., Chat Support, Help Center"
                  className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                />
              </div>

              {/* Chat Heading Customization */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-sm flex items-center">
                    <HeadingIcon className="w-4 h-4 mr-2 text-purple-500" /> Chat Welcome Heading
                </Label>
                <Input
                  value={headingText}
                  onChange={(e) => setHeadingText(e.target.value)}
                  placeholder="e.g., Hi there! How can we help you?"
                  className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-medium"
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <Label className="text-slate-700 font-semibold text-sm">Text Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                            <Input
                                type="color"
                                value={headingColor}
                                onChange={(e) => setHeadingColor(e.target.value)}
                                className="h-10 w-12 rounded-lg border-slate-200/60 p-0.5 shadow-sm"
                            />
                            <Input
                                type="text"
                                value={headingColor}
                                onChange={(e) => setHeadingColor(e.target.value)}
                                className="flex-1 h-10 bg-slate-50/80 border-slate-200/60 text-slate-900 rounded-lg font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-slate-700 font-semibold text-sm">Font Size</Label>
                        <Input
                            type="text"
                            value={headingFontSize}
                            onChange={(e) => setHeadingFontSize(filterFontSizeInput(e.target.value))}
                            placeholder="e.g., 24px, 1.5rem"
                            className="h-10 mt-1 bg-slate-50/80 border-slate-200/60 text-slate-900 rounded-lg font-medium"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl mt-3">
                    <span className="text-slate-900 font-medium text-sm">Text Shadow</span>
                    <Switch
                        checked={headingShadow}
                        onCheckedChange={setHeadingShadow}
                    />
                </div>
                {headingShadow && (
                    <div className="space-y-3 pt-3">
                        <Label className="text-slate-700 font-semibold text-sm">Shadow Color</Label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="color"
                                value={headingShadowColor}
                                onChange={(e) => setHeadingShadowColor(e.target.value)}
                                className="h-10 w-12 rounded-lg border-slate-200/60 p-0.5 shadow-sm"
                            />
                            <Input
                                type="text"
                                value={headingShadowColor}
                                onChange={(e) => setHeadingShadowColor(e.target.value)}
                                className="flex-1 h-10 bg-slate-50/80 border-slate-200/60 text-slate-900 rounded-lg font-mono text-sm"
                            />
                        </div>
                    </div>
                )}
                <p className="text-sm text-slate-500 mt-2">
                    This text appears prominently on the chatbot's home screen. HTML tags like `&lt;br/&gt;` are supported.
                </p>
              </div>

              {/* Theme Switch */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-sm">Theme</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className={`h-12 flex-1 rounded-2xl ${
                      theme === "light"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                        : "border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className={`h-12 flex-1 rounded-2xl ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md"
                        : "border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                </div>
              </div>

              {/* Tabs Mode Switch */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-sm flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-2 text-purple-500" /> Tabs Mode
                </Label>
                <div className="flex items-center justify-between p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl">
                  <span className="text-slate-900 font-medium">Enable Tab Navigation</span>
                  <Switch
                    checked={tabsMode}
                    onCheckedChange={setTabsMode}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Toggle between displaying multiple tabs (Home, Messages, Help) or a single chat view.
                </p>
              </div>
            </div>

            {/* --- Visual Elements Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-teal-200 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Visual Elements</h4>
              </div>

              {/* Background Type Selection */}
              <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold text-sm flex items-center">
                      <Paintbrush className="w-4 h-4 mr-2 text-pink-500" /> Background Style
                  </Label>
                  <RadioGroup
                      value={backgroundType}
                      onValueChange={(value: BackgroundType) => setBackgroundType(value)}
                      className="grid grid-cols-3 gap-2"
                  >
                      <Label htmlFor="bg-gradient" className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200/60 bg-slate-50/80 p-3 hover:bg-slate-100 cursor-pointer transition-all has-[[data-state=checked]]:border-blue-500">
                          <RadioGroupItem value="gradient" id="bg-gradient" className="sr-only" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 mb-2" />
                          <span className="text-xs font-medium text-slate-900">Gradient</span>
                      </Label>
                      <Label htmlFor="bg-image" className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200/60 bg-slate-50/80 p-3 hover:bg-slate-100 cursor-pointer transition-all has-[[data-state=checked]]:border-blue-500">
                          <RadioGroupItem value="image" id="bg-image" className="sr-only" />
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 mb-2">
                              <ImageIcon className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-xs font-medium text-slate-900">Image</span>
                      </Label>
                      <Label htmlFor="bg-solid" className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200/60 bg-slate-50/80 p-3 hover:bg-slate-100 cursor-pointer transition-all has-[[data-state=checked]]:border-blue-500">
                          <RadioGroupItem value="solid" id="bg-solid" className="sr-only" />
                          <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: singleBackgroundColor }} />
                          <span className="text-xs font-medium text-slate-900">Solid Color</span>
                      </Label>
                  </RadioGroup>
                  {backgroundType === 'image' && (
                      <div className="space-y-3 pt-3">
                          <Label htmlFor="bgImageUpload" className="text-slate-700 font-semibold text-sm flex items-center">
                              <Image className="w-4 h-4 mr-2 text-green-500" /> Upload Background Image
                          </Label>
                          <input
                              id="bgImageUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleBgImageUpload}
                              ref={bgImageInputRef}
                              className="hidden"
                          />
                          <Button
                              onClick={() => bgImageInputRef.current?.click()}
                              variant="outline"
                              className="w-full h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                              <Upload className="w-4 h-4 mr-2" /> Select Background Image
                          </Button>
                          {bgImageFileName && (
                              <p className="text-sm text-slate-600 mt-1 flex items-center">
                                  Selected: <span className="font-mono text-xs ml-1 bg-slate-100 p-1 rounded max-w-full truncate">{bgImageFileName}</span>
                              </p>
                          )}
                          <p className="text-sm text-slate-500 mt-2">
                              Upload a background image for your chatbot.
                          </p>
                      </div>
                  )}
                  {backgroundType === 'solid' && (
                      <div className="space-y-3 pt-3">
                          <Label className="text-slate-700 font-semibold text-sm">Select Solid Background Color</Label>
                          <div className="flex items-center space-x-3">
                              <Input
                                  type="color"
                                  value={singleBackgroundColor}
                                  onChange={(e) => setSingleBackgroundColor(e.target.value)}
                                  className="h-12 w-16 rounded-2xl border-2 border-slate-200/60 p-0.5 shadow-sm"
                              />
                              <Input
                                  type="text"
                                  value={singleBackgroundColor}
                                  onChange={(e) => setSingleBackgroundColor(e.target.value)}
                                  className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 rounded-lg font-mono text-sm"
                              />
                          </div>
                      </div>
                  )}
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label htmlFor="logoUpload" className="text-slate-700 font-semibold text-sm flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Custom Logo
                </Label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  ref={logoInputRef}
                  className="hidden"
                />
                <Button
                  onClick={() => logoInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" /> Select Logo
                </Button>
                {logoFileName && (
                  <p className="text-sm text-slate-600 mt-1 flex items-center">
                    Selected: <span className="font-mono text-xs ml-1 bg-slate-100 p-1 rounded max-w-full truncate">{logoFileName}</span>
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-2">
                  Upload your company logo (PNG, JPG, SVG).
                </p>
              </div>
            </div>

            {/* --- Home Screen Content Sections --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-200 rounded-xl flex items-center justify-center">
                  <Home className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Home Screen Content</h4>
              </div>

              {/* Staff Initials Section Toggle */}
              <div className="space-y-3">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setIsStaffInitialsOpen(!isStaffInitialsOpen)}
                  className="flex items-center justify-between w-full p-4 bg-slate-100/80 border border-slate-200/60 rounded-2xl shadow-sm text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                >
                  <span className="flex items-center space-x-2 font-semibold">
                    <Users className="w-4 h-4 text-teal-500" /> Staff Initials Display
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isStaffInitialsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Accordion Content */}
                {isStaffInitialsOpen && (
                  <div className="space-y-4 pt-4 border-l border-r border-b border-slate-200/60 rounded-b-2xl p-4 bg-slate-50/80 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-900 font-medium">Show Staff Initials on Home Tab</span>
                      <Switch
                        checked={showStaffInitials}
                        onCheckedChange={setShowStaffInitials}
                      />
                    </div>
                    {showStaffInitials && (
                      <div className="space-y-4">
                          <div className="space-y-1">
                              <Label htmlFor="add-staff-initial" className="text-slate-700 text-sm">Add Staff Initials</Label>
                              <div className="flex items-center gap-2">
                                  <Select
                                      value={staffMemberToAdd}
                                      onValueChange={setStaffMemberToAdd}
                                  >
                                      <SelectTrigger className="flex-1 h-10 bg-white border-slate-200/60 rounded-lg">
                                          <SelectValue placeholder="Select staff member" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {fetchedStaffMembers.length === 0 && (
                                              <SelectItem value="no-staff" disabled>No staff members found.</SelectItem>
                                          )}
                                          {fetchedStaffMembers.map(staff => (
                                              <SelectItem key={staff._id} value={staff._id} disabled={selectedStaffInitials.includes(getInitials(staff.name))}>
                                                  {staff.name} ({getInitials(staff.name)})
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <Button onClick={handleAddStaffInitial} size="icon" variant="outline" className="h-10 w-10 border-slate-200/60 text-blue-600 hover:bg-blue-50/20">
                                      <Plus className="w-4 h-4" />
                                  </Button>
                              </div>
                              <p className="text-xs text-slate-500">Select staff members whose initials will be shown on the home tab.</p>
                          </div>

                          {selectedStaffInitials.length > 0 && (
                              <div className="space-y-2">
                                  <Label className="text-slate-700 text-sm">Selected Initials:</Label>
                                  {selectedStaffInitials.map((initial) => (
                                      <div key={initial} className="flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                                          <div className="flex items-center gap-2">
                                              <User className="w-4 h-4 text-slate-500" />
                                              <span className="text-sm font-medium">{initial}</span>
                                          </div>
                                          <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleRemoveStaffInitial(initial)}
                                              className="text-red-500 hover:bg-red-50/20"
                                          >
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  ))}
                              </div>
                          )}
                          {selectedStaffInitials.length === 0 && (
                              <p className="text-sm text-slate-500">No staff initials selected.</p>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Action Buttons Section Toggle */}
              <div className="space-y-3">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                  className="flex items-center justify-between w-full p-4 bg-slate-100/80 border border-slate-200/60 rounded-2xl shadow-sm text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                >
                  <span className="flex items-center space-x-2 font-semibold">
                    <ListChecks className="w-4 h-4 mr-2 text-indigo-500" /> Quick Actions Section
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Accordion Content */}
                {isQuickActionsOpen && (
                  <div className="space-y-4 pt-4 border-l border-r border-b border-slate-200/60 rounded-b-2xl p-4 bg-slate-50/80 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-900 font-medium">Display Quick Action Buttons</span>
                      <Switch
                        checked={showQuickActions}
                        onCheckedChange={setShowQuickActions}
                      />
                    </div>
                    {showQuickActions && (
                      <div className="space-y-4">
                          {quickActions.map((action, index) => (
                          <Card key={index} className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl shadow-sm">
                              <CardContent className="p-0 space-y-3">
                              <div className="flex justify-end">
                                  <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuickActionButton(index)}
                                  className="text-red-500 hover:bg-red-50/20"
                                  >
                                  <Trash2 className="h-4 w-4" />
                                  </Button>
                              </div>
                              <div>
                                  <Label htmlFor={`button-text-${index}`} className="text-slate-700 text-sm">Button Text</Label>
                                  <Input
                                  id={`button-text-${index}`}
                                  value={action.text}
                                  onChange={(e) => updateQuickActionButton(index, 'text', e.target.value)}
                                  placeholder="e.g., Send us a message"
                                  className="h-10 mt-1 bg-white border-slate-200/60 text-slate-900 rounded-lg"
                                  />
                              </div>
                              <div>
                                  <Label htmlFor={`link-type-${index}`} className="text-slate-700 text-sm">Link Type</Label>
                                  <Select
                                  value={action.deepLinkType}
                                  onValueChange={(value: 'external' | 'internal') => updateQuickActionButton(index, 'deepLinkType', value)}
                                  >
                                  <SelectTrigger className="w-full h-10 mt-1 bg-white border-slate-200/60 rounded-lg">
                                      <SelectValue placeholder="Select link type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="external">External URL</SelectItem>
                                      <SelectItem value="internal">Widget Link</SelectItem>
                                  </SelectContent>
                                  </Select>
                              </div>

                              {action.deepLinkType === 'external' && (
                                  <div>
                                  <Label htmlFor={`external-url-${index}`} className="text-slate-700 text-sm">External URL</Label>
                                  <Input
                                      id={`external-url-${index}`}
                                      type="url"
                                      value={action.externalUrl || ''}
                                      onChange={(e) => updateQuickActionButton(index, 'externalUrl', e.target.value)}
                                      placeholder="https://example.com/contact"
                                      className="h-10 mt-1 bg-white border-slate-200/60 text-slate-900 rounded-lg"
                                  />
                                  </div>
                              )}

                              {action.deepLinkType === 'internal' && (
                                  <div className="space-y-3">
                                  <div>
                                      <Label htmlFor={`internal-tab-${index}`} className="text-slate-700 text-sm">Widget Tab</Label>
                                      <Select
                                      value={action.internalTab}
                                      onValueChange={(value: 'home' | 'messages' | 'help') => updateQuickActionButton(index, 'internalTab', value)}
                                      >
                                      <SelectTrigger className="w-full h-10 mt-1 bg-white border-slate-200/60 rounded-lg">
                                          <SelectValue placeholder="Select tab" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="home">Home</SelectItem>
                                          <SelectItem value="messages">Messages</SelectItem>
                                          <SelectItem value="help">Help</SelectItem>
                                      </SelectContent>
                                      </Select>
                                  </div>
                                  {action.internalTab === 'messages' && (
                                      <div>
                                      <Label htmlFor={`internal-view-${index}`} className="text-slate-700 text-sm">Messages View</Label>
                                      <Select
                                          value={action.internalView}
                                          onValueChange={(value: 'conversations' | 'chat' | 'null') => updateQuickActionButton(index, 'internalView', value)}
                                      >
                                          <SelectTrigger className="w-full h-10 mt-1 bg-white border-slate-200/60 rounded-lg">
                                          <SelectValue placeholder="Select view" />
                                          </SelectTrigger>
                                          <SelectContent>
                                          <SelectItem value="conversations">All Conversations</SelectItem>
                                          <SelectItem value="chat">New Chat</SelectItem>
                                          </SelectContent>
                                      </Select>
                                      {action.internalView === 'chat' && (
                                          <p className="text-xs text-slate-500 mt-1">
                                          Selecting "New Chat" will start a new conversation.
                                          </p>
                                      )}
                                      </div>
                                  )}
                                  {action.internalTab === 'help' && (
                                      <div>
                                      <Label htmlFor={`internal-view-${index}`} className="text-slate-700 text-sm">Help View</Label>
                                      <Select
                                          value={action.internalView || 'articles'}
                                          onValueChange={(value: 'articles' | 'articleContent' | 'null') => updateQuickActionButton(index, 'internalView', value)}
                                      >
                                          <SelectTrigger className="w-full h-10 mt-1 bg-white border-slate-200/60 rounded-lg">
                                          <SelectValue placeholder="Select view" />
                                          </SelectTrigger>
                                          <SelectContent>
                                          <SelectItem value="articles">All Articles</SelectItem>
                                          <SelectItem value="articleContent">Specific Article</SelectItem>
                                          </SelectContent>
                                      </Select>
                                      {action.internalView === 'articleContent' && (
                                          <div className="space-y-1">
                                              <Label htmlFor={`article-id-${index}`} className="text-slate-700 text-sm">Select Article</Label>
                                              <Select
                                                  value={action.internalItemId || ''}
                                                  onValueChange={(value: string) => updateQuickActionButton(index, 'internalItemId', value)}
                                              >
                                                  <SelectTrigger className="w-full h-10 bg-white border-slate-200/60 rounded-lg">
                                                      <SelectValue placeholder="Choose an article" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                      {fetchedArticles.map(article => (
                                                          <SelectItem key={article._id} value={article._id}>
                                                              {article.title}
                                                          </SelectItem>
                                                      ))}
                                                  </SelectContent>
                                              </Select>
                                              <p className="text-xs text-slate-500 mt-1">
                                                  Select a specific article from your FAQs.
                                              </p>
                                          </div>
                                      )}
                                      </div>
                                  )}
                                  </div>
                              )}

                              <div>
                                  <Label htmlFor={`icon-select-${index}`} className="text-slate-700 text-sm">Icon</Label>
                                  <Select
                                  value={action.icon || ''} // value is SVG string
                                  onValueChange={(value: string) => updateQuickActionButton(index, 'icon', value)} // value received is SVG string
                                  >
                                  <SelectTrigger className="w-full h-10 mt-1 bg-white border-slate-200/60 rounded-lg">
                                      {/* Display currently selected icon and its name */}
                                      <SelectValue>
                                          <div className="flex items-center">
                                              {action.icon && <span dangerouslySetInnerHTML={{ __html: action.icon }} className="mr-2" />}
                                              {getIconNameBySvg(action.icon as string | undefined) || "Select an icon"}
                                          </div>
                                      </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                      {/* Map ICON_OPTIONS_ARRAY for SelectItems */}
                                      {ICON_OPTIONS_ARRAY.map(iconOption => (
                                      <SelectItem key={iconOption.name} value={iconOption.svg}> {/* SelectItem value is SVG string */}
                                          <div className="flex items-center">
                                          <span dangerouslySetInnerHTML={{ __html: iconOption.svg }} className="mr-2" />
                                          {iconOption.name}
                                          </div>
                                      </SelectItem>
                                      ))}
                                  </SelectContent>
                                  </Select>
                              </div>
                              </CardContent>
                          </Card>
                          ))}
                      </div>
                    )}
                    {showQuickActions && (
                        <Button onClick={addQuickActionButton} variant="outline" className="w-full h-12 border-slate-200/60 text-blue-600 hover:bg-blue-50/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Quick Action Button
                        </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Help Section Toggle */}
              <div className="space-y-3">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setIsHelpSectionOpen(!isHelpSectionOpen)}
                  className="flex items-center justify-between w-full p-4 bg-slate-100/80 border border-slate-200/60 rounded-2xl shadow-sm text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                >
                  <span className="flex items-center space-x-2 font-semibold">
                    <HelpCircle className="w-4 h-4 mr-2 text-blue-500" /> Help Section
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isHelpSectionOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Accordion Content */}
                {isHelpSectionOpen && (
                  <div className="space-y-4 pt-4 border-l border-r border-b border-slate-200/60 rounded-b-2xl p-4 bg-slate-50/80 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-900 font-medium">Display Help Articles Section</span>
                      <Switch
                        checked={showHomeTabHelpSection}
                        onCheckedChange={setShowHomeTabHelpSection}
                      />
                    </div>
                    {showHomeTabHelpSection && (
                      <div className="space-y-4">
                          <div className="space-y-1">
                              <Label htmlFor="add-help-article" className="text-slate-700 text-sm">Add Article to Help Section</Label>
                              <div className="flex items-center gap-2">
                                  <Select
                                      value={articleToAdd}
                                      onValueChange={setArticleToAdd}
                                  >
                                      <SelectTrigger className="flex-1 h-10 bg-white border-slate-200/60 rounded-lg">
                                          <SelectValue placeholder="Select an article" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {fetchedArticles.length === 0 && (
                                              <SelectItem value="no-articles" disabled>No articles found. Fetching or empty.</SelectItem>
                                          )}
                                          {fetchedArticles.map(article => (
                                              <SelectItem key={article._id} value={article._id} disabled={selectedHomeTabHelpArticles.some(a => a.id === article._id)}>
                                                  {article.title}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <Button onClick={handleAddHelpArticle} size="icon" variant="outline" className="h-10 w-10 border-slate-200/60 text-blue-600 hover:bg-blue-50/20">
                                      <Plus className="w-4 h-4" />
                                  </Button>
                              </div>
                              <p className="text-xs text-slate-500">Select an article from your FAQs to add to the help section.</p>
                          </div>

                          {selectedHomeTabHelpArticles.length > 0 && (
                              <div className="space-y-2">
                                  <Label className="text-slate-700 text-sm">Selected Articles:</Label>
                                  {selectedHomeTabHelpArticles.map(article => (
                                      <div key={article.id} className="flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                                          <div className="flex items-center gap-2">
                                              <FileText className="w-4 h-4 text-slate-500" />
                                              <span className="text-sm font-medium">{article.title}</span>
                                          </div>
                                          <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleRemoveHelpArticle(article.id)}
                                              className="text-red-500 hover:bg-red-50/20"
                                          >
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  ))}
                              </div>
                          )}
                          {selectedHomeTabHelpArticles.length === 0 && (
                              <p className="text-sm text-slate-500">No articles selected for the help section.</p>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* --- Advanced Settings Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-gray-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Advanced Settings</h4>
              </div>

              {/* Branding Option */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Remove "Powered by" Branding
                </Label>
                <div className="flex items-center justify-between p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl">
                  <span className={`text-slate-900 font-medium ${!isProOrEnterprise ? 'opacity-50' : ''}`}>
                    Show "Powered by YourProduct"
                  </span>
                  <Switch
                    checked={!branding}
                    onCheckedChange={(checked) => setBranding(!checked)}
                    disabled={!isProOrEnterprise}
                  />
                </div>
                {!isProOrEnterprise && (
                  <p className="text-sm text-slate-500 mt-2">
                    Branding removal is available only on Pro and Enterprise plans. Current Plan: <span className="font-semibold">{website.plan.name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* --- Color Customization Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Color Customization</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold text-sm">Primary Color</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={gradient1}
                      onChange={(e) => setGradient1(e.target.value)}
                      className="h-12 w-16 rounded-2xl border-2 border-slate-200/60 p-1 shadow-sm"
                    />
                    <Input
                      type="text"
                      value={gradient1}
                      onChange={(e) => setGradient1(e.target.value)}
                      className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold text-sm">Secondary Color</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={gradient2}
                      onChange={(e) => setGradient2(e.target.value)}
                      className="h-12 w-16 rounded-2xl border-2 border-slate-200/60 p-1 shadow-sm"
                    />
                    <Input
                      type="text"
                      value={gradient2}
                      onChange={(e) => setGradient2(e.target.value)}
                      className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSaveAppearance}
              disabled={buttonLoading}
              className="h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300"
            >
              {buttonLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Appearance
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Column: Iframe for Live Preview */}
      <div className="lg:w-1/2 flex items-center justify-center min-h-[500px] lg:min-h-0 relative">
        <div className="p-6 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-3xl border border-slate-200/60 w-full h-full flex flex-col justify-center items-center">
          <div className="flex items-center space-x-2 mb-4">
            <Label className="text-slate-700 font-semibold text-sm">Live Preview</Label>
            <div className="flex items-center space-x-1 text-emerald-600">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">Real-time</span>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-full max-w-[400px] h-[631px] bg-slate-100 rounded-2xl overflow-hidden">
            {iframeLoading && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center rounded-2xl text-slate-500 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading Chatbot Preview...
              </div>
            )}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src="http://127.0.0.1:5500/widjet/"
              title="Chatbot Widget Preview"
              className={`w-full h-full border-0 rounded-2xl transition-opacity duration-300 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
              style={{
                minHeight: "630px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: '400px',
                height: '631px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}