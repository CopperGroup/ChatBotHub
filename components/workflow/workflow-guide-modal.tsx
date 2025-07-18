"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Trash2, Check, X, Maximize2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card" // Import Card components

interface WorkflowGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const SlideContent: React.FC<{
  title: string
  // @ts-ignore
  description: string | JSX.Element
  imageSrc?: string
  buttonText?: string
  onButtonClick?: () => void
  isLastSlide?: boolean
}> = ({ title, description, imageSrc, buttonText, onButtonClick, isLastSlide }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col h-full justify-between p-6 md:p-8 lg:p-10"
  >
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
        {typeof description === "string" ? <p>{description}</p> : description}
      </div>
    </div>
    {imageSrc && (
      <div className="flex justify-center my-6 pb-4">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="max-w-full h-auto rounded-xl shadow-lg border border-slate-200"
        />
      </div>
    )}
    {buttonText && (
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onButtonClick}
          className={`px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 ${
            isLastSlide
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          }`}
        >
          {buttonText}
        </Button>
      </div>
    )}
  </motion.div>
)

export const WorkflowGuideModal: React.FC<WorkflowGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      title: "What are Workflows?",
      description: (
        <>
          <p>
            Workflows help you <strong className="text-slate-900">qualify your users</strong> and{" "}
            <strong className="text-slate-900">save on human resources</strong> by minimizing the amount of human work
            needed. Combined with our <strong className="text-slate-900">AI assistant</strong>, they can significantly{" "}
            <strong className="text-slate-900">reduce staff requirements</strong>, saving you money.
          </p>
          <p>
            You can create workflows as large and specialized as you need. The workflow builder interface is currently
            in beta, and we are actively working on it. However, you can be confident that the workflow logic will be
            executed with precision, exactly as you've described it.
          </p>
          <p>Here is a guide that will help you understand how to build workflows.</p>
        </>
      ),
    },
    {
      title: "Navigation & Canvas",
      description: (
        <>
          <p>
            When opening the workflow builder, you'll see a large white area—the{" "}
            <strong className="text-slate-900">canvas</strong>—where all the magic happens. To navigate, simply click
            and drag the canvas around.
          </p>
          <p>
            <strong className="text-slate-900">Zooming in/out</strong> can be very helpful; use{" "}
            <kbd className="kbd-shortcut">Shift</kbd> + <kbd className="kbd-shortcut">+</kbd> /{" "}
            <kbd className="kbd-shortcut">-</kbd>. To <strong className="text-slate-900">save</strong> the workflow,
            press <kbd className="kbd-shortcut">Shift</kbd> + <kbd className="kbd-shortcut">S</kbd>. To{" "}
            <strong className="text-slate-900">select an area</strong>, hold <kbd className="kbd-shortcut">Ctrl</kbd>{" "}
            and left-click with your mouse to start the selection.
          </p>
          <p>
            The <strong className="text-slate-900">Fit to View</strong> button (
            <Maximize2 className="inline-block w-5 h-5 align-middle text-blue-600" /> icon) at the top right can be
            really helpful if you get lost. Now, let's talk about how to work with blocks and their 6 types.
          </p>
        </>
      ),
    },
    {
      title: "Adding and Connecting Blocks",
      description: (
        <>
          <p>
            To <strong className="text-slate-900">add blocks</strong>, first open the context menu by{" "}
            <strong className="text-slate-900">right-clicking</strong> anywhere within the canvas area. The menu will
            pop up.
          </p>
          <Card className="mt-4 p-4 bg-white/80 rounded-xl shadow-inner border border-slate-200">
            <CardContent className="p-0">
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Quick Intro to Blocks:</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  Every block has at least one connection point. There are two types:
                  <ul className="list-circle list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">Inputs</strong> are marked with an{" "}
                      <ArrowRight className="inline-block w-4 h-4 align-text-bottom text-emerald-600" /> icon.
                    </li>
                    <li>
                      <strong className="text-slate-900">Outputs</strong> are marked with a{" "}
                      <Zap className="inline-block w-4 h-4 align-text-bottom text-emerald-600" /> icon.
                    </li>
                  </ul>
                </li>
                <li>
                  To <strong className="text-slate-900">create a connection</strong>, click on an{" "}
                  <strong className="text-slate-900">output point</strong>, then on an{" "}
                  <strong className="text-slate-900">input point</strong> of another block. You'll see a line (likely
                  curved) appear between the blocks if the connection was successful.
                </li>
                <li>
                  To <strong className="text-slate-900">break a connection</strong>, simply click on the line.
                </li>
                <li>
                  Some blocks may have a <strong className="text-slate-900">message input area</strong>. This is the
                  message that will be sent to the user upon the block's execution.
                </li>
                <li>
                  To <strong className="text-slate-900">remove a block</strong> from the canvas, simply click on the{" "}
                  <Trash2 className="inline-block w-4 h-4 align-text-bottom text-red-600" /> icon at the top right of
                  the block.
                </li>
                <li>
                  Sometimes blocks need personal space! By clicking and holding on a block, you can{" "}
                  <strong className="text-slate-900">move them around</strong>.
                </li>
              </ul>
            </CardContent>
          </Card>
          <p className="mt-4">
            Learning the block types is mandatory for building effective workflows. Let's start with that!
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/context-menu.png", // Replace with your actual image path
    },
    {
      title: "Start Block",
      description: (
        <>
          <p>
            This block marks the <strong className="text-slate-900">start of every conversation</strong>. It has one
            output and a message area where you can type a warm greeting message that users will see when they first
            open the chat.
          </p>
          <p>
            <strong className="text-red-600">Important:</strong> This block cannot be deleted.
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/start-block.png", // Replace with your actual image path
    },
    {
      title: "User Response Block",
      description: (
        <>
          <p>
            This block is used to mark a <strong className="text-slate-900">waiting point</strong> for the user to send
            a message in response. It has one input and one output.
          </p>
          <p>Even though its functionality is simple, it can be very useful sometimes!</p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/user-response-block.png"
    },
    {
      title: "Message Block",
      description: (
        <>
          <p>
            The <strong className="text-slate-900">Message block</strong> is obviously for{" "}
            <strong className="text-slate-900">sending messages to the user</strong>. It can be really helpful in
            building professional workflows. It has one input and one output. Also, you can use <code>{`{{response}}`}</code> 
            {" "}for injecting previouse user message into the text of the next message sent by you
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/message-block.png", // Replace with your actual image path
    },
    {
      title: "Option Block",
      description: (
        <>
          <p>
            Asking the right questions is key to great qualification, and the{" "}
            <strong className="text-slate-900">Option block</strong> does exactly that. It allows you to provide a{" "}
            <strong className="text-slate-900">list of options</strong> for users to choose from.
          </p>
          <p>
            When it's placed after a message block, it gets grouped into one message bubble, and we highly recommend
            doing that because it simply looks good.
          </p>
          <p>
            The Option block has one input and may have as many outputs as there are options.
            <strong className="text-blue-600"> Friendly recommendation:</strong> Try to keep the amount of options below
            5 so that users don't get too confused and lost at the choice.
          </p>
          <p>
            To <strong className="text-slate-900">add an option</strong>, simply click the{" "}
            <strong className="text-slate-900">"Add Option"</strong> button, type the option text, and hit the
            <Check className="inline-block w-4 h-4 align-text-bottom text-emerald-600" /> check mark button to save. You
            will see an <strong className="text-slate-900">output point</strong> appear next to it; this is where you
            will connect a condition block (note: it is only possible to connect a condition block to the output of an
            option). Voila, you are ready to go!
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/option-block.png", // Replace with your actual image path
    },
    {
      title: "Condition Blocks",
      description: (
        <>
          <p>
            <strong className="text-slate-900">Condition blocks</strong> are used to run specific logic that will depend
            on the option selected by the user. As discussed earlier, their input can only be connected to an option's
            output.
          </p>
          <p>
            When you connect a condition block to an output point of an Option block, you will have to confirm to which
            option it should be bound. When the user selects that option, this logic will run.
          </p>
          <p>
            Also, we've simplified things for you: between the Option and Condition block, it automatically waits for a
            user response, so you don't need to add a specific user response block.
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/condition-block.png", // Replace with your actual image path
    },
    {
      title: "End Block (Event)",
      description: (
        <>
          <p>
            The <strong className="text-slate-900">End block</strong> has only an input and signals to our system the{" "}
            <strong className="text-slate-900">end of your workflow</strong>. After this, you and your staff members
            will be notified via Telegram notifications. It's also the starting point where our AI assistant will begin
            handling the chat.
          </p>
          <p>
            In the message area, we highly recommend adding a message that will be sent to the user when the workflow
            ends.
          </p>
          <p>
            <strong className="text-red-600">Important note:</strong> All threads of your workflow must end with an End
            block. You will not be able to save the workflow if you don't add one.
          </p>
        </>
      ),
      imageSrc: "/assets/workflow-guide/end-block.png", // Replace with your actual image path
    },
    {
      title: "Ready to go?",
      description: (
        <>
          <p>You're all set to start building powerful workflows! Here are a few tips to enhance your messages:</p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-slate-600">
            <li>
              For <strong>bold text</strong> in messages sent to your widget users, simply wrap your text with double asterisks, like this: <code className="text-sm px-1 py-0.5 bg-slate-100 rounded">**your text**</code>.
            </li>
            <li>
              If you want some elegance with <em>italic text</em>, use single asterisks: <code className="text-sm px-1 py-0.5 bg-slate-100 rounded">*your text*</code>.
            </li>
            <li>
              You can also add a <a href="#" className="text-blue-600 underline">link</a> by putting the text in brackets and the URL in parentheses: <code className="text-sm px-1 py-0.5 bg-slate-100 rounded">[link text](https://example.com)</code>.
            </li>
          </ul>
          <p className="mt-6">Click the button below to dive in!</p>
        </>
      ),
      buttonText: "Start Now",
      isLastSlide: true,
      onButtonClick: onClose,
    },
  ]

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, slides.length])

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === "ArrowLeft") {
        handlePrev()
      } else if (event.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleNext, handlePrev, onClose])

  if (!isOpen) return null

  const currentSlideData = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-3xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-lg border border-white/60 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-md"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <SlideContent key={currentSlide} {...currentSlideData} />
          </AnimatePresence>
        </div>

        {/* Navigation and Progress */}
        <div className="p-4 md:p-6 border-t border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-xl">
          <Button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl text-md font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <motion.span
                key={index}
                className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-blue-600 scale-125" : "bg-slate-300"
                }`}
                initial={{ scale: 1 }}
                animate={{ scale: index === currentSlide ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 rounded-xl text-md font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
