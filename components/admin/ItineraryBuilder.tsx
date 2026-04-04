'use client'

import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import type { ItineraryDay } from '@/lib/types'

interface ItineraryBuilderProps {
  days: ItineraryDay[]
  onChange: (days: ItineraryDay[]) => void
}

export default function ItineraryBuilder({ days, onChange }: ItineraryBuilderProps) {
  const addDay = () => {
    const newDay: ItineraryDay = {
      day_number: days.length + 1,
      title: '',
      description: '',
    }
    onChange([...days, newDay])
  }

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    const updated = days.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    )
    onChange(updated)
  }

  const removeDay = (index: number) => {
    const updated = days
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day_number: i + 1 }))
    onChange(updated)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(days)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)

    const renumbered = items.map((day, i) => ({ ...day, day_number: i + 1 }))
    onChange(renumbered)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">Itinerary</label>
        <Button type="button" variant="secondary" size="sm" onClick={addDay}>
          <Plus className="w-4 h-4" />
          Add Day
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="itinerary">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-3"
            >
              {days.map((day, index) => (
                <Draggable key={index} draggableId={`day-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-bg-elevated rounded-lg border border-border-default p-4 ${snapshot.isDragging ? 'shadow-xl' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-2 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-5 h-5 text-text-muted" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-accent-orange">
                              Day {day.day_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDay(index)}
                              className="p-1 text-text-muted hover:text-danger transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <Input
                            placeholder="Day title (e.g., Arrival in Manali)"
                            value={day.title}
                            onChange={(e) => updateDay(index, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="Describe the day's activities..."
                            value={day.description}
                            onChange={(e) => updateDay(index, 'description', e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {days.length === 0 && (
        <p className="text-sm text-text-muted text-center py-6">
          No itinerary days added yet. Click &ldquo;Add Day&rdquo; to start building the itinerary.
        </p>
      )}
    </div>
  )
}
