// app/layout.tsx
import { AuthProvider } from '@/app/context/AuthContext';
import { Providers } from "./providers";
import React from "react";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Providers>
        </body>
        </html>
    );
}