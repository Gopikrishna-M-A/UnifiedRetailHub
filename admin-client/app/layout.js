import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "../components/theme-provider"
import Layout from '@/components/Layout'
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import AuthProvider from "@/components/AuthProvider"
import dbConnect from '@/services/db'
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Admin Dashboard",
  description: "Efficiently manage your website with the Admin Dashboard. Keep track of inventory, manage customers, and handle orders seamlessly.",
};

export default async function RootLayout({ children }) {
  await dbConnect()
  return (
    <>
      <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
            <TooltipProvider>
            <Layout>
            {children}
            </Layout>
            </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  )
}