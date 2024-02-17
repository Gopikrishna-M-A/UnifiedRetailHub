import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "../components/theme-provider"
import Layout from '@/components/Layout'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Layout>
            {children}
            </Layout>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}