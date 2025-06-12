import { createContext, useState } from 'react'

export const ToolContext = createContext()

export function ToolProvider({ children }) {
  const [tool, setTool] = useState('select')
  const [shapes, setShapes] = useState([])
  const [showAnnotations, setShowAnnotations] = useState(false)

  return (
    <ToolContext.Provider value={{ tool, setTool, shapes, setShapes, showAnnotations, setShowAnnotations }}>
      {children}
    </ToolContext.Provider>
  )
}
