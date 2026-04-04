'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#222222',
          color: '#F0ECE4',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#4A7C4E',
            secondary: '#F0ECE4',
          },
        },
        error: {
          iconTheme: {
            primary: '#B5451B',
            secondary: '#F0ECE4',
          },
        },
      }}
    />
  )
}
