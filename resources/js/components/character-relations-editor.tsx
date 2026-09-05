import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { router, useForm } from '@inertiajs/react';
import { Link2, Plus, Trash2 } from 'lucide-react';

export interface Relacion {
    id: number;
    tipo: string;
    notas: string | null;
    personaje: { id: number; name: string; title: string | null; image_url: string | null };
}

/**
 * Alta y baja de relaciones del personaje. Va fuera del formulario grande
 * (no se pueden anidar formularios) y guarda cada relacion por su cuenta,
 * así que no hace falta darle a "Actualizar Personaje" para que cuaje.
 */
export default function CharacterRelationsEditor({
    characterId,
    relaciones,
    personajes,
}: {
    characterId: number;
    relaciones: Relacion[];
    personajes: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        related_character_id: '',
        type: '',
        inverse_type: '',
        notes: '',
    });

    const enviar = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/characters/${characterId}/relations`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="border-primary/20 bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Relaciones
                </CardTitle>
                <CardDescription>
                    Se guardan al momento, una por una. El vínculo es único por pareja: si ya existe con ese
                    personaje, se actualiza en vez de duplicarse.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                {relaciones.length > 0 ? (
                    <div className="space-y-2">
                        {relaciones.map((r) => (
                            <div key={r.id} className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2">
                                <Badge variant="outline" className="shrink-0 font-bold">{r.tipo}</Badge>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{r.personaje.name}</p>
                                    {r.notas && <p className="truncate text-xs text-muted-foreground">{r.notas}</p>}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    title={`Quitar relación con ${r.personaje.name}`}
                                    onClick={() => {
                                        if (!confirm(`¿Quitar la relación con ${r.personaje.name}?`)) return;
                                        router.delete(`/admin/character-relations/${r.id}`, { preserveScroll: true });
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Este personaje no tiene relaciones todavía.</p>
                )}

                <form onSubmit={enviar} className="grid gap-3 rounded-md border border-dashed border-border p-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label>Personaje</Label>
                        <Select value={data.related_character_id} onValueChange={(v) => setData('related_character_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Con quien se relaciona" />
                            </SelectTrigger>
                            <SelectContent>
                                {personajes.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.related_character_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo">Ese personaje es su…</Label>
                        <Input
                            id="tipo"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            placeholder="Maestro, hermano, enemigo…"
                        />
                        <InputError message={errors.type} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inverso">Y él es su… (opcional)</Label>
                        <Input
                            id="inverso"
                            value={data.inverse_type}
                            onChange={(e) => setData('inverse_type', e.target.value)}
                            placeholder="Discípulo, hermano…"
                        />
                        <p className="text-xs text-muted-foreground">
                            Vacío = relación simétrica: se lee igual por los dos lados.
                        </p>
                        <InputError message={errors.inverse_type} />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notas">Matiz (opcional)</Label>
                        <Input
                            id="notas"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Se odian desde el asedio de…"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="sm:col-span-2">
                        <Button type="submit" variant="outline" disabled={processing || !data.related_character_id || !data.type}>
                            <Plus className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando…' : 'Añadir relación'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
