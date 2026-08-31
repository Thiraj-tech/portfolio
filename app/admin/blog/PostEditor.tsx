"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiImage,
  FiCode,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiTable,
  FiTrash2,
  FiTerminal,
} from "react-icons/fi";
import { uploadPostCover } from "./page";

const IMAGE_WIDTHS = ["25%", "50%", "75%", "100%"] as const;
const IMAGE_ALIGNS = [
  { value: "left", label: "Wrap text right of image", icon: <FiAlignLeft /> },
  { value: "center", label: "Center image, no wrap", icon: <FiAlignCenter /> },
  { value: "right", label: "Wrap text left of image", icon: <FiAlignRight /> },
] as const;

const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width || "100%",
        renderHTML: (attributes) => ({ style: `width: ${attributes.width}` }),
      },
      align: {
        default: "center",
        parseHTML: (element) => {
          const float = element.style.float;
          return float === "left" || float === "right" ? float : "center";
        },
        renderHTML: (attributes) => {
          if (attributes.align === "left") {
            return { style: "float: left; margin: 0 1.25rem 1rem 0" };
          }
          if (attributes.align === "right") {
            return { style: "float: right; margin: 0 0 1rem 1.25rem" };
          }
          return { style: "display: block; margin: 1rem auto" };
        },
      },
    };
  },
});

const buttonClass = (active: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-medium transition ${
    active
      ? "border-yellow bg-yellow text-ink"
      : "border-border-on-black text-cream hover:border-yellow hover:text-yellow"
  } disabled:cursor-not-allowed disabled:opacity-30`;

function ToolbarButton({
  active,
  onClick,
  label,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={buttonClass(active)}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onInsertImageClick,
  uploading,
  onToggleHtmlPanel,
  htmlPanelOpen,
}: {
  editor: Editor;
  onInsertImageClick: () => void;
  uploading: boolean;
  onToggleHtmlPanel: () => void;
  htmlPanelOpen: boolean;
}) {
  return (
    <div className="sticky top-0 z-10 mb-2 flex flex-wrap gap-1.5 border-b border-border-on-black bg-ink pt-2 pb-2">
      <ToolbarButton
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        label="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        label="Heading 3"
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <FiBold />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <FiItalic />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet list"
      >
        <FiList />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Ordered list"
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="Blockquote"
      >
        &ldquo;
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        label="Inline code"
      >
        <FiCode />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        label="Code block"
      >
        <FiTerminal />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        label="Link"
      >
        <FiLink />
      </ToolbarButton>
      <ToolbarButton
        active={false}
        onClick={onInsertImageClick}
        label="Insert image"
      >
        {uploading ? "…" : <FiImage />}
      </ToolbarButton>
      <ToolbarButton
        active={htmlPanelOpen}
        onClick={onToggleHtmlPanel}
        label="Insert raw HTML"
      >
        HTML
      </ToolbarButton>

      <ToolbarButton
        active={false}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        label="Insert table"
      >
        <FiTable />
      </ToolbarButton>

      {editor.isActive("table") && (
        <>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().addRowAfter().run()}
            label="Add row"
          >
            +Row
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            label="Add column"
          >
            +Col
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().deleteRow().run()}
            label="Delete row"
          >
            -Row
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().deleteColumn().run()}
            label="Delete column"
          >
            -Col
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().deleteTable().run()}
            label="Delete table"
          >
            <FiTrash2 />
          </ToolbarButton>
        </>
      )}

      <span className="mx-1 self-center text-xs text-cream/40">
        Selected image:
      </span>
      {IMAGE_WIDTHS.map((width) => (
        <ToolbarButton
          key={width}
          disabled={!editor.isActive("image")}
          active={editor.isActive("image", { width })}
          onClick={() => editor.chain().focus().updateAttributes("image", { width }).run()}
          label={`Image width ${width}`}
        >
          {width}
        </ToolbarButton>
      ))}
      {IMAGE_ALIGNS.map(({ value, label, icon }) => (
        <ToolbarButton
          key={value}
          disabled={!editor.isActive("image")}
          active={editor.isActive("image", { align: value })}
          onClick={() => editor.chain().focus().updateAttributes("image", { align: value }).run()}
          label={label}
        >
          {icon}
        </ToolbarButton>
      ))}
    </div>
  );
}

export default function PostEditor({
  content,
  onChange,
  slug,
}: {
  content: string;
  onChange: (html: string) => void;
  slug: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [htmlPanelOpen, setHtmlPanelOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ResizableImage,
      TableKit,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "w-full min-h-64 rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-2.5 text-sm text-cream focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 [&_p]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-yellow [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:font-mono [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/40 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-yellow [&_a]:underline [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-lg [&_table]:my-2 [&_table]:block [&_table]:w-max [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_th]:border [&_th]:border-border-on-black [&_th]:bg-white/10 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_td]:border [&_td]:border-border-on-black [&_td]:px-3 [&_td]:py-1.5",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    setError(null);
    const { url, error: uploadError } = await uploadPostCover(file, slug);
    if (uploadError) setError(uploadError);
    if (url) editor.chain().focus().setImage({ src: url }).run();
    setUploading(false);
  };

  const handleInsertHtml = () => {
    if (!htmlInput.trim() || !editor) return;
    // Whitespace (newlines/indentation) between tags in pretty-printed HTML
    // gets parsed into stray text nodes that ProseMirror's table schema
    // can't place, so it pads them out as empty cells/rows — stripping
    // inter-tag whitespace first avoids that.
    const cleaned = htmlInput.replace(/>\s+</g, "><").trim();
    editor
      .chain()
      .focus()
      .insertContent(cleaned, { parseOptions: { preserveWhitespace: false } })
      .run();
    setHtmlInput("");
    setHtmlPanelOpen(false);
  };

  if (!editor) return null;

  return (
    <div>
      <Toolbar
        editor={editor}
        onInsertImageClick={() => fileInputRef.current?.click()}
        uploading={uploading}
        onToggleHtmlPanel={() => setHtmlPanelOpen((prev) => !prev)}
        htmlPanelOpen={htmlPanelOpen}
      />
      {htmlPanelOpen && (
        <div className="mb-2 rounded-xl border border-border-on-black bg-white/[0.03] p-3">
          <textarea
            rows={6}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste raw HTML here (e.g. a <table>…</table>) and it will be inserted as real content"
            className="w-full rounded-lg border border-border-on-black bg-white/[0.04] px-3 py-2 font-mono text-xs text-cream focus:border-yellow focus:outline-none"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleInsertHtml}
              disabled={!htmlInput.trim()}
              className="rounded-full bg-yellow px-4 py-1.5 text-xs font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setHtmlPanelOpen(false);
                setHtmlInput("");
              }}
              className="rounded-full border border-border-on-black px-4 py-1.5 text-xs font-medium transition hover:border-yellow hover:text-yellow"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFile}
        className="hidden"
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}
