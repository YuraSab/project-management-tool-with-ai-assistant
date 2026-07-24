import {ColorPalette} from "../types/user.ts";
import React from "react";

type ColorShade = 'default' | 'dark' | 'light' | 'disabled';

export interface ThemeVariables extends React.CSSProperties {
    [key: `--${string}`]: string | number | undefined
}

// * Повертає ОДНУ конкретну CSS-змінну у вигляді рядка.
export const getColor = (
    color: ColorPalette,
    shade: ColorShade = 'default'
) => {
    if (shade === "default")
        return `var(--color-${color})`;
    return `var(--color-${color}-${shade})`;
};

// * Повертає набір локальних змінних тільки для складних інтерактивних компонентів (кнопки, картки).
export const getColorThemeVariables = (color: ColorPalette): ThemeVariables => {
    return {
        '--local-color': `var(--color-${color})`,
        '--local-dark': `var(--color-${color}-dark)`,
        '--local-light': `var(--color-${color}-light)`,
        '--local-disabled': `var(--color-${color}-disabled)`,
    };
};