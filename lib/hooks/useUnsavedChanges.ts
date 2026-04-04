'use client'

import { useEffect } from 'react'

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        // Legacy browsers need a string message assigned to returnValue.
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // Modern browsers require assigning directly to window.onbeforeunload 
    // or using addEventListener.
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])
}
