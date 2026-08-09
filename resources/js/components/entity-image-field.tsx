import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useState } from 'react';

/**
 * Campo de imagen de las entidades de lore: acepta subir un fichero O pegar
 * una URL externa. El backend guarda lo que llegue en la misma columna y el
 * accessor image_url del modelo resuelve ambas.
 */
export default function EntityImageField({
    label = 'Imagen',
    current,
    urlValue,
    onFileChange,
    onUrlChange,
    errorImage,
    errorUrl,
}: {
    label?: string;
    /** URL de la imagen actual (accessor image_url), para el preview en Edit. */
    current?: string | null;
    urlValue: string;
    onFileChange: (file: File | null) => void;
    onUrlChange: (url: string) => void;
    errorImage?: string;
    errorUrl?: string;
}) {
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const handleFile = (file: File | null) => {
        setFilePreview(file ? URL.createObjectURL(file) : null);
        onFileChange(file);
    };

    // Prioridad del preview: fichero recién elegido > URL pegada > imagen actual
    const preview = filePreview || (urlValue.startsWith('http') ? urlValue : null) || current || null;

    return (
        <div className="space-y-3">
            <Label>{label}</Label>

            {preview && (
                <div className="relative overflow-hidden rounded-lg border-2 border-amber-500/40">
                    <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                    <span className="absolute top-2 left-2 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-bold text-yellow-200 border border-yellow-500/40">
                        {filePreview ? '🖼️ Nueva (sin guardar)' : urlValue.startsWith('http') ? '🔗 Desde URL' : '🖼️ Actual'}
                    </span>
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label htmlFor="image" className="text-xs text-muted-foreground">Subir fichero</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files?.[0] || null)}
                    />
                    <InputError message={errorImage} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="image_url" className="text-xs text-muted-foreground">…o pega una URL externa</Label>
                    <Input
                        id="image_url"
                        type="text"
                        value={urlValue}
                        onChange={(e) => onUrlChange(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <InputError message={errorUrl} />
                </div>
            </div>
        </div>
    );
}
