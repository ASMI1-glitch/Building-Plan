import { useContext } from 'react'
import { ToolContext } from '../context/ToolContext'

const API_URL = import.meta.env.VITE_API_URL

export default function Toolbar() {
  const {
    tool,
    setTool,
    showAnnotations,
    setShowAnnotations,
    shapes,
    setShapes
  } = useContext(ToolContext)

  const saveDrawing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/drawings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Plan 1', shapes })
      })

      if (response.ok) {
        alert('✅ Drawing saved successfully!')
      } else {
        alert('❌ Failed to save drawing.')
      }
    } catch (error) {
      console.error('Error saving drawing:', error)
      alert('❌ Error saving drawing.')
    }
  }

  const clearDrawing = () => {
    if (window.confirm('Clear all shapes from canvas?')) {
      setShapes([])
    }
  }

  return (
    <div className="w-1/6 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-lg font-bold">Tools</h2>
      {['select', 'rectangle', 'circle', 'line', 'polygon'].map(shape => (
        <button
          key={shape}
          onClick={() => setTool(shape)}
          className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-700 ${
            tool === shape ? 'bg-gray-700 font-bold' : ''
          }`}
        >
          {shape.charAt(0).toUpperCase() + shape.slice(1)}
        </button>
      ))}

      <button
        onClick={() => setShowAnnotations(!showAnnotations)}
        className="mt-4 block w-full text-left px-2 py-1 rounded hover:bg-blue-700 bg-blue-600"
      >
        {showAnnotations ? 'Hide' : 'Show'} Annotations
      </button>

      <button
        onClick={saveDrawing}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full"
      >
        💾 Save Drawing
      </button>

      <button
        onClick={clearDrawing}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded w-full"
      >
        🗑 Clear Drawing
      </button>
    </div>
  )
}
