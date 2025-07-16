import React from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch"; // Assuming authFetch is needed here

// Interfaces moved from WorkflowBuilder
export interface BlockData {
  id: string;
  type: "start" | "option" | "condition" | "message" | "end" | "userResponse";
  name: string;
  message: string;
  description: string;
  position: { x: number; y: number };
  options?: string[];
  conditionId?: string;
  selectedCondition?: string;
  connections: {
    input?: string;
    output?: string[];
  };
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  fromType: "output";
  toType: "input";
  fromOptionIndex?: number;
}

// Global map for block refs - accessible by name
export const blockRefs = new Map<string, React.RefObject<HTMLDivElement>>();

export const CANVAS_WIDTH = 20000;
export const CANVAS_HEIGHT = 20000;

export const registerBlockRef = (id: string, ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    blockRefs.set(id, ref);
  } else {
    blockRefs.delete(id);
  }
};

export const getBlockTypeColors = (type: string) => {
  switch (type) {
    case "start":
      return { primary: "#10b981", secondary: "#059669", light: "#d1fae5", ring: "#10b981" };
    case "option":
      return { primary: "#3b82f6", secondary: "#2563eb", light: "#dbeafe", ring: "#3b82f6" };
    case "condition":
      return { primary: "#8b5cf6", secondary: "#7c3aed", light: "#ede9fe", ring: "#8b5cf6" };
    case "message":
      return { primary: "#f97316", secondary: "#ea580c", light: "#fed7aa", ring: "#f97316" };
    case "userResponse":
      return { primary: "#22d3ee", secondary: "#06b6d4", light: "#e0f7fa", ring: "#22d3ee" };
    case "end":
      return { primary: "#ef4444", secondary: "#dc2626", light: "#fee2e2", ring: "#ef4444" };
    default:
      return { primary: "#6b7280", secondary: "#4b5563", light: "#f3f4f6", ring: "#6b7280" };
  }
};

export const generateBlockId = (blocks: BlockData[], type: string) => {
  const existingIds = blocks
    .filter((block) => block.type === type)
    .map((block) => {
      const match = block.id.match(/\d+$/);
      return match ? Number.parseInt(match[0]) : 0;
    });
  const nextId = Math.max(0, ...existingIds) + 1;
  return type === "start" ? type : `${type}${nextId}`;
};

export const addWorkflowBlock = (
  blocks: BlockData[],
  type: "start" | "option" | "condition" | "message" | "end" | "userResponse",
  contextMenuFollower: { x: number; y: number; visible: boolean; fixed: boolean },
  currentPanOffset: { x: number; y: number },
  currentZoom: number,
  containerRect: DOMRect | undefined
): BlockData | null => {
  if (type === "start" && blocks.some((block) => block.type === "start")) {
    toast.error("Only one start block is allowed");
    return null;
  }

  if (!containerRect) {
    return null;
  }

  const canvasX = (contextMenuFollower.x - containerRect.left - currentPanOffset.x) / (currentZoom / 100);
  const canvasY = (contextMenuFollower.y - containerRect.top - currentPanOffset.y) / (currentZoom / 100);

  const id = generateBlockId(blocks, type);
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
  };
  toast.success(`Added ${type} block!`);
  return newBlock;
};

export const deleteWorkflowBlock = (
  id: string,
  blocks: BlockData[],
  connections: Connection[],
  updateBlockFn: (id: string, updates: Partial<BlockData>) => void
) => {
  const newBlocks = blocks.filter((block) => block.id !== id);
  const newConnections = connections.filter((conn) => conn.from !== id && conn.to !== id);

  const updatedBlocksAfterDeletion = newBlocks.map((block) => {
    if (block.type === "condition" && block.conditionId === id) {
      updateBlockFn(block.id, { conditionId: undefined, selectedCondition: undefined });
      return { ...block, conditionId: undefined, selectedCondition: undefined };
    }
    return block;
  });
  toast.success("Block deleted");
  return { updatedBlocks: updatedBlocksAfterDeletion, updatedConnections: newConnections };
};

