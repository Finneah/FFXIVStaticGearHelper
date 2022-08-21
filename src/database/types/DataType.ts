export type GuildConfigType = {
    guild_id: string;
    static_role?: string;
    moderator_role?: string;
};

export type BisLinksType = {
    bis_id?: number;
    user_id: string;
    bis_link: string;
    bis_name: string;
    is_main?: boolean;
    weapon?: boolean;
    head?: boolean;
    body?: boolean;
    hands?: boolean;
    legs?: boolean;
    feet?: boolean;
    offHand?: boolean;
    ears?: boolean;
    neck?: boolean;
    wrists?: boolean;
    fingerL?: boolean;
    fingerR?: boolean;
};

export enum GearTypes {
    WEAPON = 'weapon',
    HEAD = 'head',
    BODY = 'body',
    HANDS = 'hands',
    LEGS = 'legs',
    FEET = 'feet',
    OFFHAND = 'offHand',
    EARS = 'ears',
    NECK = 'neck',
    WRISTS = 'wrists',
    FINGERL = 'fingerL',
    FINGER = 'fingerR'
}
