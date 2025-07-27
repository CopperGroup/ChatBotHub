// components/GroupWheel.tsx
"use client"

import { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react" // Import Suspense and lazy
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play, PlayCircle, X } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"

// ===============================================
// Internal Type Definitions (Not Exported)
// ===============================================
interface IUserFrontend {
  _id: string
  clerkId: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

interface IStoryFrontend {
  _id: string
  group: string | IGroupFrontend
  createdBy: string | IUserFrontend
  title: string
  description?: string
  mediaUrl?: string
  htmlContent?: string
  createdAt: string
  updatedAt: string
}

interface IBlogFrontend {
  _id: string
  group: string | IGroupFrontend
  createdBy: string | IUserFrontend
  title: string
  content: string
  thumbNailText: string
  thumbNailImage?: string
  createdAt: string
  updatedAt: string
}

interface IGroupFrontend {
  _id: string
  name: string
  description?: string
  avatarUrl?: string
  createdBy: string | IUserFrontend
  members: string[] | IUserFrontend[]
  stories: string[] | IStoryFrontend[]
  blogs: string[] | IBlogFrontend[]
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  status: "success" | "error" | "fail"
  message?: string
  data?: T
}

// ===============================================
// Internal Helper Components (Not Exported)
// ===============================================
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
  </div>
)

interface ErrorMessageProps {
  message: string
  className?: string
}

const ErrorMessage = ({ message, className }: ErrorMessageProps) => (
  <div className={`p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl ${className}`}>
    <p className="font-semibold">Error!</p>
    <p className="text-sm">{message}</p>
  </div>
)

interface HtmlContentDisplayProps {
  htmlContent: string
  onContentClick: () => void
}

const HtmlContentDisplay = ({ htmlContent, onContentClick }: HtmlContentDisplayProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  const adjustZoom = useCallback(() => {
    if (contentRef.current) {
      const tempDiv = document.createElement("div")
      tempDiv.style.visibility = "hidden"
      tempDiv.style.position = "absolute"
      tempDiv.style.left = "-9999px"
      tempDiv.style.top = "-9999px"
      tempDiv.style.width = "auto"
      tempDiv.style.height = "auto"
      tempDiv.style.whiteSpace = "nowrap"
      tempDiv.innerHTML = htmlContent
      document.body.appendChild(tempDiv)

      const naturalWidth = tempDiv.offsetWidth
      const naturalHeight = tempDiv.offsetHeight
      document.body.removeChild(tempDiv)

      if (naturalWidth === 0 || naturalHeight === 0) {
        setZoomLevel(1.1)
        return
      }

      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const targetWidth = screenWidth * 0.75
      const targetHeight = screenHeight * 0.75

      const widthRatio = targetWidth / naturalWidth
      const heightRatio = targetHeight / naturalHeight

      const calculatedZoom = Math.min(widthRatio, heightRatio)

      setZoomLevel(calculatedZoom > 0 ? Math.max(calculatedZoom, 1.1) : 1.1)
    }
  }, [htmlContent])

  useEffect(() => {
    if (htmlContent) {
      adjustZoom()
      window.addEventListener("resize", adjustZoom)
    }
    return () => {
      window.removeEventListener("resize", adjustZoom)
    }
  }, [htmlContent, adjustZoom])

  return (
    <div
      ref={contentRef}
      className="relative flex items-center justify-center w-full h-full cursor-pointer"
      style={{
        zoom: zoomLevel,
      }}
      onClick={onContentClick}
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ pointerEvents: "none" }} />
    </div>
  )
}

// ===============================================
// New Component for Stories Grid
// ===============================================
interface StoriesGridProps {
    currentGroups: IGroupFrontend[];
    openStoryModal: (groupId: string) => void;
    GROUPS_PER_PAGE: number;
}

