// components/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Minus,
  Redo,
  Undo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface RichTextEditorProps {
  content: string;
  onContentChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const RichTextEditor = ({ content, onContentChange, placeholder, editable = true }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      Placeholder.configure({
        placeholder: placeholder || "Write something amazing...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editable: editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // We're moving the prose class application slightly.
        // The important part is that the generated ProseMirror div receives it.
        // It's often better to apply these styles via global CSS or a dedicated component.
        // However, if applying directly to the ProseMirror div, the syntax below is common.
        class: "focus:outline-none min-h-[150px] p-4 border border-slate-200 rounded-lg overflow-y-auto",
      },
    },
  });

  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit (5MB max).');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      editor?.chain().focus().setImage({ src: base64Image }).run();
      toast.info("Image inserted as Base64 (for local testing). Implement backend upload for production!");
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const newUrl = url || previousUrl;

    if (newUrl === null) {
      return;
    }

    if (newUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      toast.info("Link removed.");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: newUrl }).run();
    toast.success("Link added/updated!");
    setUrl("");
  }, [editor, url]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-200 rounded-xl shadow-sm bg-white">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
            title="Clear formatting"
          >
            <Eraser className="w-4 h-4" />
          </Button>

          <span className="h-6 w-px bg-slate-200 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={!editor.can().chain().focus().setHorizontalRule().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="h-6 w-px bg-slate-200 mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                className="p-2 h-auto text-slate-600 hover:text-slate-900"
                variant="ghost"
                size="sm"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={setLink}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            onClick={addImage}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />

          <span className="h-6 w-px bg-slate-200 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>

          <span className="h-6 w-px bg-slate-200 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            disabled={!editor.can().chain().focus().toggleSuperscript().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <SuperscriptIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            disabled={!editor.can().chain().focus().toggleSubscript().run()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <SubscriptIcon className="w-4 h-4" />
          </Button>

          <span className="h-6 w-px bg-slate-200 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 h-auto text-slate-600 hover:text-slate-900"
            variant="ghost"
            size="sm"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      )}
      {/* Apply prose classes here to the container that directly holds the editable content */}
      {/* This div is where the ProseMirror editor lives, and needs the prose styling */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;