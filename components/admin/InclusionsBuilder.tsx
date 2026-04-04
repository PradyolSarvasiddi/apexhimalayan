'use client'

import { Plus, Trash2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface InclusionsBuilderProps {
  inclusions: string[]
  exclusions: string[]
  onInclusionsChange: (items: string[]) => void
  onExclusionsChange: (items: string[]) => void
}

function ListBuilder({
  title,
  items,
  onChange,
  color,
}: {
  title: string
  items: string[]
  onChange: (items: string[]) => void
  color: 'green' | 'red'
}) {
  const addItem = () => onChange([...items, ''])

  const updateItem = (index: number, value: string) => {
    const updated = items.map((item, i) => (i === index ? value : item))
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-sm font-semibold ${color === 'green' ? 'text-success' : 'text-danger'}`}>
          {title}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${color === 'green' ? 'bg-success' : 'bg-danger'}`} />
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={color === 'green' ? 'e.g., Breakfast included' : 'e.g., Personal expenses'}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1.5 text-text-muted hover:text-danger transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-text-muted py-4 text-center">
            No items added yet
          </p>
        )}
      </div>
    </div>
  )
}

export default function InclusionsBuilder({
  inclusions,
  exclusions,
  onInclusionsChange,
  onExclusionsChange,
}: InclusionsBuilderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ListBuilder
        title="What's Included"
        items={inclusions}
        onChange={onInclusionsChange}
        color="green"
      />
      <ListBuilder
        title="What's Not Included"
        items={exclusions}
        onChange={onExclusionsChange}
        color="red"
      />
    </div>
  )
}
