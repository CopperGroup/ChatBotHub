"use client"

import React, { useState, useEffect, useRef } from "react"

interface Point {
  x: number;
  y: number;
}

interface ConnectionLineProps {
  connectionId: string
  fromId: string
  toId: string
  onDelete: (connectionId: string) => void
  isDragging: boolean // Passed to know general dragging state (for hover effects)
  // New props for accessing block positions live
  blockRefs: Map<string, React.RefObject<HTMLDivElement>>; // The map of all block DOM refs
  currentDraggedBlockPositionRef: React.RefObject<Point | null>; // Ref to the dragged block's live position
  draggedBlockId: string | null; // ID of the block currently being dragged
}

export const ConnectionLine = React.memo(function ConnectionLine({
  connectionId,
  fromId,
  toId,
  onDelete,
  isDragging,
  blockRefs, // Receive blockRefs map
  currentDraggedBlockPositionRef, // Receive the ref to the dragged block's live position
  draggedBlockId, // Receive the ID of the dragged block
}: ConnectionLineProps) {
  const componentId = useRef(Math.random().toString(36).substring(2, 9)).current;

  const [isHovered, setIsHovered] = useState(false);
  const [fromPoint, setFromPoint] = useState<Point>({ x: 0, y: 0 });
  const [toPoint, setToPoint] = useState<Point>({ x: 0, y: 0 });

  // Effect to continuously update connection points when blocks move
  useEffect(() => {
    let animationFrameId: number;

    const calculateAndSetPoints = () => {
      const fromBlockRef = blockRefs.get(fromId);
      const toBlockRef = blockRefs.get(toId);

      let newFromPosition: Point | null = null;
      let newToPosition: Point | null = null;

      // Prioritize live dragged position from ref if applicable
      if (draggedBlockId === fromId && currentDraggedBlockPositionRef.current) {
        newFromPosition = currentDraggedBlockPositionRef.current;
      } else if (fromBlockRef?.current) {
        newFromPosition = {
          x: fromBlockRef.current.offsetLeft,
          y: fromBlockRef.current.offsetTop,
        };
      }

      if (draggedBlockId === toId && currentDraggedBlockPositionRef.current) {
        newToPosition = currentDraggedBlockPositionRef.current;
      } else if (toBlockRef?.current) {
        newToPosition = {
          x: toBlockRef.current.offsetLeft,
          y: toBlockRef.current.offsetTop,
        };
      }

      if (newFromPosition && newToPosition) {
        const calculatedFromPoint = {
          x: newFromPosition.x + 320, // Assuming block width 320
          y: newFromPosition.y + 100, // Assuming block height / 2
        };

        const calculatedToPoint = {
          x: newToPosition.x,
          y: newToPosition.y + 100, // Assuming block height / 2
        };

        // Only update state if points have actually changed to prevent unnecessary re-renders of ConnectionLine
        if (calculatedFromPoint.x !== fromPoint.x || calculatedFromPoint.y !== fromPoint.y ||
            calculatedToPoint.x !== toPoint.x || calculatedToPoint.y !== toPoint.y) {
          setFromPoint(calculatedFromPoint);
          setToPoint(calculatedToPoint);
        }
      }
      
      // Request next frame if *any* dragging is active
      // This is the key: `isDragging` tells this effect whether to continue polling.
      // This allows ConnectionLine to update itself without the parent re-rendering.
      if (isDragging) { 
          animationFrameId = requestAnimationFrame(calculateAndSetPoints);
      }
    };

    // Initial call when component mounts or relevant IDs/refs change
    // This will run once when `isDragging` becomes true, or when block IDs change.
    calculateAndSetPoints();

    // Cleanup: cancel animation frame on unmount or when `isDragging` becomes false
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    fromId, toId, // These define *which* blocks this connection is interested in
    blockRefs, currentDraggedBlockPositionRef, draggedBlockId, // These provide the live data source (refs)
    isDragging, // This signals the loop to start/stop
    // Removed fromPoint/toPoint from dependencies: `setFromPoint`/`setToPoint` will trigger a re-render.
    // Including them here would cause an infinite loop if values are set inside.
    // The previous `if (calculatedFromPoint.x !== fromPoint.x)` check correctly prevents unnecessary state updates.
  ]);


  // Path Data calculation
  const midX = (fromPoint.x + toPoint.x) / 2;
  const controlPoint1 = { x: midX, y: fromPoint.y };
  const controlPoint2 = { x: midX, y: toPoint.y };
  const pathData = `M ${fromPoint.x} ${fromPoint.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${toPoint.x} ${toPoint.y}`;

  return (
    <g>
      <defs>
        <linearGradient id={`gradient-${connectionId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#475569" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#64748b" stopOpacity="0.7" />
        </linearGradient>
        <filter id={`shadow-${connectionId}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" />
        </filter>
        <filter id={`glow-${connectionId}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={pathData}
        stroke={`url(#gradient-${connectionId})`}
        strokeWidth="3"
        fill="none"
        filter={`url(#shadow-${connectionId})`}
        style={{ pointerEvents: "none" }}
      />

      {!isDragging && ( // Only show interactive elements if no dragging is happening globally
        <>
          <path
            d={pathData}
            stroke="transparent"
            strokeWidth="20"
            fill="none"
            className="cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(connectionId);
            }}
            style={{ pointerEvents: "stroke" }}
          />

          {isHovered && (
            <>
              <path
                d={pathData}
                stroke="#10b981"
                strokeWidth="4"
                fill="none"
                className="cursor-pointer transition-all duration-200"
                style={{
                  pointerEvents: "none",
                  filter: `url(#glow-${connectionId})`,
                  strokeDasharray: "10 5",
                  animation: "dash 1.5s linear infinite",
                }}
              />
              <circle
                cx={(fromPoint.x + toPoint.x) / 2}
                cy={(fromPoint.y + toPoint.y) / 2}
                r="12"
                fill="rgba(239, 68, 68, 0.95)"
                className="cursor-pointer backdrop-blur-sm"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(239, 68, 68, 0.4))",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(connectionId);
                }}
              />
              <circle
                cx={(fromPoint.x + toPoint.x) / 2}
                cy={(fromPoint.y + toPoint.y) / 2}
                r="8"
                fill="rgba(255, 255, 255, 0.2)"
                className="cursor-pointer pointer-events-none"
              />
              <text
                x={(fromPoint.x + toPoint.x) / 2}
                y={(fromPoint.y + toPoint.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                className="cursor-pointer pointer-events-none"
              >
                ×
              </text>
            </>
          )}
        </>
      )}
    </g>
  );
});