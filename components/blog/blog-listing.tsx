"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, MessageSquare, Zap, Target, TrendingUp, Brain, Users } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: "workflow-automation-v12",
    title: "Introducing Workflow Automation: The Future of Intelligent Customer Service",
    excerpt:
      "Transform your chatbot from a simple Q&A tool into a powerful conversion machine that guides customers through personalized journeys.",
    image: "/assets/workflow.webp",
    category: "Product Update",
    date: "December 29, 2024",
    readTime: "5 min read",
    author: "Product Team",
    featured: true,
    tags: ["Automation", "AI", "Customer Service"],
  },
  {
    id: "telegram-notifications",
    title: "Never Miss a Customer Message: Telegram Bot Notifications",
    excerpt:
      "Get instant Telegram notifications whenever customers send messages to your chatbot. Stay connected and respond faster than ever.",
    image: "/placeholder.svg?height=300&width=600",
    category: "Integration",
    date: "December 20, 2024",
    readTime: "6 min read",
    author: "Sarah Johnson",
    featured: false,
    tags: ["Telegram", "Notifications", "Real-time"],
  },
  {
    id: "ai-agent-credits",
    title: "Smart AI Agent: Credit-Based Intelligent Responses",
    excerpt:
      "Deploy an AI agent that pulls information from your website and provides intelligent responses using a credit-based system for cost control.",
    image: "/placeholder.svg?height=300&width=600",
    category: "AI Features",
    date: "December 10, 2024",
    readTime: "8 min read",
    author: "Mike Chen",
    featured: false,
    tags: ["AI Agent", "Credits", "Automation"],
  },
  {
    id: "staff-management-system",
    title: "Staff Management: Register Team Members and Control Chat Access",
    excerpt:
      "Learn how to register staff members in website settings and give them controlled access to customer chats through the dedicated staff login portal.",
    image: "/placeholder.svg?height=300&width=600",
    category: "Staff Management",
    date: "November 25, 2024",
    readTime: "7 min read",
    author: "Lisa Park",
    featured: false,
    tags: ["Staff", "Management", "Access Control"],
  },
  {
    id: "customer-support-automation",
    title: "How to Automate 80% of Your Customer Support Without Losing the Human Touch",
    excerpt:
      "Discover the perfect balance between automation and human interaction that keeps customers happy while reducing costs.",
    image: "/placeholder.svg?height=300&width=600",
    category: "Strategy",
    date: "November 15, 2024",
    readTime: "7 min read",
    author: "David Wilson",
    featured: false,
    tags: ["Automation", "Support", "Strategy"],
  },
  {
    id: "chatbot-integration-guide",
    title: "Seamless Chatbot Integration: A Step-by-Step Technical Guide",
    excerpt: "Technical walkthrough for developers on integrating chatbots with existing systems, APIs, and workflows.",
    image: "/placeholder.svg?height=300&width=600",
    category: "Technical",
    date: "November 5, 2024",
    readTime: "10 min read",
    author: "Alex Rodriguez",
    featured: false,
    tags: ["Integration", "API", "Development"],
  },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Product Update":
      return <Zap className="w-4 h-4" />
    case "Integration":
      return <MessageSquare className="w-4 h-4" />
    case "AI Features":
      return <Brain className="w-4 h-4" />
    case "Staff Management":
      return <Users className="w-4 h-4" />
    case "Best Practices":
      return <Target className="w-4 h-4" />
    case "Guide":
      return <MessageSquare className="w-4 h-4" />
    case "Analytics":
      return <TrendingUp className="w-4 h-4" />
    default:
      return <MessageSquare className="w-4 h-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Product Update":
      return "from-emerald-500 to-emerald-600"
    case "Integration":
      return "from-blue-500 to-blue-600" // Telegram blue
    case "AI Features":
      return "from-purple-500 to-purple-600" // Purple for AI agent
    case "Staff Management":
      return "from-slate-500 to-slate-600"
    case "Best Practices":
      return "from-blue-500 to-blue-600"
    case "Guide":
      return "from-purple-500 to-purple-600"
    case "Analytics":
      return "from-orange-500 to-orange-600"
    case "Strategy":
      return "from-pink-500 to-pink-600"
    case "Technical":
      return "from-indigo-500 to-indigo-600"
    default:
      return "from-slate-500 to-slate-600"
  }
}

export function BlogListing() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Insights, updates, and best practices for building better customer experiences with AI
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Badge
                className={`bg-gradient-to-r ${getCategoryColor(featuredPost.category)} text-white border-0 rounded-full px-4 py-2`}
              >
                {getCategoryIcon(featuredPost.category)}
                <span className="ml-2">Featured</span>
              </Badge>
            </div>

            <Link href={`/blog/${featuredPost.id}`} className="group block">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <Badge
                      className={`bg-gradient-to-r ${getCategoryColor(featuredPost.category)} text-white border-0 rounded-full px-3 py-1 w-fit mb-4`}
                    >
                      {getCategoryIcon(featuredPost.category)}
                      <span className="ml-2">{featuredPost.category}</span>
                    </Badge>

                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        className="text-emerald-600 hover:text-emerald-700 group-hover:translate-x-1 transition-transform"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Latest Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative h-48">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`bg-gradient-to-r ${getCategoryColor(post.category)} text-white border-0 rounded-full px-3 py-1`}
                      >
                        {getCategoryIcon(post.category)}
                        <span className="ml-2">{post.category}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 group-hover:translate-x-1 transition-transform"
                      >
                        Read
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 bg-transparent"
          >
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  )
}
