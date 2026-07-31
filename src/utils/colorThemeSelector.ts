import { CSSProperties } from "react";
import { ColorPalette } from "../types/user";

type ColorShade = 'default' | 'dark' | 'light' | 'disabled';

export interface ThemeVariables extends CSSProperties {
    [key: `--${string}`]: string | number | undefined
}

// Returns ONE certain CSS-variable as string
export const getColor = (
    color: ColorPalette,
    shade: ColorShade = 'default'
) => {
    if (shade === "default")
        return `var(--color-${color})`;
    return `var(--color-${color}-${shade})`;
};

// Returns set of local variables for complex interactive components (buttons, cards etc.)
export const getColorThemeVariables = (color: ColorPalette): ThemeVariables => {
    return {
        '--local-color': `var(--color-${color})`,
        '--local-dark': `var(--color-${color}-dark)`,
        '--local-light': `var(--color-${color}-light)`,
        '--local-disabled': `var(--color-${color}-disabled)`,
    };
};