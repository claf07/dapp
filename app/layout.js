'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from './contexts/Web3Context'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import NotificationProvider from './contexts/NotificationContext'
import Notification from './components/Notification'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <NotificationProvider>
            <AuthProvider>
              <ThemeProvider>
                <Notification />
                {children}
              </ThemeProvider>
            </AuthProvider>
          </NotificationProvider>
        </Web3Provider>
      </body>
    </html>
  )
} 