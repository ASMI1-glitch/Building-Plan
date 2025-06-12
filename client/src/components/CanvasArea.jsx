import { useContext, useRef, useEffect, useState } from 'react'
import { ToolContext } from '../context/ToolContext'

export default function CanvasArea() {
  const canvasRef = useRef(null)
  const { tool, shapes, setShapes, showAnnotations } = useContext(ToolContext)

  const [start, setStart] = useState(null)
  const [polygonPoints, setPolygonPoints] = useState([])
  const [drawingPolygon, setDrawingPolygon] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all shapes
    for (const shape of shapes) {
      ctx.beginPath()
      switch (shape.type) {
        case 'rectangle':
          ctx.rect(shape.x, shape.y, shape.width, shape.height)
          break
        case 'circle':
          ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
          break
        case 'line':
          ctx.moveTo(shape.x1, shape.y1)
          ctx.lineTo(shape.x2, shape.y2)
          break
        case 'polygon':
          if (shape.points.length > 1) {
            ctx.moveTo(shape.points[0].x, shape.points[0].y)
            for (let i = 1; i < shape.points.length; i++) {
              ctx.lineTo(shape.points[i].x, shape.points[i].y)
            }
            ctx.closePath()
          }
          break
        default:
          break
      }
      ctx.stroke()

      // ✨ Draw annotation
      if (showAnnotations) {
        ctx.fillStyle = 'black'
        ctx.font = '12px sans-serif'
        let label = ''
        let posX = 0
        let posY = 0

        switch (shape.type) {
          case 'rectangle':
            label = `Rectangle (x:${shape.x}, y:${shape.y}, w:${shape.width}, h:${shape.height})`
            posX = shape.x + 4
            posY = shape.y - 4
            break
          case 'circle':
            label = `Circle (x:${shape.x}, y:${shape.y}, r:${Math.round(shape.radius)})`
            posX = shape.x + shape.radius + 4
            posY = shape.y
            break
          case 'line':
            label = `Line (${shape.x1}, ${shape.y1}) → (${shape.x2}, ${shape.y2})`
            posX = shape.x1 + 4
            posY = shape.y1 - 4
            break
          case 'polygon':
            const centerX = shape.points.reduce((acc, p) => acc + p.x, 0) / shape.points.length
            const centerY = shape.points.reduce((acc, p) => acc + p.y, 0) / shape.points.length
            label = `Polygon (${shape.points.length} pts)`
            posX = centerX
            posY = centerY
            break
        }

        ctx.fillText(label, posX, posY)
      }
    }

    // Draw in-progress polygon
    if (drawingPolygon && polygonPoints.length > 0) {
      ctx.beginPath()
      ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y)
      for (let i = 1; i < polygonPoints.length; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y)
      }
      ctx.stroke()
    }
  }, [shapes, polygonPoints, drawingPolygon, showAnnotations])

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === 'polygon') {
      if (!drawingPolygon) {
        setPolygonPoints([{ x, y }])
        setDrawingPolygon(true)
      } else {
        setPolygonPoints(prev => [...prev, { x, y }])
      }
      return
    }

    setStart({ x, y })
  }

  const handleMouseUp = (e) => {
    if (!start || tool === 'polygon') return

    const rect = canvasRef.current.getBoundingClientRect()
    const endX = e.clientX - rect.left
    const endY = e.clientY - rect.top

    let newShape = null

    if (tool === 'rectangle') {
      newShape = {
        type: 'rectangle',
        x: start.x,
        y: start.y,
        width: endX - start.x,
        height: endY - start.y,
      }
    } else if (tool === 'circle') {
      const radius = Math.sqrt((endX - start.x) ** 2 + (endY - start.y) ** 2)
      newShape = {
        type: 'circle',
        x: start.x,
        y: start.y,
        radius,
      }
    } else if (tool === 'line') {
      newShape = {
        type: 'line',
        x1: start.x,
        y1: start.y,
        x2: endX,
        y2: endY,
      }
    }

    if (newShape) {
      setShapes(prev => [...prev, newShape])
    }

    setStart(null)
  }

  const handleDoubleClick = () => {
    if (tool === 'polygon' && polygonPoints.length > 2) {
      setShapes(prev => [...prev, { type: 'polygon', points: polygonPoints }])
      setPolygonPoints([])
      setDrawingPolygon(false)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-white border border-gray-400"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  )
}
