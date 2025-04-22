// src/providers/theme-provider.tsx
"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}