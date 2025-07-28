"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
    Brain,
    Zap,
    Clock,
    Save,
    RefreshCw,
    AlertTriangle,
    Loader2,
    ArrowRight,
    TrendingUp,
    Activity,
    Sparkles,
    Target,
    PlusCircle,
    Trash2,
    ExternalLink,
    CheckCircle,
    XCircle,
    Hourglass,
    Info,
    FileText, // For AI Summary icon
    Edit, // For edit button
} from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch" // Assuming authFetch handles token and base URL
import { TokenUsageChart } from "./token-usage-chart"
import Link from "next/link"
import { AIManagementSkeleton } from "./ai-management-skeleton"
import { Textarea } from "@/components/ui/textarea" // Assuming you have a Textarea component

// --- START: Markdown Libraries Import ---
import { marked } from "marked" // Import marked library
import DOMPurify from "dompurify" // Import DOMPurify for sanitization
// --- END: Markdown Libraries Import ---


// Modal components (simplified for this example, you might use Shadcn Dialog)
const Modal = ({ children, onClose, fullWidthHeight = false }) => ( // Added fullWidthHeight prop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white p-8 rounded-3xl shadow-2xl relative ${fullWidthHeight ? 'max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto' : 'max-w-sm w-full'}`}>
            {children}
            <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                <XCircle className="w-5 h-5 text-slate-500" />
            </Button>
        </div>
    </div>
)

interface Website {
    _id: string
    name: string
    link: string
    description: string
    chatbotCode: string
    chats: string[]
    plan: {
        _id: string
        name: string
        description: string
        priceMonthly: number
        maxStaffMembers: number
        allowAI: boolean
        creditBoostMonthly: number
    }
    creditCount: number
    staffMembers: string[]
    preferences: {
        colors: {
            gradient1: string
            gradient2: string
        }
        header: string
        allowAIResponses: boolean
        allowedPaths?: string[]
        disallowedPaths?: string[]
        language?: string
        dailyTokenLimit?: number | null
        // Added scrapePaths and aiSummary
        scrapePaths?: string[]
    }
    predefinedAnswers: string
    createdAt: string
    updatedAt: string
    aiSummary?: string
}

interface AIManagementProps {
    website: Website
    onUpdate: (website: Website) => void
    userId: string
}

// Define possible backend statuses for mapping
type BackendPathStatus = 'queued' | 'scraping' | 'scraped' | 'failed';
type FrontendPathStatus = 'Scraped' | 'Failed' | 'Pending' | 'Not Scraped' | 'Scraping...';

// Map backend statuses to frontend display names
const mapBackendStatusToFrontend = (backendStatus: BackendPathStatus): FrontendPathStatus => {
    switch (backendStatus) {
        case 'queued':
            return 'Pending';
        case 'scraping':
            return 'Scraping...';
        case 'scraped':
            return 'Scraped';
        case 'failed':
            return 'Failed';
        default:
            return 'Not Scraped'; // Default for any unhandled or initial state
    }
};

