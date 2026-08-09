import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
} from 'lucide-react';

/**
 * Editor WYSIWYG que GUARDA MARKDOWN, no HTML.
 *
 * Decision deliberada: el Manual ya renderiza Markdown con ReactMarkdown y su
 * pipeline de citas (processManualCitations) trabaja sobre texto Markdown. Si
 * este editor guardara HTML, el Manual se rompia y habia que migrar todo el
 * contenido existente. Guardando Markdown: los textos planos antiguos ya son
 * validos, el Manual no se entera, y las vistas renderizan con la dependencia
 * que ya estaba instalada.
 */
interface RichTextEditorProps {
    id?: string;
    value: string;
    onChange: (markdown: string) => void;
    placeholder?: string;
    /** Altura minima del area editable. */
    minHeight?: string;
}

function ToolbarButton({
    editor,
    onClick,
    isActive,
    title,
    children,
}: {
    editor: Editor;
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={!editor.isEditable}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={`rounded p-1.5 transition-colors ${
                isActive
                    ? 'bg-yellow-600/25 text-yellow-300'
                    : 'text-yellow-200/50 hover:bg-yellow-600/10 hover:text-yellow-200'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ id, value, onChange, placeholder, minHeight = '200px' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({ placeholder: placeholder ?? '' }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.storage.markdown.getMarkdown());
        },
        editorProps: {
            attributes: {
                id: id ?? '',
                class: 'rte-content focus:outline-none px-3 py-2 text-base leading-relaxed',
                style: `min-height: ${minHeight}`,
            },
        },
    });

    if (!editor) {
        return <div className="rounded-md border border-input" style={{ minHeight }} />;
    }

    const iconSize = 'h-4 w-4';

    return (
        <div className="overflow-hidden rounded-md border border-input bg-transparent shadow-xs focus-within:border-yellow-500/60 focus-within:ring-2 focus-within:ring-yellow-500/20">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-slate-900/60 px-1.5 py-1">
                <ToolbarButton editor={editor} title="Negrita" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Cursiva" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Tachado" isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <Strikethrough className={iconSize} />
                </ToolbarButton>
                <span className="mx-1 h-4 w-px bg-yellow-900/40" />
                <ToolbarButton editor={editor} title="Título" isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Subtítulo" isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className={iconSize} />
                </ToolbarButton>
                <span className="mx-1 h-4 w-px bg-yellow-900/40" />
                <ToolbarButton editor={editor} title="Lista" isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Lista numerada" isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Cita" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className={iconSize} />
                </ToolbarButton>
                <span className="mx-1 h-4 w-px bg-yellow-900/40" />
                <ToolbarButton editor={editor} title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo2 className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo2 className={iconSize} />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />

            {/* Estilos del contenido y del placeholder. Sin plugin de tipografía en
                el proyecto, se definen aquí, acotados a .rte-content. */}
            <style>{`
                .rte-content h2 { font-size: 1.35rem; font-weight: 800; margin: 0.8em 0 0.4em; }
                .rte-content h3 { font-size: 1.15rem; font-weight: 700; margin: 0.7em 0 0.35em; }
                .rte-content p { margin: 0.4em 0; }
                .rte-content ul { list-style: disc; padding-left: 1.4em; margin: 0.4em 0; }
                .rte-content ol { list-style: decimal; padding-left: 1.4em; margin: 0.4em 0; }
                .rte-content blockquote { border-left: 3px solid rgba(251,191,36,.45); padding-left: 0.9em; font-style: italic; margin: 0.6em 0; opacity: .9; }
                .rte-content hr { border: none; border-top: 1px solid rgba(251,191,36,.35); margin: 1em 0; }
                .rte-content code { background: rgba(148,163,184,.15); border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.9em; }
                .rte-content p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: var(--muted-foreground, #94a3b8);
                    float: left; height: 0; pointer-events: none; opacity: .6;
                }
            `}</style>
        </div>
    );
}
