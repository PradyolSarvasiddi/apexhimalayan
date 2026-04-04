'use client'

import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { GripVertical, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageItem {
  id: string
  image_url: string
  is_hero: boolean
  display_order: number
}

interface ImageReorderProps<T extends ImageItem> {
  images: T[]
  onReorder: (images: T[]) => void
  onSetHero: (imageId: string) => void
  onDelete: (imageId: string) => void
}

export default function ImageReorder<T extends ImageItem>({
  images,
  onReorder,
  onSetHero,
  onDelete,
}: ImageReorderProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)

    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index,
    }))

    onReorder(updatedItems)
  }

  if (images.length === 0) return null

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'relative group rounded-lg overflow-hidden border-2 aspect-video',
                      image.is_hero ? 'border-accent-orange' : 'border-border-default',
                      snapshot.isDragging && 'shadow-xl opacity-90'
                    )}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    {image.is_hero && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent-orange text-white text-xs font-medium rounded">
                        Main
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <div {...provided.dragHandleProps} className="p-1.5 bg-black/60 rounded-lg cursor-grab">
                        <GripVertical className="w-4 h-4 text-white" />
                      </div>
                      <button
                        type="button"
                        onClick={() => onSetHero(image.id)}
                        className={cn(
                          'p-1.5 rounded-lg',
                          image.is_hero ? 'bg-accent-orange' : 'bg-black/60 hover:bg-accent-orange'
                        )}
                      >
                        <Star className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(image.id)}
                        className="p-1.5 bg-black/60 hover:bg-danger rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
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
  )
}
