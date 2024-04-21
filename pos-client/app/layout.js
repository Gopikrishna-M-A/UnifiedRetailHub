import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/cartContext";
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "@/components/ui/sonner"


export const metadata = {
  title: "POS Billing System",
  description: "An efficient Point of Sale (POS) billing system for managing transactions and inventory.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <CartProvider>
              {children}
              <Toaster />
          </CartProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
