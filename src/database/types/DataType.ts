export type GuildConfig = {
    guild_id: string;
    static_role?: string;
    moderator_role?: string;
    bis_message_id?: string;
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
    finger_l?: boolean;
    finger_r?: boolean;
    bis_message_id?: string;
};

export enum GearTypes {
    WEAPON = 'weapon',
    OFFHAND = 'offHand',
    HEAD = 'head',
    BODY = 'body',
    HANDS = 'hands',
    LEGS = 'legs',
    FEET = 'feet',
    EARS = 'ears',
    NECK = 'neck',
    WRISTS = 'wrists',
    FINGER_L = 'finger_l',
    FINGER_R = 'finger_r'
}
