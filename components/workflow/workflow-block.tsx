"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Check, Trash2, Zap, ArrowRight, Grip } from "lucide-react"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"


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

interface BlockConnections {
  hasInput: boolean
  hasOutput: boolean
  inputConnection?: any
  outputConnections?: any[]
}

interface BlockColors {
  primary: string
  secondary: string
  light: string
  ring: string
}

interface Connection {
  id: string
  from: string
  to: string
  fromType: "output"
  toType: "input"
  fromOptionIndex?: number
}

interface WorkflowBlockProps {
  blockData: BlockData;
  position: { x: number; y: number }; // Initial/committed position from state
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<BlockData>) => void;
  onDelete: (id: string) => void;
  onConnectionClick: (blockId: string, type: "input" | "output", optionIndex?: number) => void;
  onMouseDown: (e: React.MouseEvent, blockId: string) => void;
  selectedConnection: { blockId: string; type: "input" | "output"; optionIndex?: number } | null;
  allBlocks: BlockData[];
  blockConnections: BlockConnections;
  blockColors: BlockColors;
  connections: Connection[];
  isBeingDragged: boolean; // Tells this block if it's the one currently being dragged
  setRef: (id: string, ref: React.RefObject<HTMLDivElement>) => void; // Callback to register ref
}

export const WorkflowBlock = React.memo(function WorkflowBlock({
  blockData,
  position, // This is the state-managed (committed) position
  isSelected,
  onUpdate,
  onDelete,
  onConnectionClick,
  onMouseDown,
  selectedConnection,
  allBlocks,
  blockConnections,
  blockColors,
  connections,
  isBeingDragged, // Use this prop
  setRef,        // Use this prop
}: WorkflowBlockProps) {
  const componentId = useRef(Math.random().toString(36).substring(2, 9)).current;

  const blockElementRef = useRef<HTMLDivElement>(null); // Ref to the actual DOM element of this block

  // Register this block's DOM ref with the parent on mount/unmount
  useEffect(() => {
    setRef(blockData.id, blockElementRef);
    return () => {
      setRef(blockData.id, { current: null }); // Deregister on unmount
    };
  }, [blockData.id, setRef]); // Dependencies: blockData.id and the memoized setRef callback

  // Effect to sync DOM position only when NOT being dragged (after drag ends, or on initial render)
  useEffect(() => {
    if (!isBeingDragged && blockElementRef.current) {
      // Only update DOM if it's different from current state, to prevent unnecessary re-renders
      const currentLeft = parseFloat(blockElementRef.current.style.left || '0');
      const currentTop = parseFloat(blockElementRef.current.style.top || '0');
      if (currentLeft !== position.x || currentTop !== position.y) {
        blockElementRef.current.style.left = `${position.x}px`;
        blockElementRef.current.style.top = `${position.y}px`;
      }
    }
  }, [position, isBeingDragged]); // Only run if position or isBeingDragged changes

  const { id, type, name, message, description, options, conditionId, selectedCondition } = blockData;

  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [newOptionValue, setNewOptionValue] = useState("");

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);
  
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [tempMessage, setTempMessage] = useState(message);

  useEffect(() => {
    setTempDescription(description);
  }, [description]);

  useEffect(() => {
    setTempMessage(message);
  }, [message]);

  const getBlockStyle = useCallback(() => {
    const baseStyle = `
      w-80 backdrop-blur-xl bg-white/85 border border-white/30 shadow-xl hover:shadow-2xl 
      transition-all duration-300 cursor-move rounded-3xl ring-1 ring-black/5
      hover:bg-white/90 hover:scale-[1.0005] hover:-translate-y-[1px] relative pt-0
    `;

    switch (type) {
      case "start": return `${baseStyle} shadow-emerald-400/10 hover:shadow-emerald-400/30 border-emerald-200/40`;
      case "option": return `${baseStyle} shadow-blue-400/10 hover:shadow-blue-400/30 border-blue-200/40`;
      case "condition": return `${baseStyle} shadow-purple-400/10 hover:shadow-purple-400/30 border-purple-200/40`;
      case "message": return `${baseStyle} shadow-amber-400/10 hover:shadow-amber-400/30 border-amber-200/40`;
      case "userResponse": return `${baseStyle} shadow-cyan-400/10 hover:shadow-cyan-400/30 border-cyan-200/40`;
      case "end": return `${baseStyle} shadow-rose-400/10 hover:shadow-rose-400/30 border-rose-200/40`;
      default: return `${baseStyle} shadow-slate-400/20`;
    }
  }, [type]);

  const getHeaderStyle = useCallback(() => {
    switch (type) {
      case "start": return "bg-gradient-to-r from-emerald-400/70 to-emerald-500/40 backdrop-blur-sm border-b border-emerald-400/25";
      case "option": return "bg-gradient-to-r from-blue-400/70 to-blue-500/40 backdrop-blur-sm border-b border-blue-400/25";
      case "condition": return "bg-gradient-to-r from-purple-400/70 to-purple-500/40 backdrop-blur-sm border-b border-purple-400/25";
      case "message": return "bg-gradient-to-r from-amber-400/70 to-amber-500/40 backdrop-blur-sm border-b border-amber-400/25";
      case "userResponse": return "bg-gradient-to-r from-cyan-400/70 to-cyan-500/40 backdrop-blur-sm border-b border-cyan-400/25";
      case "end": return "bg-gradient-to-r from-rose-400/70 to-rose-500/40 backdrop-blur-sm border-b border-rose-400/25";
      default: return "bg-gradient-to-r from-slate-400/70 to-slate-500/40 backdrop-blur-sm border-b border-slate-400/25";
    }
  }, [type]);

  const getConnectionColor = useCallback((dotType: "input" | "output", optionIndex?: number) => {
    const isConnecting =
      selectedConnection?.blockId === id &&
      selectedConnection?.type === dotType &&
      selectedConnection?.optionIndex === optionIndex;

    const isHighlighted =
      selectedConnection &&
      (selectedConnection.blockId !== id ||
        selectedConnection.type !== dotType ||
        selectedConnection.optionIndex !== optionIndex);

    if (isConnecting) {
      return `bg-gradient-to-r from-emerald-500 to-emerald-600 backdrop-blur-xl border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40 text-white scale-110`;
    }

    if (isHighlighted) {
      return `bg-gradient-to-r from-emerald-500 to-emerald-600 backdrop-blur-xl border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30 hover:scale-110 text-white transition-all duration-200`;
    }

    return "bg-white/30 backdrop-blur-xl border-2 border-white/40 hover:bg-white/40 shadow-lg text-slate-700 hover:text-slate-900 transition-all duration-200 hover:scale-105";
  }, [selectedConnection, id]);

  const isOptionConnected = useCallback((optionIdx: number) => {
    return connections.some((conn) => conn.from === id && conn.fromOptionIndex === optionIdx);
  }, [connections, id]);

  const addOption = useCallback(() => {
    const currentOptions = options || [];
    const newOptions = [...currentOptions, "New Option"];
    onUpdate(id, { options: newOptions });
    setEditingOption(newOptions.length - 1);
    setNewOptionValue("New Option");
  }, [id, options, onUpdate]);

  const updateOption = useCallback((index: number, value: string) => {
    const currentOptions = [...(options || [])];
    const oldValue = currentOptions[index];
    currentOptions[index] = value;
    onUpdate(id, { options: currentOptions });

    allBlocks.forEach((conditionBlock) => {
      if (
        conditionBlock.type === "condition" &&
        conditionBlock.conditionId === id &&
        conditionBlock.selectedCondition === oldValue
      ) {
        onUpdate(conditionBlock.id, { selectedCondition: value });
      }
    });

    setEditingOption(null);
    setNewOptionValue("");
  }, [id, options, onUpdate, allBlocks]);

  const deleteOption = useCallback((index: number) => {
    const currentOptions = [...(options || [])];
    const deletedOption = currentOptions[index];
    currentOptions.splice(index, 1);
    onUpdate(id, { options: currentOptions });

    allBlocks.forEach((conditionBlock) => {
      if (
        conditionBlock.type === "condition" &&
        conditionBlock.conditionId === id &&
        conditionBlock.selectedCondition === deletedOption
      ) {
        onUpdate(conditionBlock.id, { selectedCondition: undefined });
      }
    });
  }, [id, options, onUpdate, allBlocks]);


  const saveDescription = useCallback(() => {
    onUpdate(id, { description: tempDescription });
    setIsEditingDescription(false);
  }, [id, tempDescription, onUpdate]);

  const cancelDescriptionEdit = useCallback(() => {
    setTempDescription(description);
    setIsEditingDescription(false);
  }, [description]);

  const saveMessage = useCallback(() => {
    onUpdate(id, { message: tempMessage });
    setIsEditingMessage(false);
  }, [id, tempMessage, onUpdate]);

  const cancelMessageEdit = useCallback(() => {
    setTempMessage(message);
    setIsEditingMessage(false);
  }, [message]);

  const getAvailableOptions = useCallback(() => {
    if (type !== "condition" || !conditionId) return [];
    const optionBlock = allBlocks.find((b) => b.id === conditionId);
    return optionBlock?.options || [];
  }, [type, conditionId, allBlocks]);

  const shouldShowInputButton = type !== "start" && !blockConnections.hasInput;
  const shouldShowOutputButton = type !== "end" && type !== "option" && !blockConnections.hasOutput;

  return (
    <motion.div
      ref={blockElementRef}
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
      }}
      whileHover={{ scale: 1.005, y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Card
        className={`${getBlockStyle()} ${
          isSelected && selectedConnection?.blockId === id
            ? `ring-4 ring-emerald-400/40 ring-offset-4 ring-offset-transparent`
            : isSelected
              ? `ring-4 ring-blue-500/60 ring-offset-4 ring-offset-transparent bg-blue-50/30 border-blue-300/60`
              : ""
        }`}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, id);
        }}
      >
        <CardHeader className={`pb-3 px-5 pt-6 rounded-t-3xl ${getHeaderStyle()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-xl bg-white/90 flex items-center justify-center shadow-sm backdrop-blur-sm">
                <Grip className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-base text-slate-900 tracking-tight">{name}</h3>
            </div>

            {blockData.type !== "start" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/80 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-xs text-slate-600 mt-2">
            {isEditingDescription && blockData.type !== "start" && blockData.type !== "end" && blockData.type !== "userResponse" ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  className="bg-white/60 backdrop-blur-sm border border-white/40 text-slate-900 focus:border-emerald-400/60 focus:ring-emerald-400/30 rounded-2xl shadow-inner h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveDescription();
                    if (e.key === "Escape") cancelDescriptionEdit();
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveDescription}
                  className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelDescriptionEdit}
                  className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (blockData.type !== "start" && blockData.type !== "end" && blockData.type !== "userResponse") {
                    setIsEditingDescription(true);
                  }
                }}
                className={`${
                  blockData.type !== "start" && blockData.type !== "end" && blockData.type !== "userResponse"
                    ? "cursor-pointer hover:text-slate-800 hover:bg-white/60 px-3 py-1.5 rounded-xl transition-all duration-200"
                    : "px-3 py-1.5"
                } font-medium leading-relaxed`}
              >
                {description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-5 px-5 pb-5">
          {shouldShowInputButton && (
            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectionClick(id, "input");
                }}
                className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${getConnectionColor("input")}`}
                disabled={selectedConnection?.blockId === id && selectedConnection?.type === "input"}
                style={{ zIndex: 10 }}
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {shouldShowOutputButton && (
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectionClick(id, "output");
                }}
                className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${getConnectionColor("output")}`}
                disabled={selectedConnection?.blockId === id && selectedConnection?.type === "output"}
                style={{ zIndex: 10 }}
              >
                <Zap className="w-3 h-3" />
              </button>
            </div>
          )}

          {(message || type === "message") && type !== "userResponse" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Message</label>
              {isEditingMessage && (type === "start" || type === "end" || type === "message") ? (
                <div className="space-y-3">
                  <textarea
                    value={tempMessage}
                    onChange={(e) => setTempMessage(e.target.value)}
                    className="bg-white/60 backdrop-blur-sm border border-white/40 text-slate-900 focus:border-emerald-400/60 focus:ring-emerald-400/30 rounded-2xl shadow-inner resize-none w-full text-sm p-4 transition-all duration-200"
                    rows={3}
                    placeholder="Enter your message..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) saveMessage();
                      if (e.key === "Escape") cancelMessageEdit();
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveMessage}
                        className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-8 px-3 text-green-600 hover:text-green-700"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Save</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelMessageEdit}
                        className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-8 px-3 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Cancel</span>
                      </Button>
                    </div>
                    <span className="text-xs text-slate-500 bg-white/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/30">
                      Ctrl+Enter
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (type === "start" || type === "end" || type === "message") {
                      setIsEditingMessage(true);
                    }
                  }}
                  className={`text-sm text-slate-900 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-inner min-h-[70px] transition-all duration-200 ${
                    type === "start" || type === "end" || type === "message"
                      ? "cursor-pointer hover:bg-white/50 hover:border-white/40 hover:scale-[1.01]"
                      : ""
                  } ${!message ? "flex items-center justify-center text-slate-500 italic" : ""}`}
                >
                  {message || "Click to add message..."}
                </div>
              )}
            </div>
          )}

          {type === "userResponse" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">User Input</label>
              <div
                className="text-sm text-slate-900 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-inner min-h-[70px] transition-all duration-200 flex items-center justify-center text-slate-500 italic"
              >
                (User's response will be received here)
              </div>
            </div>
          )}

          {type === "option" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Options</label>
              <div className="space-y-3">
                {(options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 relative">
                    {editingOption === index ? (
                      <>
                        <Input
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border border-white/40 text-slate-900 focus:border-emerald-400/60 focus:ring-emerald-400/30 rounded-2xl shadow-inner h-10 text-sm flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateOption(index, newOptionValue);
                            if (e.key === "Escape") setEditingOption(null);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateOption(index, newOptionValue)}
                          className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-10 w-10 p-0 text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingOption(null)}
                          className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-10 w-10 p-0 text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div
                          className="bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/50 hover:border-white/60 transition-all duration-200 hover:scale-[1.01] rounded-2xl shadow-lg flex-1 text-sm p-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingOption(index);
                            setNewOptionValue(option);
                          }}
                        >
                          {option}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOption(index);
                          }}
                          className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg h-10 w-10 p-0 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {/* Individual output connection for each option */}
                        {!isOptionConnected(index) && (
                          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onConnectionClick(id, "output", index);
                              }}
                              className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${getConnectionColor("output", index)}`}
                              style={{ zIndex: 10 }}
                            >
                              <Zap className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addOption();
                  }}
                  className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-2xl transition-all duration-200 hover:scale-[1.01] shadow-lg h-10 text-sm w-full font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {type === "condition" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Condition</label>
              <Select
                disabled={!conditionId}
                value={selectedCondition || ""}
                onValueChange={(value) => onUpdate(id, { selectedCondition: value })}
              >
                <SelectTrigger className="max-w-full h-11 text-sm bg-white/40 backdrop-blur-sm border border-white/40 rounded-2xl focus:border-emerald-400/60 focus:ring-emerald-400/30 shadow-inner truncate">
                  <SelectValue placeholder={conditionId ? "Select condition" : "Connect to option block first"}/>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/40 shadow-2xl backdrop-blur-xl bg-white/90">
                  {getAvailableOptions().map((option, index) => (
                    <SelectItem key={index} value={option} className="rounded-xl">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});