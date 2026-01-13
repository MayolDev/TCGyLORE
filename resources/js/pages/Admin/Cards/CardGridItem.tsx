import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Swords, Pencil, Trash2, Zap, Heart, Brain, Sparkles } from 'lucide-react';
import { CardData } from '@/types/card';
import { rarityBadgeVariant, rarityGradient } from '@/lib/card-helpers';
import { memo } from 'react';

interface CardGridItemProps {
    card: CardData;
    onDelete: (id: number, name: string) => void;
}

const CardGridItem = memo(({ card, onDelete }: CardGridItemProps) => {
    return (
        <Card className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40">
            {/* Card Illustration Header */}
            <div className={`relative h-48 bg-gradient-to-br ${rarityGradient[card.rarity?.name || 'comun'] || 'from-gray-400 to-gray-600'} overflow-hidden`}>
                {card.illustration_url ? (
                    <img
                        src={card.illustration_url}
                        alt={card.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Swords className="h-20 w-20 text-white/30 animate-float" />
                    </div>
                )}

                {/* Cost Badge */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full h-12 w-12 flex items-center justify-center border-2 border-primary/30 shadow-lg">
                    <span className="text-lg font-bold">{card.cost}</span>
                </div>

                {/* Rarity Badge */}
                {card.rarity && (
                    <div className="absolute top-2 left-2">
                        <Badge variant={rarityBadgeVariant[card.rarity.name] || 'outline'} className="capitalize">
                            {card.rarity.name}
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-1 flex items-center justify-between gap-2">
                    <span>{card.name}</span>
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                </CardTitle>
                <CardDescription className="text-xs">
                    {card.card_type?.name || 'Sin tipo'} • {card.world.name}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Stats */}
                {(card.strength || card.agility || card.charisma || card.mind) && (
                    <div className="grid grid-cols-2 gap-2">
                        {card.strength !== null && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="p-1 rounded bg-red-500/10">
                                    <Zap className="h-3 w-3 text-red-600 dark:text-red-400" />
                                </div>
                                <span className="text-muted-foreground">Fuerza: {card.strength}</span>
                            </div>
                        )}
                        {card.agility !== null && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="p-1 rounded bg-green-500/10">
                                    <Zap className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-muted-foreground">Agilidad: {card.agility}</span>
                            </div>
                        )}
                        {card.charisma !== null && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="p-1 rounded bg-pink-500/10">
                                    <Heart className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                                </div>
                                <span className="text-muted-foreground">Carisma: {card.charisma}</span>
                            </div>
                        )}
                        {card.mind !== null && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="p-1 rounded bg-blue-500/10">
                                    <Brain className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-muted-foreground">Mente: {card.mind}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Effect Text (truncated) */}
                <div className="text-xs text-muted-foreground line-clamp-2 border-t pt-2">
                    {card.effect ? card.effect.replace(/\*\*\*/g, '').replace(/---/g, '•') : 'Sin efecto'}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/cards/${card.id}/edit`}>
                            <Pencil className="mr-1.5 h-3 w-3" />
                            Editar
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(card.id, card.name)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

CardGridItem.displayName = 'CardGridItem';

export default CardGridItem;
