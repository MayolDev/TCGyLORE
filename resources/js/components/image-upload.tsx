import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    label: string;
    id: string;
    currentImage?: string | null;
    onFileChange: (file: File | null) => void;
    error?: string;
    accept?: string;
    maxSize?: number; // in MB
    aspectRatio?: 'square' | 'vertical' | 'horizontal' | 'any';
    required?: boolean;
}

export default function ImageUpload({
    label,
    id,
    currentImage,
    onFileChange,
    error,
    accept = 'image/*',
    maxSize = 2,
    aspectRatio = 'any',
    required = false,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const aspectRatioClasses = {
        square: 'aspect-square',
        vertical: 'aspect-[2/3]',
        horizontal: 'aspect-[3/2]',
        any: 'aspect-video',
    };

    const aspectRatioHints = {
        square: '(1:1)',
        vertical: '(2:3 - formato carta)',
        horizontal: '(3:2)',
        any: '',
    };

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setPreview(null);
            onFileChange(null);
            return;
        }

        // Validar tamaño
        if (file.size > maxSize * 1024 * 1024) {
            alert(`El archivo debe ser menor a ${maxSize}MB`);
            return;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onFileChange(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileChange(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const clearImage = () => {
        setPreview(null);
        onFileChange(null);
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    };

    const displayImage = preview || (currentImage ? `/storage/${currentImage}` : null);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label} {required && <span className="text-destructive">*</span>}
                {aspectRatio !== 'any' && (
                    <span className="text-xs text-muted-foreground ml-2">
                        {aspectRatioHints[aspectRatio]}
                    </span>
                )}
            </Label>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Preview Section */}
                {displayImage && (
                    <div className="relative group">
                        <div className={`relative overflow-hidden rounded-lg border-2 border-border bg-muted ${aspectRatioClasses[aspectRatio]}`}>
                            <img
                                src={displayImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={clearImage}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            {preview ? 'Nueva imagen' : 'Imagen actual'}
                        </p>
                    </div>
                )}

                {/* Upload Section */}
                <div
                    className={`relative border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                    } ${aspectRatioClasses[aspectRatio]}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <Input
                        id={id}
                        type="file"
                        accept={accept}
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                        {isDragging ? (
                            <>
                                <Upload className="h-12 w-12 text-primary mb-3 animate-bounce" />
                                <p className="text-sm font-medium text-primary">
                                    ¡Suelta la imagen aquí!
                                </p>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                                <p className="text-sm font-medium mb-1">
                                    Arrastra una imagen o haz clic
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Máximo {maxSize}MB • JPG, PNG, GIF
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}