export const updateWorkflowBlock = (
  id: string,
  updates: Partial<BlockData>,
  prevBlocks: BlockData[],
  prevConnections: Connection[]
) => {
  const newBlocks = prevBlocks.map((block) => (block.id === id ? { ...block, ...updates } : block));

  if (updates.options && Array.isArray(updates.options)) {
    const blockToUpdate = prevBlocks.find((b) => b.id === id);
    if (blockToUpdate && blockToUpdate.type === "option") {
      const newConnections = prevConnections.filter((conn) => {
        if (conn.from === id && conn.fromOptionIndex !== undefined) {
          return updates.options!.length > conn.fromOptionIndex;
        }
        return true;
      });
      return { blocks: newBlocks, connections: newConnections };
    }
  }

  // Handle condition block updates for selectedCondition if conditionId block's options change
  if (updates.options && Array.isArray(updates.options)) {
    const updatedBlocks = newBlocks.map((block) => {
      if (block.type === "condition" && block.conditionId === id) {
        if (block.selectedCondition && !updates.options?.includes(block.selectedCondition)) {
          return { ...block, selectedCondition: undefined };
        }
      }
      return block;
    });
    return { blocks: updatedBlocks, connections: prevConnections };
  }

  // If the block is a condition block and its conditionId or selectedCondition changes
  if (updates.conditionId !== undefined || updates.selectedCondition !== undefined) {
    return { blocks: newBlocks, connections: prevConnections };
  }

  return { blocks: newBlocks, connections: prevConnections };
};

export const handleConnectionPointClick = (
  blockId: string,
  type: "input" | "output",
  optionIndex: number | undefined,
  selectedConnection: { blockId: string; type: "input" | "output"; optionIndex?: number } | null,
  blocks: BlockData[],
  connections: Connection[],
) => {
  if (selectedConnection) {
    if (selectedConnection.blockId !== blockId && selectedConnection.type !== type) {
      const fromBlock = blocks.find((b) => b.id === selectedConnection.blockId);
      const toBlock = blocks.find((b) => b.id === blockId);

      if (fromBlock && toBlock) {
        let canConnect = true;

        if (selectedConnection.type === "output" && type === "input") {
          if (toBlock.type === "start") {
            canConnect = false;
          }

          if (fromBlock.type === "message" && toBlock.type === "message") {
            canConnect = true;
          }
        } else {
          canConnect = false; // Only allow output to input connections
        }

        if (canConnect) {
          // Prevent multiple inputs to a single block, except for "condition" blocks from "option" blocks
          const existingInputConnectionToTarget = connections.find(conn => conn.to === toBlock.id);
          if (existingInputConnectionToTarget && !(fromBlock.type === "option" && toBlock.type === "condition")) {
            toast.error("A block can only have one input connection, unless it's a condition block from an option.");
            return { newConnection: null, updatedConditionBlockId: null };
          }
          
          // Prevent connecting the same output point multiple times (e.g., from an option or message)
          const existingOutputConnectionFromSource = connections.find(conn =>
            conn.from === fromBlock.id &&
            (conn.fromOptionIndex === selectedConnection.optionIndex || selectedConnection.optionIndex === undefined)
          );
          if (existingOutputConnectionFromSource && !(fromBlock.type === "condition" && toBlock.type === "option")) {
              toast.error("An output point can only have one connection.");
              return { newConnection: null, updatedConditionBlockId: null };
          }

          const connectionId = `${selectedConnection.blockId}-${blockId}-${optionIndex !== undefined ? optionIndex : ""}-${Date.now()}`;
          const newConnection: Connection = {
            id: connectionId,
            from: selectedConnection.type === "output" ? selectedConnection.blockId : blockId,
            to: selectedConnection.type === "output" ? blockId : selectedConnection.blockId,
            fromType: "output",
            toType: "input",
            fromOptionIndex: selectedConnection.type === "output" ? selectedConnection.optionIndex : optionIndex,
          };

          let updatedConditionBlockId: string | null = null;
          if (fromBlock.type === "option" && toBlock.type === "condition") {
            updatedConditionBlockId = toBlock.id;
          }

          toast.success("Connection created");
          return { newConnection, updatedConditionBlockId };
        } else {
          toast.error("Invalid connection");
          return { newConnection: null, updatedConditionBlockId: null };
        }
      }
    } else {
      // console.log("Deselecting connection point.");
    }
  }
  return { newConnection: null, updatedConditionBlockId: null };
};

