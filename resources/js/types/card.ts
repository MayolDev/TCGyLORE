export interface CardData {
    id: number;
    name: string;
    card_type: { id: number; name: string } | null;
    rarity: { id: number; name: string } | null;
    cost: number;
    illustration_url?: string | null;
    effect?: string;
    world: {
        id: number;
        name: string;
    };
    character?: {
        id: number;
        name: string;
    } | null;
    strength?: number | null;
    agility?: number | null;
    charisma?: number | null;
    mind?: number | null;
    created_at: string;
}
