import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import LightboxImage from '@/components/lightbox-image';

/**
 * Render de los campos largos del lore (guardados en Markdown por el editor
 * WYSIWYG, con HTML inline para subrayado y anchos de imagen). Mismo pipeline
 * que el Manual: remarkGfm + rehypeRaw.
 */
export default function MarkdownContent({ content, className = '' }: { content: string; className?: string }) {
    return (
        <div className={`lore-markdown text-base leading-relaxed text-yellow-100/90 ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Las imágenes del contenido se amplían a pantalla completa al clic;
                    // el style conserva el ancho elegido en el editor (width:N%)
                    img: ({ src, alt, style }) => (
                        <LightboxImage src={typeof src === 'string' ? src : ''} alt={alt ?? ''} style={style} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
            <style>{`
                .lore-markdown h1, .lore-markdown h2 { font-family: Cinzel, serif; font-weight: 800; color: #fde68a; margin: 1em 0 0.4em; font-size: 1.5rem; }
                .lore-markdown h3 { font-family: Cinzel, serif; font-weight: 700; color: #fcd34d; margin: 0.9em 0 0.35em; font-size: 1.2rem; }
                .lore-markdown p { margin: 0.55em 0; }
                .lore-markdown ul { list-style: disc; padding-left: 1.5em; margin: 0.55em 0; }
                .lore-markdown ol { list-style: decimal; padding-left: 1.5em; margin: 0.55em 0; }
                .lore-markdown blockquote { border-left: 3px solid rgba(251,191,36,.5); padding-left: 1em; font-style: italic; margin: 0.8em 0; color: rgba(254,243,199,.75); }
                .lore-markdown hr { border: none; border-top: 1px solid rgba(251,191,36,.35); margin: 1.2em 0; }
                .lore-markdown code { background: rgba(148,163,184,.15); border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.9em; }
                .lore-markdown img { max-width: 100%; height: auto; border-radius: 10px; margin: 0.8em 0; display: block; border: 2px solid rgba(251,191,36,.25); }
                .lore-markdown a { color: #fbbf24; text-decoration: underline; }
                .lore-markdown table { border-collapse: collapse; margin: 0.8em 0; width: 100%; }
                .lore-markdown th, .lore-markdown td { border: 1px solid rgba(251,191,36,.25); padding: 0.4em 0.7em; text-align: left; }
                .lore-markdown th { background: rgba(251,191,36,.08); font-family: Cinzel, serif; }
            `}</style>
        </div>
    );
}