export const deleteWorkflowConnection = (
  connectionId: string,
  connections: Connection[],
  blocks: BlockData[],
  updateBlockFn: (id: string, updates: Partial<BlockData>) => void
) => {
  const connection = connections.find((c) => c.id === connectionId);
  if (connection) {
    const fromBlock = blocks.find((b) => b.id === connection.from);
    const toBlock = blocks.find((b) => b.id === connection.to);

    if (fromBlock?.type === "option" && toBlock?.type === "condition") {
      updateBlockFn(toBlock.id, { conditionId: undefined, selectedCondition: undefined });
    }
  }

  const newConnections = connections.filter((conn) => conn.id !== connectionId);
  toast.success("Connection deleted");
  return newConnections;
};

export const getBlockConnections = (blockId: string, connections: Connection[]) => {
  const inputConnection = connections.find((conn) => conn.to === blockId);
  const outputConnections = connections.filter((conn) => conn.from === blockId);
  return {
    hasInput: !!inputConnection,
    hasOutput: outputConnections.length > 0,
    inputConnection,
    outputConnections,
  };
};

export const saveWorkflowData = async (
  blocks: BlockData[],
  connections: Connection[],
  websiteId: string,
  userId: string
) => {
  try {
    const workflowData = {
      blocks,
      connections,
      metadata: {
        websiteId,
        createdAt: new Date().toISOString(),
        version: "1.0",
      },
    };

    const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/websites/${websiteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        predefinedAnswers: JSON.stringify(workflowData),
        userId: userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update website settings.");
    }

    toast.success("Workflow saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save workflow");
  }
};

