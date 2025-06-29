"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Zap, X } from "lucide-react"
import { toast } from "sonner"
import { WorkflowBlock } from "@/components/workflow/workflow-block"
import { ConnectionLine } from "@/components/workflow/connection-line"
import { ContextMenu } from "@/components/workflow/context-menu"
import { useAuth } from "@/hooks/use-auth"
import { Loading } from "./WorkflowLoading"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { authFetch } from "@/lib/authFetch"

interface BlockData {
  id: string
  type: "start" | "option" | "condition" | "message" | "end" | "userResponse"
  name: string
  message: string
  description: string
  position: { x: number; y: number }
  options?: string[]
  conditionId?: string
  selectedCondition?: string
  connections: {
    input?: string
    output?: string[]
  }
}

interface Connection {
  id: string
  from: string
  to: string
  fromType: "output"
  toType: "input"
  fromOptionIndex?: number
}

// Global map for block refs - accessible by name
const blockRefs = new Map<string, React.RefObject<HTMLDivElement>>()

export default function WorkflowBuilder() {
  const componentId = useRef(Math.random().toString(36).substring(2, 9)).current

  const params = useParams()
  const websiteId = params.websiteId as string
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()

  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })
  const [selectedConnection, setSelectedConnection] = useState<{
    blockId: string
    type: "input" | "output"
    optionIndex?: number
  } | null>(null)

  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const currentDraggedBlockPosition = useRef<{ x: number; y: number } | null>(null)

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const currentZoomRef = useRef(100)
  const currentPanOffsetRef = useRef({ x: 0, y: 0 })

  const isPanningRef = useRef(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const panVelocityRef = useRef({ x: 0, y: 0 });
  const inertiaAnimationId = useRef<number | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [contextMenuFollower, setContextMenuFollower] = useState({ x: 0, y: 0, visible: false, fixed: false })
  const [isInitialized, setIsInitialized] = useState(false)
  const [website, setWebsite] = useState(null)

  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const isSelectingRef = useRef(false);
  const [selectedArea, setSelectedArea] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isDraggingSelection, setIsDraggingSelection] = useState(false)
  const selectionDragStart = useRef({ x: 0, y: 0 })
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([])

  const selectionBoxRef = useRef<HTMLDivElement>(null);


  const CANVAS_WIDTH = 20000
  const CANVAS_HEIGHT = 20000

  const registerBlockRef = useCallback(
    (id: string, ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        blockRefs.set(id, ref)
      } else {
        blockRefs.delete(id)
      }
    },
    [],
  )

  const applyCanvasTransform = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${currentPanOffsetRef.current.x}px, ${currentPanOffsetRef.current.y}px) scale(${currentZoomRef.current / 100})`
    }
  }, [])

  const constrainPanOffset = useCallback(
    (newPanOffset: { x: number; y: number }, currentZoom: number) => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return newPanOffset

      const scaledCanvasWidth = CANVAS_WIDTH * (currentZoom / 100)
      const scaledCanvasHeight = CANVAS_HEIGHT * (currentZoom / 100)

      const minPanX = containerRect.width - scaledCanvasWidth
      const maxPanX = 0
      const minPanY = containerRect.height - scaledCanvasHeight
      const maxPanY = 0

      return {
        x: Math.max(minPanX, Math.min(maxPanX, newPanOffset.x)),
        y: Math.max(minPanY, Math.min(maxPanY, newPanOffset.y)),
      }
    },
    [],
  )

  const handleZoomAtCursor = useCallback(
    (delta: number) => {
      const newZoom = Math.max(10, Math.min(200, currentZoomRef.current + delta))
      if (newZoom === currentZoomRef.current) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const canvasX = (mousePosition.x - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
      const canvasY = (mousePosition.y - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)

      const newPanX = mousePosition.x - canvasX * (newZoom / 100)
      const newPanY = mousePosition.y - canvasY * (newZoom / 100)

      const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, newZoom)

      currentZoomRef.current = newZoom
      currentPanOffsetRef.current = constrainedOffset
      applyCanvasTransform()

      setZoom(newZoom)
      setPanOffset(constrainedOffset)
    },
    [mousePosition, constrainPanOffset, applyCanvasTransform],
  )

  const updateBlock = useCallback(
    (id: string, updates: Partial<BlockData>) => {
      setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...updates } : block)))

      if (updates.options && Array.isArray(updates.options)) {
        setBlocks((prevBlocks) =>
          prevBlocks.map((block) => {
            if (block.type === "condition" && block.conditionId === id) {
              if (block.selectedCondition && !updates.options?.includes(block.selectedCondition)) {
                return { ...block, selectedCondition: undefined }
              }
            }
            return block
          }),
        )

        const blockToUpdate = blocks.find((b) => b.id === id)
        if (blockToUpdate && blockToUpdate.type === "option") {
          setConnections((prev) =>
            prev.filter((conn) => {
              if (conn.from === id && conn.fromOptionIndex !== undefined) {
                return updates.options!.length > conn.fromOptionIndex
              }
              return true
            }),
          )
        }
      }
    },
    [blocks],
  )

  const getBlockTypeColors = useCallback((type: string) => {
    switch (type) {
      case "start":
        return { primary: "#10b981", secondary: "#059669", light: "#d1fae5", ring: "#10b981" }
      case "option":
        return { primary: "#3b82f6", secondary: "#2563eb", light: "#dbeafe", ring: "#3b82f6" }
      case "condition":
        return { primary: "#8b5cf6", secondary: "#7c3aed", light: "#ede9fe", ring: "#8b5cf6" }
      case "message":
        return { primary: "#f97316", secondary: "#ea580c", light: "#fed7aa", ring: "#f97316" }
      case "userResponse":
        return { primary: "#22d3ee", secondary: "#06b6d4", light: "#e0f7fa", ring: "#22d3ee" }
      case "end":
        return { primary: "#ef4444", secondary: "#dc2626", light: "#fee2e2", ring: "#ef4444" }
      default:
        return { primary: "#6b7280", secondary: "#4b5563", light: "#f3f4f6", ring: "#6b7280" }
    }
  }, [])

  useEffect(() => {
    const fetchAndInitializeWorkflow = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${websiteId}`)
        if (!res.ok) throw new Error("Failed to fetch website")
        const data = await res.json()
        setWebsite(data)

        let initialBlocks: BlockData[] = [];
        let initialConnections: Connection[] = [];

        if (data.predefinedAnswers) {
          try {
            const workflowData = JSON.parse(data.predefinedAnswers)
            if (workflowData.blocks && Array.isArray(workflowData.blocks)) {
              initialBlocks = workflowData.blocks;
            }
            if (workflowData.connections && Array.isArray(workflowData.connections)) {
              initialConnections = workflowData.connections;
            }
          } catch (error) {
            // console.error("Failed to parse existing workflow:", error)
          }
        }

        if (initialBlocks.length === 0) {
          const startBlock: BlockData = {
            id: "start",
            type: "start",
            name: "Start",
            message: "Hi! What is your name?",
            description: "Collect user name.",
            position: { x: CANVAS_WIDTH / 2 - 160, y: CANVAS_HEIGHT / 2 - 100 },
            connections: { output: [] },
          }
          initialBlocks = [startBlock];
        }

        setBlocks(initialBlocks);
        setConnections(initialConnections);

      } catch (error) {
        // console.error("Error fetching or initializing workflow:", error)
        toast.error("Failed to load workflow data.")
      }
    }

    fetchAndInitializeWorkflow()
  }, [websiteId])

  useEffect(() => {
    if (blocks.length > 0 && !isInitialized && containerRef.current) {
      const startBlock = blocks.find((block) => block.type === "start")
      if (startBlock) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const centerX = containerRect.width / 2
        const centerY = containerRect.height / 2

        const targetPanX = centerX - (startBlock.position.x + 160) * (currentZoomRef.current / 100)
        const targetPanY = centerY - (startBlock.position.y + 100) * (currentZoomRef.current / 100)

        const constrainedOffset = constrainPanOffset({ x: targetPanX, y: targetPanY }, currentZoomRef.current)

        currentPanOffsetRef.current = constrainedOffset
        setPanOffset(constrainedOffset)

        applyCanvasTransform()

        setIsInitialized(true)
      }
    }
  }, [blocks, isInitialized, applyCanvasTransform, constrainPanOffset])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !isCtrlPressed) {
        setIsCtrlPressed(true)
      }

      if (e.shiftKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault()
          handleZoomAtCursor(10)
        } else if (e.key === "-" || e.key === "_") {
          e.preventDefault()
          handleZoomAtCursor(-10)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && isCtrlPressed) {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isCtrlPressed, handleZoomAtCursor])

  const isPointInSelection = useCallback(
    (x: number, y: number) => {
      if (!selectedArea) return false
      return (
        x >= selectedArea.x &&
        x <= selectedArea.x + selectedArea.width &&
        y >= selectedArea.y &&
        y <= selectedArea.y + selectedArea.height
      )
    },
    [selectedArea],
  )

  const calculateBlockOverlap = useCallback(
    (block: BlockData, selectionArea: { x: number; y: number; width: number; height: number }) => {
      const blockLeft = block.position.x
      const blockRight = block.position.x + 320
      const blockTop = block.position.y
      const blockBottom = block.position.y + 200

      const selectionLeft = selectionArea.x
      const selectionRight = selectionArea.x + selectionArea.width
      const selectionTop = selectionArea.y
      const selectionBottom = selectionArea.y + selectionArea.height

      const intersectionLeft = Math.max(blockLeft, selectionLeft)
      const intersectionRight = Math.min(blockRight, selectionRight)
      const intersectionTop = Math.max(blockTop, selectionTop)
      const intersectionBottom = Math.min(blockBottom, selectionBottom)

      if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) {
        return 0
      }

      const intersectionArea = (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop)
      const blockArea = 320 * 200
      const overlapPercentage = (intersectionArea / blockArea) * 100

      return overlapPercentage
    },
    [],
  )

  const animationFrameRef = useRef(0)
  const latestMouseEvent = useRef<MouseEvent | null>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      latestMouseEvent.current = e

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          if (latestMouseEvent.current) {
            const currentE = latestMouseEvent.current
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
              if (isSelectingRef.current || isDraggingSelection) {
                const newMousePos = {
                  x: currentE.clientX - rect.left,
                  y: currentE.clientY - rect.top,
                }
                setMousePosition(newMousePos)
              }

              if (draggedBlockId) {
                const canvasRect = canvasRef.current?.getBoundingClientRect()
                if (canvasRect) {
                  const x = (currentE.clientX - canvasRect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
                  const y = (currentE.clientY - canvasRect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)
                  const newX = x - dragOffset.x
                  const newY = y - dragOffset.y

                  const constrainedX = Math.max(0, Math.min(CANVAS_WIDTH - 320, newX))
                  const constrainedY = Math.max(0, Math.min(CANVAS_HEIGHT - 200, newY))

                  currentDraggedBlockPosition.current = { x: constrainedX, y: constrainedY };

                  const draggedBlockDOM = blockRefs.get(draggedBlockId)?.current;
                  if (draggedBlockDOM) {
                    draggedBlockDOM.style.left = `${constrainedX}px`;
                    draggedBlockDOM.style.top = `${constrainedY}px`;
                  }
                }
              } else if (isPanningRef.current) {
                const newPanX = currentE.clientX - panStartRef.current.x;
                const newPanY = currentE.clientY - panStartRef.current.y;
                const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, currentZoomRef.current);
                
                const dx = constrainedOffset.x - currentPanOffsetRef.current.x;
                const dy = constrainedOffset.y - currentPanOffsetRef.current.y;
                panVelocityRef.current = { x: dx, y: dy };

                currentPanOffsetRef.current = constrainedOffset;
                applyCanvasTransform();

              } else if (isSelectingRef.current && isCtrlPressed) {
                const canvasX = (currentE.clientX - rect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
                const canvasY = (currentE.clientY - rect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)

                if (selectionBoxRef.current && selectionStart) {
                  const currentSelectionEndX = canvasX;
                  const currentSelectionEndY = canvasY;

                  const minX = Math.min(selectionStart.x, currentSelectionEndX);
                  const maxX = Math.max(selectionStart.x, currentSelectionEndX);
                  const minY = Math.min(selectionStart.y, currentSelectionEndY);
                  const maxY = Math.max(selectionStart.y, currentSelectionEndY);

                  const width = maxX - minX;
                  const height = maxY - minY;

                  selectionBoxRef.current.style.left = `${minX}px`;
                  selectionBoxRef.current.style.top = `${minY}px`;
                  selectionBoxRef.current.style.width = `${width}px`;
                  selectionBoxRef.current.style.height = `${height}px`;
                  selectionBoxRef.current.style.display = 'block';
                }
              } else if (isDraggingSelection && selectedArea) {
                const deltaX = (currentE.clientX - selectionDragStart.current.x) / (currentZoomRef.current / 100)
                const deltaY = (currentE.clientY - selectionDragStart.current.y) / (currentZoomRef.current / 100)

                setSelectedArea((prev) =>
                  prev
                    ? {
                        ...prev,
                        x: prev.x + deltaX,
                        y: prev.y + deltaY,
                      }
                    : null,
                )

                setBlocks((prev) =>
                  prev.map((block) =>
                    selectedBlocks.includes(block.id)
                      ? {
                          ...block,
                          position: {
                            x: Math.max(0, Math.min(CANVAS_WIDTH - 320, block.position.x + deltaX)),
                            y: Math.max(0, Math.min(CANVAS_HEIGHT - 200, block.position.y + deltaY)),
                          },
                        }
                      : block,
                  ),
                )
                selectionDragStart.current = { x: currentE.clientX, y: currentE.clientY }
              }

              if (contextMenuFollower.visible && !contextMenuFollower.fixed) {
                setContextMenuFollower((prev) => ({
                  ...prev,
                  x: currentE.clientX,
                  y: currentE.clientY,
                }))
              }
            }
          }
          latestMouseEvent.current = null
          animationFrameRef.current = 0
        })
      }
    },
    [
      draggedBlockId,
      dragOffset,
      constrainPanOffset,
      applyCanvasTransform,
      isDraggingSelection,
      selectedArea,
      selectedBlocks,
      selectionStart,
      isCtrlPressed,
    ],
  )

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()

    setContextMenuFollower({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      fixed: false,
    })

    setContextMenu({
      x: 0,
      y: 0,
      visible: true,
    })

    setTimeout(() => {
      setContextMenuFollower((prev) => ({
        ...prev,
        fixed: true,
      }))
    }, 0)
  }, [])

  const hideContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
    setContextMenuFollower({ x: 0, y: 0, visible: false, fixed: false })
    setSelectedConnection(null)
  }, [])

  const generateId = (type: string) => {
    const existingIds = blocks
      .filter((block) => block.type === type)
      .map((block) => {
        const match = block.id.match(/\d+$/)
        return match ? Number.parseInt(match[0]) : 0
      })
    const nextId = Math.max(0, ...existingIds) + 1
    return type === "start" ? type : `${type}${nextId}`
  }

  const addBlock = useCallback(
    (type: "start" | "option" | "condition" | "message" | "end" | "userResponse") => {
      if (type === "start" && blocks.some((block) => block.type === "start")) {
        toast.error("Only one start block is allowed")
        return
      }

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) {
        return;
      }

      const canvasX = (contextMenuFollower.x - rect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
      const canvasY = (contextMenuFollower.y - rect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)

      const id = generateId(type)
      const newBlock: BlockData = {
        id,
        type,
        name: type === "start" ? "Start" : type === "end" ? "End" : type === "userResponse" ? "User Response" : id,
        message: type === "start" ? "Hi! What is your name?" : type === "end" ? "Thank you, please wait for the agent to contact you" : "",
        description:
          type === "start"
            ? "Collect user name."
            : type === "end"
            ? "End qualification and notify staff"
            : type === "option"
            ? "option"
            : type === "message"
            ? "send message"
            : type === "userResponse"
            ? "Receive user response"
            : "condition",
        position: {
          x: Math.max(0, Math.min(CANVAS_WIDTH - 320, canvasX)),
          y: Math.max(0, Math.min(CANVAS_HEIGHT - 200, canvasY)),
        },
        options: type === "option" ? [] : undefined,
        connections: {
          input: type === "start" ? undefined : undefined,
          output: type === "end" ? undefined : [],
        },
      }

      setBlocks((prev) => [...prev, newBlock])
      hideContextMenu()
    },
    [blocks, contextMenuFollower, hideContextMenu],
  )

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
    setConnections((prev) => prev.filter((conn) => conn.from !== id && conn.to !== id))

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.type === "condition" && block.conditionId === id) {
          return { ...block, conditionId: undefined, selectedCondition: undefined }
        }
        return block
      }),
    )
  }, [])

  const handleConnectionClick = useCallback(
    (blockId: string, type: "input" | "output", optionIndex?: number) => {
      if (selectedConnection) {
        if (selectedConnection.blockId !== blockId && selectedConnection.type !== type) {
          const fromBlock = blocks.find((b) => b.id === selectedConnection.blockId)
          const toBlock = blocks.find((b) => b.id === blockId)

          if (fromBlock && toBlock) {
            let canConnect = true

            if (selectedConnection.type === "output" && type === "input") {
              if (toBlock.type === "start") {
                canConnect = false;
              }

              if (fromBlock.type === "option" && toBlock.type === "condition") {
                updateBlock(blockId, { conditionId: fromBlock.id })
              }

              if (fromBlock.type === "message" && toBlock.type === "message") {
                canConnect = true
              }

              canConnect = true
              if (toBlock.type === "start") canConnect = false
            }

            if (canConnect) {
              const connectionId = `${selectedConnection.blockId}-${blockId}-${optionIndex !== undefined ? optionIndex : ""}-${Date.now()}`
              const newConnection: Connection = {
                id: connectionId,
                from: selectedConnection.type === "output" ? selectedConnection.blockId : blockId,
                to: selectedConnection.type === "output" ? blockId : selectedConnection.blockId,
                fromType: "output",
                toType: "input",
                fromOptionIndex: selectedConnection.type === "output" ? selectedConnection.optionIndex : optionIndex,
              }
              setConnections((prev) => [...prev, newConnection])
              toast.success("Connection created")
            } else {
              toast.error("Invalid connection")
            }
          } else {
            // console.error("Connection failed: Missing fromBlock or toBlock.");
          }
        } else {
          // console.log("Deselecting connection point.");
        }
        setSelectedConnection(null)
      } else {
        setSelectedConnection({ blockId, type, optionIndex })
      }
    },
    [selectedConnection, blocks, updateBlock],
  )

  const deleteConnection = useCallback(
    (connectionId: string) => {
      const connection = connections.find((c) => c.id === connectionId)
      if (connection) {
        const fromBlock = blocks.find((b) => b.id === connection.from)
        const toBlock = blocks.find((b) => b.id === connection.to)

        if (fromBlock?.type === "option" && toBlock?.type === "condition") {
          updateBlock(toBlock.id, { conditionId: undefined, selectedCondition: undefined })
        }
      }

      setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))
      toast.success("Connection deleted")
    },
    [connections, blocks, updateBlock],
  )

  const handleSelectionMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDraggingSelection(true)
    selectionDragStart.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, blockId?: string) => {
      if (blockId) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const block = blocks.find((b) => b.id === blockId)
          if (block) {
            setDraggedBlockId(blockId)
            currentDraggedBlockPosition.current = block.position

            const x = (e.clientX - rect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
            const y = (e.clientY - rect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)
            setDragOffset({
              x: x - block.position.x,
              y: y - block.position.y,
            })
          } else {
            // console.error("handleMouseDown: Block not found for ID:", blockId);
          }
        } else {
          // console.error("handleMouseDown: Canvas ref is null.");
        }
      } else {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect && selectedArea) {
          const canvasX = (e.clientX - rect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
          const canvasY = (e.clientY - rect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)

          if (isPointInSelection(canvasX, canvasY)) {
            handleSelectionMouseDown(e)
            return
          } else {
            setSelectedArea(null)
            setSelectionStart(null)
            setSelectedBlocks([])
          }
        }

        if (isCtrlPressed && canvasRef.current) {
          const canvasRect = containerRef.current?.getBoundingClientRect()
          if (canvasRect) {
            const x = (e.clientX - canvasRect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
            const y = (e.clientY - canvasRect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)
            setSelectionStart({ x, y })
            isSelectingRef.current = true;

            if (selectionBoxRef.current) {
              selectionBoxRef.current.style.display = 'block';
              selectionBoxRef.current.style.left = `${x}px`;
              selectionBoxRef.current.style.top = `${y}px`;
              selectionBoxRef.current.style.width = '0px';
              selectionBoxRef.current.style.height = '0px';
            }
            if (containerRef.current) {
              containerRef.current.style.cursor = "crosshair";
            }
          } else {
            // console.error("handleMouseDown (Ctrl+Click): Container ref is null.");
          }
        } else {
          setSelectedConnection(null)
          isPanningRef.current = true;
          
          if (containerRef.current) {
            containerRef.current.style.cursor = "grabbing";
          }

          panStartRef.current = { x: e.clientX - currentPanOffsetRef.current.x, y: e.clientY - currentPanOffsetRef.current.y };
          
          if (inertiaAnimationId.current) {
            cancelAnimationFrame(inertiaAnimationId.current);
            inertiaAnimationId.current = null;
          }
          panVelocityRef.current = { x: 0, y: 0 };
        }
      }
    },
    [
      blocks,
      isCtrlPressed,
      selectedArea,
      isPointInSelection,
      handleSelectionMouseDown,
    ],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isPanningRef.current) {
        const friction = 0.93;
        const minVelocity = 0.2;

        const animateInertia = () => {
          if (!inertiaAnimationId.current) return;

          panVelocityRef.current.x *= friction;
          panVelocityRef.current.y *= friction;

          if (
            Math.abs(panVelocityRef.current.x) < minVelocity &&
            Math.abs(panVelocityRef.current.y) < minVelocity
          ) {
            cancelAnimationFrame(inertiaAnimationId.current);
            inertiaAnimationId.current = null;
            setPanOffset(currentPanOffsetRef.current);
            return;
          }

          const nextPanX = currentPanOffsetRef.current.x + panVelocityRef.current.x;
          const nextPanY = currentPanOffsetRef.current.y + panVelocityRef.current.y;

          const constrainedOffset = constrainPanOffset({ x: nextPanX, y: nextPanY }, currentZoomRef.current);

          if (constrainedOffset.x === currentPanOffsetRef.current.x) panVelocityRef.current.x = 0;
          if (constrainedOffset.y === currentPanOffsetRef.current.y) panVelocityRef.current.y = 0; // Fixed typo (was `constrainedOffset.y === constrainedOffset.y`)
          
          currentPanOffsetRef.current = constrainedOffset;
          applyCanvasTransform();

          inertiaAnimationId.current = requestAnimationFrame(animateInertia);
        };

        if (Math.abs(panVelocityRef.current.x) > minVelocity || Math.abs(panVelocityRef.current.y) > minVelocity) {
            inertiaAnimationId.current = requestAnimationFrame(animateInertia);
        } else {
            setPanOffset(currentPanOffsetRef.current);
        }

        if (containerRef.current) {
          containerRef.current.style.cursor = "grab";
        }
      }

      if (draggedBlockId && currentDraggedBlockPosition.current) {
        const finalPosition = currentDraggedBlockPosition.current;
        setBlocks((prev) =>
          prev.map((block) =>
            block.id === draggedBlockId
              ? {
                  ...block,
                  position: finalPosition,
                }
              : block,
          ),
        );
      } else if (draggedBlockId) {
        // console.error(`Dragged block ID exists (${draggedBlockId}) but currentDraggedBlockPosition.current is null on mouseUp.`);
      }
      setDraggedBlockId(null);
      currentDraggedBlockPosition.current = null;

      if (isCtrlPressed && canvasRef.current && isSelectingRef.current) {
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = 'none';
        }

        const rect = containerRef.current?.getBoundingClientRect()
        if (rect && selectionStart) {
          const finalSelectionEndX = (e.clientX - rect.left - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100);
          const finalSelectionEndY = (e.clientY - rect.top - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100);

          const minX = Math.min(selectionStart.x, finalSelectionEndX);
          const maxX = Math.max(selectionStart.x, finalSelectionEndX);
          const minY = Math.min(selectionStart.y, finalSelectionEndY);
          const maxY = Math.max(selectionStart.y, finalSelectionEndY);

          const width = maxX - minX
          const height = maxY - minY

          if (width > 10 && height > 10) {
            const newSelectedArea = { x: minX, y: minY, width, height }
            setSelectedArea(newSelectedArea)
            
            const overlappingBlocks = blocks.filter((block) => {
              const overlapPercentage = calculateBlockOverlap(block, newSelectedArea)
              return overlapPercentage >= 25
            })

            const overlappingBlockIds = overlappingBlocks.map((block) => block.id)
            setSelectedBlocks(overlappingBlockIds)
          } else {
              setSelectedArea(null);
              setSelectedBlocks([]);
          }
        } else {
            setSelectedArea(null);
            setSelectedBlocks([]);
        }
        if (containerRef.current) {
          containerRef.current.style.cursor = "grab";
        }
      }
      isSelectingRef.current = false;
      setSelectionStart(null);

      isPanningRef.current = false;
      setIsDraggingSelection(false);
    },
    [
      isCtrlPressed, selectionStart, calculateBlockOverlap,
      blocks, draggedBlockId, constrainPanOffset, applyCanvasTransform,
    ],
  )

  const handleZoom = useCallback(
    (delta: number) => {
      const newZoom = Math.max(10, Math.min(200, currentZoomRef.current + delta))
      if (newZoom === currentZoomRef.current) {
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) {
        return;
      }

      const canvasX = (mousePosition.x - currentPanOffsetRef.current.x) / (currentZoomRef.current / 100)
      const canvasY = (mousePosition.y - currentPanOffsetRef.current.y) / (currentZoomRef.current / 100)

      const newPanX = mousePosition.x - canvasX * (newZoom / 100)
      const newPanY = mousePosition.y - canvasY * (newZoom / 100)

      const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, newZoom)
      
      currentZoomRef.current = newZoom;
      currentPanOffsetRef.current = constrainedOffset;
      applyCanvasTransform();

      setZoom(newZoom);
      setPanOffset(constrainedOffset);
    },
    [mousePosition, constrainPanOffset, applyCanvasTransform],
  )

  const resetView = useCallback(() => {
    const newZoom = 100;
    const constrainedOffset = constrainPanOffset({ x: 0, y: 0 }, newZoom);

    currentZoomRef.current = newZoom;
    currentPanOffsetRef.current = constrainedOffset;
    applyCanvasTransform();

    setZoom(newZoom);
    setPanOffset(constrainedOffset);
  }, [constrainPanOffset, applyCanvasTransform])

  const fitToView = useCallback(() => {
    if (blocks.length === 0) {
      return;
    }

    const padding = 100
    const minX = Math.min(...blocks.map((b) => b.position.x)) - padding
    const maxX = Math.max(...blocks.map((b) => b.position.x + 320)) + padding
    const minY = Math.min(...blocks.map((b) => b.position.y)) - padding
    const maxY = Math.max(...blocks.map((b) => b.position.y + 200)) + padding

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY

    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) {
      return;
    }

    const containerWidth = containerRect.width - 100
    const containerHeight = containerRect.height - 100

    const scaleX = containerWidth / contentWidth
    const scaleY = containerHeight / contentHeight
    const newZoom = Math.min(scaleX, scaleY, 1) * 100

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const newPanX = containerRect.width / 2 - centerX * (newZoom / 100)
    const newPanY = containerRect.height / 2 - centerY * (newZoom / 100)

    const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, newZoom)
    
    currentZoomRef.current = newZoom;
    currentPanOffsetRef.current = constrainedOffset;
    applyCanvasTransform();

    setZoom(Math.max(10, Math.min(200, newZoom)))
    setPanOffset(constrainedOffset)

  }, [blocks, constrainPanOffset, applyCanvasTransform])

  const saveWorkflow = async () => {
    try {
      const workflowData = {
        blocks,
        connections,
        metadata: {
          websiteId,
          createdAt: new Date().toISOString(),
          version: "1.0",
        },
      }

      // console.log(workflowData) 
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${websiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predefinedAnswers: JSON.stringify(workflowData),
          userId: user._id,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update website settings.")
      }

      toast.success("Workflow saved successfully!")
    } catch (error) {
      // console.error("Save error:", error)
      toast.error("Failed to save workflow")
    }
  }

  const blockMap = React.useMemo(() => {
    return new Map(blocks.map(block => [block.id, block]));
  }, [blocks]);

  const getBlockConnections = useCallback(
    (blockId: string) => {
      const inputConnection = connections.find((conn) => conn.to === blockId)
      const outputConnections = connections.filter((conn) => conn.from === blockId)
      return {
        hasInput: !!inputConnection,
        hasOutput: outputConnections.length > 0,
        inputConnection,
        outputConnections,
      }
    },
    [connections],
  )

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenuFollower.visible) {
        const clickX = e.clientX
        const clickY = e.clientY
        const menuWidth = 280 * (currentZoomRef.current / 100)
        const menuHeight = 320 * (currentZoomRef.current / 100)
        const followerLeft = contextMenuFollower.x - menuWidth / 2
        const followerRight = contextMenuFollower.x + menuWidth / 2
        const followerTop = contextMenuFollower.y - 20
        const followerBottom = contextMenuFollower.y + menuHeight

        if (clickX < followerLeft || clickX > followerRight || clickY < followerTop || clickY > followerBottom) {
          hideContextMenu()
        }
      }
    }

    if (contextMenuFollower.visible) {
      document.addEventListener("click", handleGlobalClick)
      return () => {
        document.removeEventListener("click", handleGlobalClick);
      }
    }
  }, [contextMenuFollower.visible, contextMenuFollower.x, contextMenuFollower.y, hideContextMenu])

  useEffect(() => {
    return () => {
      if (inertiaAnimationId.current) {
        cancelAnimationFrame(inertiaAnimationId.current);
      }
    };
  }, []);

  useEffect(() => {
    currentZoomRef.current = zoom;
    currentPanOffsetRef.current = panOffset;
    applyCanvasTransform();
  }, [zoom, panOffset, applyCanvasTransform]);


  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 md:p-6">
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 select-none">
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl ring-1 ring-black/5 transition-all">
          <Link href={`/websites/${websiteId}`} className="text-red-500">
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="fixed top-6 right-6 z-50 flex items-center">
        <div className="flex items-center bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl ring-1 ring-black/5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1
            className="text-lg font-semibold pl-4 pr-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${website?.preferences.colors.gradient1}, ${website?.preferences.colors.gradient2})`,
            }}
          >
            {website?.name}
          </h1>
          <div className="flex items-center space-x-2 px-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(-10)}
              disabled={zoom <= 10}
              className="h-8 w-8 p-0 hover:bg-white/50 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-105 disabled:opacity-40"
            >
              <ZoomOut className="w-4 h-4 text-slate-600" />
            </Button>
            <div className="flex items-center justify-center min-w-16 px-2">
              <span className="text-sm font-semibold text-slate-700 tabular-nums bg-slate-50 px-2 py-1 rounded-lg">
                {zoom}%
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(10)}
              disabled={zoom >= 200}
              className="h-8 w-8 p-0 hover:bg-white/50 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-105 disabled:opacity-40"
            >
              <ZoomIn className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
          <div className="w-px h-6 bg-slate-200 mx-3" />
          <div className="flex items-center space-x-2 px-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fitToView}
              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors"
              title="Fit to view"
            >
              <Maximize2 className="w-4 h-4 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetView}
              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-md">
                Right Click
              </kbd>
            </div>
            <span className="text-slate-400">•</span>
            <span>Options</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-md">
                Shift
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-md">
                ±
              </kbd>
            </div>
            <span className="text-slate-400">•</span>
            <span>Zoom</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-md">
                Ctrl
              </kbd>
            </div>
            <span className="text-slate-400">•</span>
            <span>Select</span>
          </div>
        </div>
      </div>

      {contextMenuFollower.visible && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            left: contextMenuFollower.x - 140 * (currentZoomRef.current / 100),
            top: contextMenuFollower.y - 20 * (currentZoomRef.current / 100),
            width: `${280 * (currentZoomRef.current / 100)}px`,
            height: `${320 * (currentZoomRef.current / 100)}px`,
            transform: `scale(${currentZoomRef.current / 100})`,
            transformOrigin: "center top",
          }}
        >
          {contextMenu.visible && (
            <div className="absolute top-4 left-4 pointer-events-auto">
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onAddBlock={addBlock}
                onClose={hideContextMenu}
                onSave={saveWorkflow}
              />
            </div>
          )}
        </div>
      )}

      <div className="relative w-full h-screen p-8">
        <div
          ref={containerRef}
          className="relative w-full h-full bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl ring-1 ring-black/5"
          onContextMenu={handleContextMenu}
          onClick={(e) => {
            if (contextMenuFollower.visible) {
              const rect = containerRef.current?.getBoundingClientRect()
              if (rect) {
                const clickX = e.clientX
                const clickY = e.clientY
                const menuWidth = 280 * (currentZoomRef.current / 100)
                const menuHeight = 320 * (currentZoomRef.current / 100)
                const followerLeft = contextMenuFollower.x - menuWidth / 2
                const followerRight = contextMenuFollower.x + menuWidth / 2
                const followerTop = contextMenuFollower.y - 20
                const followerBottom = contextMenuFollower.y + menuHeight

                if (
                  clickX < followerLeft ||
                  clickX > followerRight ||
                  clickY < followerTop ||
                  clickY > followerBottom
                ) {
                  hideContextMenu()
                }
              }
            }

            if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".absolute") === null) {
              setSelectedConnection(null)
              if (!contextMenuFollower.visible) {
                hideContextMenu()
              }
            }
          }}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => handleMouseUp(e)}
          style={{
            cursor: isCtrlPressed
              ? "crosshair"
              : draggedBlockId !== null
                ? "grabbing"
                : "grab",
          }}
        >
          <div
            ref={canvasRef}
            className="absolute inset-0 origin-top-left"
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
            }}
          >
            <>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #94a3b8 1px, transparent 1px),
                    linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                  `,
                  backgroundSize: "100px 100px",
                }}
              />
            </>

            {selectionStart && isCtrlPressed && (
              <div
                ref={selectionBoxRef}
                className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-[100] rounded-lg"
                style={{
                  display: 'none',
                }}
              />
            )}

            {selectedArea && (
              <div
                className="absolute border-2 border-blue-600 bg-blue-600/30 cursor-move hover:bg-blue-600/40 transition-colors z-[100] rounded-lg"
                style={{
                  left: selectedArea.x,
                  top: selectedArea.y,
                  width: selectedArea.width,
                  height: selectedArea.height,
                }}
                onMouseDown={handleSelectionMouseDown}
              />
            )}

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {blocks.length > 0 && connections.length > 0 && (
                <>
                  {connections.map((connection) => {
                    return (
                      <ConnectionLine
                        key={connection.id}
                        connectionId={connection.id}
                        fromId={connection.from}
                        toId={connection.to}
                        onDelete={deleteConnection}
                        isDragging={draggedBlockId !== null || isPanningRef.current || isDraggingSelection}
                        blockRefs={blockRefs}
                        currentDraggedBlockPositionRef={currentDraggedBlockPosition}
                        draggedBlockId={draggedBlockId}
                      />
                    )
                  })}
                </>
              )}
            </svg>

            {blocks.length > 0 && blocks.map((block) => {
              const blockConnections = getBlockConnections(block.id)
              const blockColors = getBlockTypeColors(block.type)

              return (
                <WorkflowBlock
                  key={block.id}
                  blockData={block}
                  position={block.position}
                  isSelected={selectedConnection?.blockId === block.id || selectedBlocks.includes(block.id)}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                  onConnectionClick={handleConnectionClick}
                  onMouseDown={(e) => handleMouseDown(e, block.id)}
                  selectedConnection={selectedConnection}
                  allBlocks={blocks}
                  blockConnections={blockConnections}
                  blockColors={blockColors}
                  connections={connections}
                  isBeingDragged={draggedBlockId === block.id}
                  setRef={registerBlockRef}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}