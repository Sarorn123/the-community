import "../css/globals.css"
import NextAuthProvider from "./NextAuthProvider"
import NextTopLoader from "nextjs-toploader"
import ThemeProvider from "./ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                {/* https://www.npmjs.com/package/nextjs-toploader */}
                <NextTopLoader />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <NextAuthProvider>{children}</NextAuthProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    )
}
