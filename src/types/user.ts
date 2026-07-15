export enum Role {
    Admin = 'admin',
    Manager = 'manager',
    Member = 'member'
}
export enum Theme {
    White = 'white',
    Black = 'black',
}
export enum HighlightColor {
    Purple = 'purple',
    Green = 'green',
    Teal = 'teal',
    Slate = 'slate',
    Violet = 'violet',
    Blue = 'blue',
    Orange = 'orange'
}
export enum IconColor {
    Purple = 'purple',
    Green = 'green',
    Teal = 'teal',
    Slate = 'slate',
    Violet = 'violet',
    Blue = 'blue',
    Orange = 'orange'
}

export interface UserProfile {
    uid: string,
    email: string | null,
    displayName: string,
    photoURL: string,
    role: Role,
    createdAt: string
    reservedMembers: string[],
    theme: Theme,
    iconColor: IconColor,
    highlightColor: HighlightColor,
}

export type ColorPalette = IconColor | HighlightColor | Theme;

export const ThemeSet: Theme[] = [Theme.White, Theme.Black] as const;
export const HighlightColorSet: HighlightColor[] = [
    HighlightColor.Purple,
    HighlightColor.Green,
    HighlightColor.Teal,
    HighlightColor.Slate,
    HighlightColor.Violet,
    HighlightColor.Blue,
    HighlightColor.Orange
] as const;

export const IconColorSet: IconColor[] = [
    IconColor.Purple,
    IconColor.Green,
    IconColor.Teal,
    IconColor.Slate,
    IconColor.Violet,
    IconColor.Blue,
    IconColor.Orange
] as const;