export function AIManagement({ website, onUpdate, userId }: AIManagementProps) {
    const [allowAIResponses, setAllowAIResponses] = useState(website?.preferences?.allowAIResponses || false)
    const [dailyTokenLimit, setDailyTokenLimit] = useState<string>(website.preferences?.dailyTokenLimit?.toString() || "")
    const [scrapePaths, setScrapePaths] = useState<string[]>(website.preferences?.scrapePaths || [])
    const [aiSummary, setAiSummary] = useState<string>(website.aiSummary || "")
    const [pathStatuses, setPathStatuses] = useState<{ [key: string]: FrontendPathStatus }>({})
    const [showScrapeModal, setShowScrapeModal] = useState(false)
    const [selectedPathToScrape, setSelectedPathToScrape] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isDataReady, setIsDataReady] = useState(false)
    const [isScraping, setIsScraping] = useState(false) // For overall scraping activity
    const [newScrapePath, setNewScrapePath] = useState<string>("")

    console.log(website)
    // State for full AI summary modal
    const [showFullSummaryModal, setShowFullSummaryModal] = useState(false)
    // State for editing AI summary
    const [isEditingAiSummary, setIsEditingAiSummary] = useState(false)
    // State for Markdown help modal
    const [showMarkdownHelpModal, setShowMarkdownHelpModal] = useState(false)

    // Derived values
    const aiEnabledByPlan = website.plan.allowAI
    const currentCredits = website.creditCount
    const isEnterprisePlan = website.plan.name.toLowerCase().includes("enterprise")

    // Truncate AI summary for display
    const truncatedAiSummary = aiSummary.length > 300 ? aiSummary.substring(0, 300) + "..." : aiSummary;
    // Scraper Service URL from environment variable
    const SCRAPER_SERVICE_URL = process.env.NEXT_PUBLIC_SCRAPER_SERVICE_URL;

    // --- START: Markdown Render Function ---
    // Function to render markdown safely
    const renderMarkdown = (markdownText: string) => {
        if (!markdownText) return { __html: "" }; // Handle empty or null text
        // Use `breaks: true` for newlines to be rendered as <br>
        const rawMarkup = marked.parse(markdownText, { breaks: true, gfm: true }) as string;
        // Sanitize the HTML to prevent XSS attacks
        return { __html: DOMPurify.sanitize(rawMarkup) };
    };
    // --- END: Markdown Render Function ---


    // Function to fetch actual path statuses from the backend
    const fetchPathStatuses = useCallback(async () => {
        if (!SCRAPER_SERVICE_URL || !website._id) {
            console.warn("SCRAPER_SERVICE_URL or website ID not available for fetching statuses.");
            return;
        }
        setLoading(true); // Indicate loading of statuses
        try {
            const res = await authFetch(`${SCRAPER_SERVICE_URL}/api/website-paths/${website._id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                if (res.status === 404) {
                    // No paths found for this website, which is fine
                    setPathStatuses({});
                    console.info(`No existing scrape statuses found for website ${website._id}.`);
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to fetch path statuses.");
                }
            } else {
                const data = await res.json();
                const newStatuses: { [key: string]: FrontendPathStatus } = {};
                data.paths.forEach((p: { pathName: string; status: BackendPathStatus }) => {
                    newStatuses[p.pathName] = mapBackendStatusToFrontend(p.status);
                });
                setPathStatuses(newStatuses);
                console.info(`Fetched ${data.paths.length} scrape statuses for website ${website._id}.`);
            }
        } catch (error: any) {
            console.error("Error fetching path statuses:", error);
            toast.error(error.message || "Failed to fetch path statuses.");
        } finally {
            setLoading(false);
        }
    }, [SCRAPER_SERVICE_URL, website._id]);


    useEffect(() => {
        // Sync internal state with parent website prop changes
        setAllowAIResponses(website.preferences?.allowAIResponses || false)
        setDailyTokenLimit(website.preferences?.dailyTokenLimit?.toString() || "")
        setScrapePaths(website.preferences?.scrapePaths || [])
        setAiSummary(website.aiSummary || "") // Still syncs the full summary

        setIsDataReady(true) // Data from props is ready

        // Fetch statuses when component mounts or website._id changes
        fetchPathStatuses();
    }, [website, fetchPathStatuses]);


    // Handle AI Settings Save
    const handleSave = async () => {
        setLoading(true)
        try {
            const updatedPreferences = {
                ...website.preferences,
                allowAIResponses,
                dailyTokenLimit: dailyTokenLimit ? Number.parseInt(dailyTokenLimit) : null,
                scrapePaths, // Include scrapePaths
                // AI Summary is now managed directly
            }

            const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${website._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: website.name,
                    link: website.link,
                    description: website.description,
                    preferences: updatedPreferences,
                    // Pass aiSummary explicitly if it's being updated
                    aiSummary: aiSummary, // Pass the (potentially edited) AI summary
                    userId: userId,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "Failed to update AI settings.")
            }

            const responseData = await res.json()
            if (onUpdate) {
                onUpdate(responseData.website)
            }
            toast.success("AI settings saved successfully!")
            setIsEditingAiSummary(false); // Exit edit mode on successful save
        } catch (error: any) {
            console.error("Error saving AI settings:", error)
            toast.error(error.message || "Failed to update AI settings. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const resetToDefaults = () => {
        setAllowAIResponses(false)
        setDailyTokenLimit("")
        setScrapePaths([]) // Reset scrape paths
        setAiSummary("") // Reset AI Summary
        setPathStatuses({}) // Clear statuses
        toast.info("AI settings reset to defaults")
    }

    const handleAddPath = () => {
        if (newScrapePath.trim() === "") {
            toast.error("Path cannot be empty.")
            return
        }
        // Format the path: ensure it starts with a slash
        let formattedPath = newScrapePath.trim();
        if (!formattedPath.startsWith('/')) {
            formattedPath = '/' + formattedPath;
        }

        if (scrapePaths.includes(formattedPath)) {
            toast.info("This path already exists.")
            setNewScrapePath("")
            return
        }

        setScrapePaths((prevPaths) => [...prevPaths, formattedPath])
        setNewScrapePath("")
        setPathStatuses((prevStatuses) => ({ ...prevStatuses, [formattedPath]: 'Not Scraped' })); // Set initial status
        toast.success("Path added. Remember to save changes!")
    }

    const handleRemovePath = (pathToRemove: string) => {
        setScrapePaths((prevPaths) => prevPaths.filter((path) => path !== pathToRemove))
        setPathStatuses((prevStatuses) => {
            const newStatuses = { ...prevStatuses };
            delete newStatuses[pathToRemove];
            return newStatuses;
        });
        toast.info("Path removed. Remember to save changes!")
    }

    const handleScrapePath = (path: string) => {
        setSelectedPathToScrape(path)
        if (pathStatuses[path] === 'Scraped') {
            setShowScrapeModal(true) // Show modal if already scraped
        } else {
            confirmScrape(path) // Directly confirm if not scraped
        }
    }

    const confirmScrape = async (path: string) => {
        setShowScrapeModal(false) // Close modal if open
        setIsScraping(true) // Set overall scraping state
        // Update individual path status to 'Scraping...' immediately
        setPathStatuses((prevStatuses) => ({ ...prevStatuses, [path]: 'Scraping...' }));
        toast.info(`Scraping started for: ${path}`)

        try {
            if (!SCRAPER_SERVICE_URL) {
                throw new Error("Scraper service URL is not configured.");
            }

            const scrapePayload = {
                websiteId: website._id,
                paths: [{ path: path, needsScraping: true }],
                baseWebsiteUrl: website.link, // Use the website's main link as base URL
            };


            console.log(website._id)
            const res = await authFetch(`${SCRAPER_SERVICE_URL}/api/scrape-queue`, { // Changed to authFetch
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scrapePayload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to initiate scraping.");
            }

            // Backend should immediately return 202 Accepted if queued
            toast.success(`Scraping request sent for: ${path}. Status will update shortly.`);

            // Optionally, you could set up a polling mechanism here to fetch statuses
            // For now, we'll rely on a re-fetch after a short delay or user refresh.
            // A more advanced solution would involve WebSockets for real-time updates.
            setTimeout(() => {
                fetchPathStatuses(); // Re-fetch all statuses after a short delay
            }, 5000); // Wait 5 seconds before re-fetching statuses

        } catch (error: any) {
            console.error("Error during scraping initiation:", error);
            setPathStatuses((prevStatuses) => ({ ...prevStatuses, [path]: 'Failed' })); // Set to failed on initiation error
            toast.error(error.message || `Error initiating scraping for: ${path}`);
        } finally {
            setIsScraping(false) // Reset overall scraping state
        }
    }

    const getStatusIcon = (status: FrontendPathStatus) => {
        switch (status) {
            case 'Scraped':
                return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'Failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'Pending':
                return <Hourglass className="w-4 h-4 text-amber-500" />;
            case 'Not Scraped':
                return <Info className="w-4 h-4 text-slate-500" />;
            case 'Scraping...':
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            default:
                return null;
        }
    };

    const getStatusTextClass = (status: FrontendPathStatus) => {
        switch (status) {
            case 'Scraped':
                return 'text-emerald-700';
            case 'Failed':
                return 'text-red-700';
            case 'Pending':
                return 'text-amber-700';
            case 'Not Scraped':
                return 'text-slate-700';
            case 'Scraping...':
                return 'text-blue-700';
            default:
                return '';
        }
    };

    if (!isDataReady) {
        return <AIManagementSkeleton />
    }

    return (
        <div className="bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50 p-4 md:p-6 rounded-3xl shadow-inner">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Management</h1>
                    <p className="text-slate-600">Configure AI responses, manage credits, and monitor usage analytics</p>
                </div>

                {/* Call to Action Card - Only show buy tokens if not Enterprise and AI is enabled */}
                {!isEnterprisePlan && aiEnabledByPlan && (
                    <Card className="relative mb-8 border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                        </div>
                        <CardContent className="relative z-10 p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Power Up Your AI</h3>
                                    </div>
                                    <p className="text-purple-100 text-lg mb-4 lg:mb-0">
                                        Get more AI credits to handle increased conversation volume and provide instant responses 24/7.
                                    </p>
                                    <div className="flex items-center space-x-6 text-sm text-purple-100">
                                        <div className="flex items-center space-x-1">
                                            <Activity className="w-3 h-3" />
                                            <span>24/7 Availability</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Instant Responses</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link href={`/token-purchase?websiteId=${website._id.toString()}`}>
                                        <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl shadow-lg font-semibold px-8 py-4 h-auto transition-all transform hover:scale-105">
                                            <Zap className="w-5 h-5 mr-2" />
                                            Buy Credits
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* AI Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Available Credits */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium">Available Credits</p>
                                    <p className="text-3xl font-bold">{currentCredits.toLocaleString()}</p>
                                    <p className="text-emerald-100 text-xs mt-1">+{website.plan.creditBoostMonthly} monthly</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* AI Status */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">AI Status</p>
                                    <p className="text-2xl font-bold">{allowAIResponses && aiEnabledByPlan ? "Active" : "Inactive"}</p>
                                    <p className="text-blue-100 text-xs mt-1">
                                        {aiEnabledByPlan ? "Ready to respond" : "Plan upgrade required"}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Daily Limit */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden p-0">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Daily Limit</p>
                                    <p className="text-2xl font-bold">
                                        {dailyTokenLimit ? Number.parseInt(dailyTokenLimit).toLocaleString() : "Unlimited"}
                                    </p>
                                    <p className="text-purple-100 text-xs mt-1">Tokens per day</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content Area - Flex container for left and right columns */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - AI Configuration & Token Usage Chart */}
                    <div className="flex-1 space-y-8">
                        {/* AI Configuration Card */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-2xl" />
                            <CardHeader className="pb-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Brain className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-slate-900">AI Configuration</CardTitle>
                                            <p className="text-slate-600 text-sm">Configure AI behavior and response settings</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 relative z-10">
                                {/* Default AI Responses */}
                                <div className="p-6 bg-purple-50 rounded-3xl border border-purple-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <Brain className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <Label htmlFor="allowAIResponses" className="text-slate-900 font-semibold text-lg">
                                                    Default AI Responses
                                                </Label>
                                            </div>
                                            <p className="text-slate-600 mb-4">
                                                Enable AI responses by default for new conversations. Individual chats can override this
                                                setting.
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                                                <div className="flex items-center space-x-1">
                                                    <Activity className="w-3 h-3" />
                                                    <span>Instant responses</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>24/7 availability</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-6">
                                            <Switch
                                                id="allowAIResponses"
                                                checked={allowAIResponses}
                                                onCheckedChange={setAllowAIResponses}
                                                disabled={!aiEnabledByPlan}
                                                className="data-[state=checked]:bg-purple-600 scale-125"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Daily Token Limit */}
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <Target className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <Label htmlFor="dailyTokenLimit" className="text-slate-900 font-semibold text-lg">
                                            Daily Token Limit
                                        </Label>
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            id="dailyTokenLimit"
                                            type="number"
                                            value={dailyTokenLimit}
                                            onChange={(e) => setDailyTokenLimit(e.target.value)}
                                            placeholder="e.g., 1000 (leave empty for no limit)"
                                            min="0"
                                            className="h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl font-medium"
                                            disabled={!aiEnabledByPlan}
                                        />
                                        <p className="text-slate-600 text-sm">
                                            Set a daily limit for AI token usage. When reached, AI responses will be disabled for the day.
                                            Leave empty for no limit.
                                        </p>
                                        {dailyTokenLimit && (
                                            <div className="flex items-center space-x-2 text-purple-700 bg-purple-100 px-4 py-3 rounded-2xl">
                                                <Target className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    Daily limit: {Number.parseInt(dailyTokenLimit).toLocaleString()} tokens
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Alerts */}
                                {!aiEnabledByPlan && (
                                    <Alert className="border-amber-200 bg-amber-50 rounded-2xl">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        <AlertDescription className="text-amber-800">
                                            AI features are not available on your current plan. Upgrade to access AI responses and token
                                            management.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {currentCredits < 50 && aiEnabledByPlan && (
                                    <Alert className="border-red-200 bg-red-50 rounded-2xl">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            Low AI credits remaining: {currentCredits}. Consider purchasing more credits to continue using AI
                                            features.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI Content Management Card (Consolidated AI Summary and Scrape Paths) */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-2xl" />
                            <CardHeader className="pb-6 relative z-10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900">AI Content Management</CardTitle>
                                        <p className="text-slate-600 text-sm">Configure AI's understanding and data sources.</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 relative z-10">
                                {/* AI Summary Section */}
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-2"> {/* Reduced mb to bring note closer */}
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <Label htmlFor="aiSummary" className="text-slate-900 font-semibold text-lg">
                                                AI Summary
                                            </Label>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-7 h-7 rounded-full text-slate-500 hover:bg-slate-100"
                                                onClick={() => setShowMarkdownHelpModal(true)}
                                            >
                                                <Info className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {!isEditingAiSummary && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditingAiSummary(true)}
                                                disabled={!aiEnabledByPlan}
                                                className="h-9 px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-300"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                    {/* Markdown Conversion Note - Moved here */}
                                    <p className="text-slate-600 text-sm italic mb-4">
                                        This summary is generated by AI to help it understand your website's context. When editing, your input will be converted to Markdown upon saving.
                                    </p>
                                    <div className="space-y-4">
                                        {isEditingAiSummary ? (
                                            <>
                                                <Textarea
                                                    id="aiSummary"
                                                    value={aiSummary}
                                                    onChange={(e) => setAiSummary(e.target.value)}
                                                    placeholder="Edit your AI summary here using Markdown..."
                                                    className="w-full bg-slate-50/80 border border-slate-200/60 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl font-medium p-3 min-h-[200px]"
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsEditingAiSummary(false);
                                                            setAiSummary(website.aiSummary || ""); // Revert to original on cancel
                                                        }}
                                                        className="px-6 py-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSave}
                                                        disabled={loading}
                                                        className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                                                    >
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                                        Save Summary
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    id="aiSummary"
                                                    className="markdown-content bg-slate-50/80 border border-slate-200/60 text-slate-900 rounded-2xl font-medium p-3 min-h-[100px] max-h-[300px] overflow-y-auto"
                                                    dangerouslySetInnerHTML={renderMarkdown(truncatedAiSummary)}
                                                />
                                                {aiSummary.length > 300 && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowFullSummaryModal(true)}
                                                        className="w-full h-10 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                                                        disabled={!aiEnabledByPlan}
                                                    >
                                                        See Full Summary
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Website Scrape Paths Section */}
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <ExternalLink className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <Label htmlFor="newScrapePath" className="text-slate-900 font-semibold text-lg">
                                            Website Scrape Paths
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Input
                                            type="text"
                                            value={newScrapePath}
                                            onChange={(e) => setNewScrapePath(e.target.value)}
                                            placeholder={`e.g., /about-us or contact`}
                                            className="flex-1 h-12 bg-slate-50/80 border-slate-200/60 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl font-medium"
                                            disabled={!aiEnabledByPlan}
                                        />
                                        <Button
                                            onClick={handleAddPath}
                                            disabled={!aiEnabledByPlan || newScrapePath.trim() === ""}
                                            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all duration-300"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Add Path
                                        </Button>
                                    </div>
                                    {scrapePaths.length === 0 ? (
                                        <p className="text-slate-500 text-sm italic">No scrape paths added yet.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {scrapePaths.map((path, index) => (
                                                <li key={index} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 flex-1 min-w-0">
                                                        <span className="font-medium text-slate-800 truncate" title={path}>
                                                            {path}
                                                        </span>
                                                        <div className="flex items-center space-x-2 text-sm mt-1 sm:mt-0">
                                                            {getStatusIcon(pathStatuses[path] || 'Not Scraped')}
                                                            <span className={`font-medium ${getStatusTextClass(pathStatuses[path] || 'Not Scraped')}`}>
                                                                {pathStatuses[path] || 'Not Scraped'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleScrapePath(path)}
                                                            disabled={!aiEnabledByPlan || isScraping}
                                                            className="h-9 px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-300"
                                                        >
                                                            <RefreshCw className="w-4 h-4 mr-2" />
                                                            Scrape
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemovePath(path)}
                                                            disabled={!aiEnabledByPlan}
                                                            className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {!aiEnabledByPlan && (
                                        <Alert className="border-amber-200 bg-amber-50 rounded-2xl mt-4">
                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-amber-800">
                                                Scraping features require AI to be enabled on your plan.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Token Usage Analytics */}
                        {aiEnabledByPlan && <TokenUsageChart websiteId={website._id} />}
                    </div>
                    {/* Right Column - Quick Actions (Sticky) */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="sticky top-4 z-10">
                            {" "}
                            {/* Sticky applied here */}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-violet-500/10 rounded-full blur-xl" />
                                <CardHeader className="pb-4 relative z-10">
                                    <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <Button
                                        onClick={handleSave}
                                        disabled={loading || !aiEnabledByPlan}
                                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save AI Settings
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={resetToDefaults}
                                        className="w-full h-12 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reset to Defaults
                                    </Button>
                                    {aiEnabledByPlan && (
                                        <Link href={`/token-purchase?websiteId=${website._id.toString()}`}>
                                            <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl font-semibold">
                                                <Zap className="w-4 h-4 mr-2" />
                                                Buy More Credits
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {showScrapeModal && selectedPathToScrape && (
                <Modal onClose={() => setShowScrapeModal(false)}>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Scrape Again?</h3>
                    <p className="text-slate-700 mb-6">
                        The path <span className="font-semibold">{selectedPathToScrape}</span> has already been scraped. Do you want to scrape it again? This will refresh its content.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowScrapeModal(false)}
                            className="px-6 py-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => confirmScrape(selectedPathToScrape)}
                            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Yes, Scrape Again
                        </Button>
                    </div>
                </Modal>
            )}

            {showFullSummaryModal && (
                <Modal onClose={() => setShowFullSummaryModal(false)} fullWidthHeight={true}> {/* Pass fullWidthHeight prop */}
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Full AI Summary</h3>
                    {/* Replaced Textarea with a div for Markdown rendering */}
                    <div
                        className="markdown-content bg-slate-50/80 border border-slate-200/60 text-slate-900 rounded-2xl p-4 mb-6 overflow-y-auto max-h-[60vh] text-sm" // Added p-4 for padding and overflow/max-height for scrolling
                        dangerouslySetInnerHTML={renderMarkdown(aiSummary)}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={() => setShowFullSummaryModal(false)}
                            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Close
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Markdown Help Modal */}
            {showMarkdownHelpModal && (
                <Modal onClose={() => setShowMarkdownHelpModal(false)} fullWidthHeight={true}>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">What is Markdown?</h3>
                    <div className="markdown-content prose dark:prose-invert max-w-none">
                        <p className="text-slate-700 mb-4">
                            <strong>Markdown</strong> is a lightweight markup language that allows you to format plain text. It's designed to be easy to read and write, and it can be converted into HTML (what web pages are made of) for display.
                        </p>
                        <p className="text-slate-700 mb-4">
                            Large Language Models (LLMs) like the AI powering your chatbot often use Markdown because it provides a simple yet effective way to structure their output, making it clear and readable for both humans and other AI systems.
                        </p>

                        <h4 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Basic Markdown Rules:</h4>
                        <ul className="list-disc list-inside text-slate-700 mb-4">
                            <li>
                                <strong>Headings:</strong> Use `#` for H1, `##` for H2, `###` for H3, etc.
                                <pre className="bg-slate-100 p-2 rounded text-sm mt-1"><code># Main Heading</code><br/><code>## Subheading</code></pre>
                            </li>
                            <li>
                                <strong>Bold Text:</strong> Wrap text with double asterisks (`**`).
                                <pre className="bg-slate-100 p-2 rounded text-sm mt-1"><code>**This is bold**</code></pre>
                            </li>
                            <li>
                                <strong>Italic Text:</strong> Wrap text with single asterisks (`*`) or underscores (`_`).
                                <pre className="bg-slate-100 p-2 rounded text-sm mt-1"><code>*This is italic*</code></pre>
                            </li>
                            <li>
                                <strong>Lists:</strong> Use `*`, `-`, or `+` for unordered lists, and numbers for ordered lists.
                                <pre className="bg-slate-100 p-2 rounded text-sm mt-1"><code>- Item 1</code><br/><code>- Item 2</code><br/><code>1. First item</code><br/><code>2. Second item</code></pre>
                            </li>
                            <li>
                                <strong>Code Blocks:</strong> Use backticks (`` ` ``) for inline code or triple backticks (```) for multi-line code blocks.
                                <pre className="bg-slate-100 p-2 rounded text-sm mt-1"><code>`inline code`</code><br/><code>```js</code><br/><code>// multi-line code block</code><br/><code>console.log("Hello");</code><br/><code>```</code></pre>
                            </li>
                            <li>
                                <strong>Paragraphs:</strong> Just use normal text. Newlines usually create new paragraphs.
                            </li>
                        </ul>
                        <p className="text-slate-700 italic mt-6">
                            When you save your custom summary, this Markdown formatting will be processed and rendered by the system.
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    )
}