const StoriesGrid = ({ currentGroups, openStoryModal, GROUPS_PER_PAGE }: StoriesGridProps) => (
    <div className="space-y-4">
        {/* Stories Grid - Changed to 7 columns */}
        <div className="grid grid-cols-7 gap-2">
            {currentGroups.map((group, index) => (
                <motion.div
                    key={group._id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => openStoryModal(group._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                    <div className="relative w-12 h-12 mb-2">
                        {/* Gradient border ring */}
                        <div className="w-full h-full rounded-full ring-2 ring-emerald-400 ring-offset-2">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                {group.avatarUrl ? (
                                    <Image
                                        src={group.avatarUrl || "/placeholder.svg"}
                                        alt={group.name}
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                        <span className="text-emerald-700 font-bold text-xs">{group.name[0]?.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Story count indicator */}
                        {Array.isArray(group.stories) && group.stories.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                                {group.stories.length}
                            </div>
                        )}
                    </div>

                    {/* Group name */}
                    <span className="text-xs font-medium text-slate-700 text-center line-clamp-2 max-w-full group-hover:text-slate-900 transition-colors duration-200">
                        {group.name}
                    </span>
                </motion.div>
            ))}

            {/* Fill empty slots if less than 7 groups on current page */}
            {currentGroups.length < GROUPS_PER_PAGE &&
                Array.from({ length: GROUPS_PER_PAGE - currentGroups.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex flex-col items-center opacity-30">
                    </div>
                ))}
        </div>
    </div>
);


// ===============================================
// Main GroupWheel Component
// ===============================================
const BASE_API_URL = process.env.NEXT_PUBLIC_CBH_PRODUCT_API_URL || "http://localhost:5000/api/v1"

const STORY_VIEW_DURATION = 15000
const GROUPS_PER_PAGE = 7

export default function GroupWheel() {
  const [groups, setGroups] = useState<IGroupFrontend[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [errorGroups, setErrorGroups] = useState<string | null>(null)
  const [currentGroupStories, setCurrentGroupStories] = useState<IStoryFrontend[]>([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)
  const [loadingStories, setLoadingStories] = useState(false)
  const [errorStories, setErrorStories] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(0)

  // Calculate pagination
  const totalPages = Math.ceil(groups.length / GROUPS_PER_PAGE)
  const currentGroups = groups.slice(currentPage * GROUPS_PER_PAGE, (currentPage + 1) * GROUPS_PER_PAGE)

  // --- Core Modal Control Callbacks ---
  const closeStoryModal = useCallback(() => {
    setIsStoryModalOpen(false)
    setCurrentGroupStories([])
    setCurrentStoryIndex(0)
    setIsPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    setProgress(0)
  }, [])

  const nextStory = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    setCurrentStoryIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % currentGroupStories.length
      if (newIndex === 0 && prevIndex === currentGroupStories.length - 1) {
        closeStoryModal()
        return 0
      }
      return newIndex
    })

    setProgress(0)
  }, [currentGroupStories.length, closeStoryModal])

  const prevStory = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    setCurrentStoryIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + currentGroupStories.length) % currentGroupStories.length
      return newIndex
    })

    setProgress(0)
  }, [currentGroupStories.length])

  const pauseStoryTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    setIsPlaying(false)
  }, [])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseStoryTimer()
    } else {
      setIsPlaying(true)
    }
  }, [isPlaying, pauseStoryTimer])

  // --- Timer Management Callbacks ---
  const startStoryTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    if (!isPlaying || currentGroupStories.length === 0) {
      return
    }

    startTimeRef.current = Date.now()
    setProgress(0)

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = (elapsed / STORY_VIEW_DURATION) * 100
      setProgress(Math.min(newProgress, 100))

      if (elapsed >= STORY_VIEW_DURATION) {
        clearInterval(progressIntervalRef.current!)
        nextStory()
      }
    }, 100)

    timerRef.current = setTimeout(() => {
      nextStory()
    }, STORY_VIEW_DURATION + 50)
  }, [isPlaying, currentGroupStories, nextStory])

  const resumeStoryTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    if (currentGroupStories.length === 0) {
      return
    }

    const remainingTime = STORY_VIEW_DURATION * (1 - progress / 100)

    if (remainingTime > 0) {
      startTimeRef.current = Date.now() - (STORY_VIEW_DURATION - remainingTime)

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const newProgress = (elapsed / STORY_VIEW_DURATION) * 100
        setProgress(Math.min(newProgress, 100))

        if (elapsed >= STORY_VIEW_DURATION) {
          clearInterval(progressIntervalRef.current!)
          nextStory()
        }
      }, 100)

      timerRef.current = setTimeout(() => {
        nextStory()
      }, remainingTime + 50)
    } else {
      nextStory()
    }
  }, [progress, nextStory, currentGroupStories.length])

  // --- Fetch Groups on Mount ---
  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true)
      setErrorGroups(null)
      try {
        const response = await fetch(`${BASE_API_URL}/public/groups`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const data: ApiResponse<{ groups: IGroupFrontend[] }> = await response.json()
        if (data.status === "success" && data.data) {
          const sortedGroups = data.data.groups.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          setGroups(sortedGroups)
        } else {
          setErrorGroups(data.message || "Failed to fetch public groups.")
        }
      } catch (err: any) {
        console.error("Error fetching public groups:", err)
        setErrorGroups(err.message || "Failed to load groups.")
      } finally {
        setLoadingGroups(false)
      }
    }

    fetchGroups()
  }, [])

  // --- Open Story Modal Logic ---
  const openStoryModal = async (groupId: string) => {
    setLoadingStories(true)
    setErrorStories(null)
    try {
      const response = await fetch(`${BASE_API_URL}/public/groups/${groupId}/stories`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<{ stories: IStoryFrontend[] }> = await response.json()
      if (data.status === "success" && data.data?.stories) {
        if (data.data.stories.length > 0) {
          setCurrentGroupStories(data.data.stories)
          setCurrentStoryIndex(0)
          setIsStoryModalOpen(true)
          setIsPlaying(true)
        } else {
          setErrorStories("This group has no stories yet.")
        }
      } else {
        setErrorStories(data.message || "Failed to fetch stories for this group.")
      }
    } catch (err: any) {
      console.error("Error fetching stories:", err)
      setErrorStories(err.message || "Failed to load stories.")
    } finally {
      setLoadingStories(false)
    }
  }

  // --- Effect to manage story progression timer ---
  useEffect(() => {
    if (isStoryModalOpen && currentGroupStories.length > 0 && isPlaying) {
      startStoryTimer()
    } else {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [currentStoryIndex, isStoryModalOpen, currentGroupStories, isPlaying, startStoryTimer])

  // Reset progress when changing stories
  useEffect(() => {
    setProgress(0)
  }, [currentStoryIndex])

  if (loadingGroups) {
    return (
      <div className="relative z-10">
        <CardHeader className="px-6 pb-4">
          <CardTitle className="text-slate-900 flex items-center space-x-3 text-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-5 h-5 rounded-full bg-white/30"></div>
            </div>
            <span>Stories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 h-32">
          <LoadingSpinner />
        </CardContent>
      </div>
    )
  }

  if (errorGroups) {
    return (
      <div className="relative z-10">
        <CardHeader className="px-6 pb-4">
          <CardTitle className="text-slate-900 flex items-center space-x-3 text-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-5 h-5 rounded-full bg-white/30"></div>
            </div>
            <span>Stories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 h-32">
          <ErrorMessage message={errorGroups} />
        </CardContent>
      </div>
    )
  }

  const currentStoryHtml = currentGroupStories[currentStoryIndex]?.htmlContent || ""

  return (
    <>
      <div className="relative z-10">
        <CardHeader className="px-6 pb-4">
          <CardTitle className="text-slate-900 flex items-center justify-between text-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <PlayCircle className="text-white"/>
              </div>
              <span>Stories</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 rounded-full bg-slate-300"></div>
              </div>
              <p className="text-sm text-slate-500 font-semibold">No stories available</p>
              <p className="text-xs text-slate-400 mt-1">Stories will appear here when groups create them</p>
            </div>
          ) : (
            <>
              <Suspense fallback={<LoadingSpinner />}> {/* Wrap with Suspense */}
                <StoriesGrid
                    currentGroups={currentGroups}
                    openStoryModal={openStoryModal}
                    GROUPS_PER_PAGE={GROUPS_PER_PAGE}
                />
              </Suspense>
              {/* Pagination Dots (kept outside Suspense as it depends on `groups` not `currentGroups` which is derived) */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 pt-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentPage ? "bg-emerald-500 scale-125" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>

      {/* Full Screen Story Modal - Minimal Design */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isStoryModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-slate-50"
                style={{ margin: 0, padding: 0 }}
              >
                {/* Top Bar - Only Progress and Close */}
                <div className="absolute top-0 left-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm z-50">
                  <div className="flex items-center justify-between px-6 py-3">
                    {/* Left side - Story counter */}
                    <div className="bg-slate-100 rounded-lg px-3 py-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        {currentStoryIndex + 1} / {currentGroupStories.length}
                      </span>
                    </div>

                    {/* Right side - Close button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeStoryModal()
                      }}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="px-6 pb-3">
                    <div className="flex space-x-1">
                      {currentGroupStories.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-100 ease-linear"
                            style={{
                              width:
                                index < currentStoryIndex
                                  ? "100%"
                                  : index === currentStoryIndex
                                    ? `${progress}%`
                                    : "0%",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Controls - All controls together */}
                <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm border-t border-slate-200/50 shadow-sm z-50">
                  <div className="flex items-center justify-center px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {/* Navigation arrows */}
                      {currentGroupStories.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              prevStory()
                            }}
                            className="h-10 w-10 p-0 bg-slate-100 hover:bg-slate-200 rounded-full"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                        </>
                      )}

                      {/* Play/Pause button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlayPause()
                        }}
                        className="h-12 w-12 p-0 bg-slate-100 hover:bg-slate-200 rounded-full"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>

                      {/* Navigation arrows */}
                      {currentGroupStories.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              nextStory()
                            }}
                            className="h-10 w-10 p-0 bg-slate-100 hover:bg-slate-200 rounded-full"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {loadingStories ? (
                  <div className="flex items-center justify-center h-full pt-16 pb-20">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <LoadingSpinner />
                    </div>
                  </div>
                ) : errorStories ? (
                  <div className="flex items-center justify-center h-full p-6 pt-16 pb-20">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
                      <ErrorMessage message={errorStories} />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Main Content Area */}
                    <div className="absolute inset-0 pt-16 pb-20 px-6">
                      <div className="w-full h-full overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center p-6">
                          {currentStoryHtml ? (
                            <HtmlContentDisplay htmlContent={currentStoryHtml} onContentClick={togglePlayPause} />
                          ) : (
                            <div className="text-center cursor-pointer" onClick={togglePlayPause}>
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                              </div>
                              <p className="text-lg font-semibold text-slate-900">No content available</p>
                              <p className="text-sm text-slate-500 mt-1">This story doesn't have any content yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}