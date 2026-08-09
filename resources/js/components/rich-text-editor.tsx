import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { useRef } from 'react';
import {
    Bold,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';

/**
 * Sube una imagen al servidor y devuelve su URL pública. Se usa desde el
 * botón de la barra y desde pegar/arrastrar. El CSRF va en la cabecera
 * X-XSRF-TOKEN leyendo la cookie que Laravel ya deja en el navegador.
 */
async function uploadEditorImage(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) return null;
    if (file.size > 4 * 1024 * 1024) {
        alert('La imagen debe pesar menos de 4MB');
        return null;
    }

    const xsrf = document.cookie
        .split('; ')
        .find((c) => c.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    const body = new FormData();
    body.append('image', file);

    try {
        const res = await fetch('/admin/editor-images', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': xsrf ? decodeURIComponent(xsrf) : '',
                Accept: 'application/json',
            },
            body,
        });
        if (!res.ok) {
            alert('No se pudo subir la imagen');
            return null;
        }
        const json = await res.json();
        return json.url ?? null;
    } catch {
        alert('No se pudo subir la imagen');
        return null;
    }
}

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: { openOnClick: false },
            }),
            Image,
            // html: true → lo que no existe en Markdown (subrayado) se guarda
            // como HTML inline; el Manual ya renderiza con rehypeRaw.
            Markdown.configure({ html: true }),
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
            // Pegar o soltar una imagen la sube y la inserta donde caiga
            handlePaste: (view, event) => {
                const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'));
                if (!file) return false;
                event.preventDefault();
                uploadEditorImage(file).then((url) => {
                    if (url) view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: url })));
                });
                return true;
            },
            handleDrop: (view, event) => {
                const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith('image/'));
                if (!file) return false;
                event.preventDefault();
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? view.state.selection.to;
                uploadEditorImage(file).then((url) => {
                    if (url) view.dispatch(view.state.tr.insert(pos, view.state.schema.nodes.image.create({ src: url })));
                });
                return true;
            },
        },
    });

    const insertImageFromPicker = (file: File | null) => {
        if (!file || !editor) return;
        uploadEditorImage(file).then((url) => {
            if (url) editor.chain().focus().setImage({ src: url }).run();
        });
    };

    const toggleLink = () => {
        if (!editor) return;
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt('URL del enlace:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

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
                <ToolbarButton editor={editor} title="Subrayado" isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon className={iconSize} />
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
                <ToolbarButton editor={editor} title="Enlace" isActive={editor.isActive('link')} onClick={toggleLink}>
                    <LinkIcon className={iconSize} />
                </ToolbarButton>
                <ToolbarButton editor={editor} title="Insertar imagen" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className={iconSize} />
                </ToolbarButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        insertImageFromPicker(e.target.files?.[0] ?? null);
                        e.target.value = '';
                    }}
                />
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
                .rte-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.6em 0; display: block; }
                .rte-content img.ProseMirror-selectednode { outline: 3px solid rgba(251,191,36,.7); }
                .rte-content a { color: #fbbf24; text-decoration: underline; cursor: pointer; }
                .rte-content p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: var(--muted-foreground, #94a3b8);
                    float: left; height: 0; pointer-events: none; opacity: .6;
                }
            `}</style>
        </div>
    );
}