// Canvas interaction logic
export const applyCanvasTransform = (
  canvasRef: React.RefObject<HTMLDivElement>,
  panOffset: { x: number; y: number },
  zoom: number
) => {
  if (canvasRef.current) {
    canvasRef.current.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`;
  }
};

export const constrainPanOffset = (
  newPanOffset: { x: number; y: number },
  currentZoom: number,
  containerRect: DOMRect | undefined
) => {
  if (!containerRect) return newPanOffset;

  const scaledCanvasWidth = CANVAS_WIDTH * (currentZoom / 100);
  const scaledCanvasHeight = CANVAS_HEIGHT * (currentZoom / 100);

  const minPanX = containerRect.width - scaledCanvasWidth;
  const maxPanX = 0;
  const minPanY = containerRect.height - scaledCanvasHeight;
  const maxPanY = 0;

  return {
    x: Math.max(minPanX, Math.min(maxPanX, newPanOffset.x)),
    y: Math.max(minPanY, Math.min(maxPanY, newPanOffset.y)),
  };
};

export const calculateZoomAtCursor = (
  delta: number,
  mousePosition: { x: number; y: number },
  currentZoom: number,
  currentPanOffset: { x: number; y: number },
  containerRect: DOMRect | undefined
) => {
  const newZoom = Math.max(10, Math.min(200, currentZoom + delta));
  if (newZoom === currentZoom) return { newZoom: currentZoom, newPanOffset: currentPanOffset };

  if (!containerRect) return { newZoom: currentZoom, newPanOffset: currentPanOffset };

  const canvasX = (mousePosition.x - currentPanOffset.x) / (currentZoom / 100);
  const canvasY = (mousePosition.y - currentPanOffset.y) / (currentZoom / 100);

  const newPanX = mousePosition.x - canvasX * (newZoom / 100);
  const newPanY = mousePosition.y - canvasY * (newZoom / 100);

  const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, newZoom, containerRect);

  return { newZoom, newPanOffset: constrainedOffset };
};

export const resetWorkflowView = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const newZoom = 100;
  const constrainedOffset = constrainPanOffset({ x: 0, y: 0 }, newZoom, containerRef.current?.getBoundingClientRect());
  return { newZoom, newPanOffset: constrainedOffset };
};

export const fitWorkflowToView = (
  blocks: BlockData[],
  containerRef: React.RefObject<HTMLDivElement>
) => {
  if (blocks.length === 0) {
    return { newZoom: 100, newPanOffset: { x: 0, y: 0 } };
  }

  const padding = 100;
  const minX = Math.min(...blocks.map((b) => b.position.x)) - padding;
  const maxX = Math.max(...blocks.map((b) => b.position.x + 320)) + padding;
  const minY = Math.min(...blocks.map((b) => b.position.y)) - padding;
  const maxY = Math.max(...blocks.map((b) => b.position.y + 200)) + padding;

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  const containerRect = containerRef.current?.getBoundingClientRect();
  if (!containerRect) {
    return { newZoom: 100, newPanOffset: { x: 0, y: 0 } };
  }

  const containerWidth = containerRect.width - 100;
  const containerHeight = containerRect.height - 100;

  const scaleX = containerWidth / contentWidth;
  const scaleY = containerHeight / contentHeight;
  const newZoom = Math.min(scaleX, scaleY, 1) * 100;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const newPanX = containerRect.width / 2 - centerX * (newZoom / 100);
  const newPanY = containerRect.height / 2 - centerY * (newZoom / 100);

  const constrainedOffset = constrainPanOffset({ x: newPanX, y: newPanY }, newZoom, containerRect);

  return { newZoom: Math.max(10, Math.min(200, newZoom)), newPanOffset: constrainedOffset };
};

export const isPointInSelectionArea = (
  x: number,
  y: number,
  selectedArea: { x: number; y: number; width: number; height: number } | null
) => {
  if (!selectedArea) return false;
  return (
    x >= selectedArea.x &&
    x <= selectedArea.x + selectedArea.width &&
    y >= selectedArea.y &&
    y <= selectedArea.y + selectedArea.height
  );
};

export const calculateBlockOverlap = (
  block: BlockData,
  selectionArea: { x: number; y: number; width: number; height: number }
) => {
  const blockLeft = block.position.x;
  const blockRight = block.position.x + 320;
  const blockTop = block.position.y;
  const blockBottom = block.position.y + 200;

  const selectionLeft = selectionArea.x;
  const selectionRight = selectionArea.x + selectionArea.width;
  const selectionTop = selectionArea.y;
  const selectionBottom = selectionArea.y + selectionArea.height;

  const intersectionLeft = Math.max(blockLeft, selectionLeft);
  const intersectionRight = Math.min(blockRight, selectionRight);
  const intersectionTop = Math.max(blockTop, selectionTop);
  const intersectionBottom = Math.min(blockBottom, selectionBottom);

  if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) {
    return 0;
  }

  const intersectionArea = (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop);
  const blockArea = 320 * 200; // Assuming fixed block size
  const overlapPercentage = (intersectionArea / blockArea) * 100;

  return overlapPercentage;
};

export const getCanvasCoordinates = (
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  currentPanOffset: { x: number; y: number },
  currentZoom: number
) => {
  const x = (clientX - containerRect.left - currentPanOffset.x) / (currentZoom / 100);
  const y = (clientY - containerRect.top - currentPanOffset.y) / (currentZoom / 100);
  return { x, y };
};

export const initializeWorkflowView = (
  blocks: BlockData[],
  containerRef: React.RefObject<HTMLDivElement>,
  currentZoom: number,
  setPanOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  applyTransform: (canvasRef: React.RefObject<HTMLDivElement>, panOffset: { x: number; y: number }, zoom: number) => void,
  canvasRef: React.RefObject<HTMLDivElement>
) => {
  const startBlock = blocks.find((block) => block.type === "start");
  if (startBlock) {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      const targetPanX = centerX - (startBlock.position.x + 160) * (currentZoom / 100);
      const targetPanY = centerY - (startBlock.position.y + 100) * (currentZoom / 100);

      const constrainedOffset = constrainPanOffset({ x: targetPanX, y: targetPanY }, currentZoom, containerRect);

      setPanOffset(constrainedOffset);
      applyTransform(canvasRef, constrainedOffset, currentZoom);
      return true; // Indicates initialization was performed
    }
  }
  return false; // Indicates no initialization or failed
};