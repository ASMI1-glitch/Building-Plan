import { useContext, useRef, useEffect, useState } from 'react'
import { ToolContext } from '../context/ToolContext'

export default function CanvasArea() {
  const canvasRef = useRef(null)
  const { tool, shapes, setShapes, showAnnotations } = useContext(ToolContext)

  const [start, setStart] = useState(null)
  const [polygonPoints, setPolygonPoints] = useState([])
  const [drawingPolygon, setDrawingPolygon] = useState(false)

  const [dragging, setDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const isInsideShape = (shape, x, y) => {
    switch (shape.type) {
      case 'rectangle':
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
      case 'circle':
        const dx = x - shape.x
        const dy = y - shape.y
        return dx * dx + dy * dy <= shape.radius * shape.radius
      case 'line':
        const dist = Math.abs((shape.y2 - shape.y1) * x - (shape.x2 - shape.x1) * y + shape.x2 * shape.y1 - shape.y2 * shape.x1)
        const len = Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1)
        return dist / len < 5 // tolerance
      case 'polygon':
        let inside = false
        for (let i = 0, j = shape.points.length - 1; i < shape.points.length; j = i++) {
          const xi = shape.points[i].x, yi = shape.points[i].y
          const xj = shape.points[j].x, yj = shape.points[j].y
          const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi + 0.0001) + xi)
          if (intersect) inside = !inside
        }
        return inside
      default:
        return false
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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
      }
      ctx.stroke()

      if (showAnnotations) {
        ctx.fillStyle = 'black'
        ctx.font = '12px sans-serif'
        let label = ''
        let posX = 0, posY = 0

        switch (shape.type) {
          case 'rectangle':
            label = `Rectangle (${shape.x}, ${shape.y})`
            posX = shape.x + 5
            posY = shape.y - 5
            break
          case 'circle':
            label = `Circle (${shape.x}, ${shape.y})`
            posX = shape.x + shape.radius + 5
            posY = shape.y
            break
          case 'line':
            label = `Line (${shape.x1}, ${shape.y1}) → (${shape.x2}, ${shape.y2})`
            posX = shape.x1 + 5
            posY = shape.y1 - 5
            break
          case 'polygon':
            const cx = shape.points.reduce((sum, p) => sum + p.x, 0) / shape.points.length
            const cy = shape.points.reduce((sum, p) => sum + p.y, 0) / shape.points.length
            label = `Polygon (${shape.points.length} pts)`
            posX = cx
            posY = cy
            break
        }

        ctx.fillText(label, posX, posY)
      }
    }

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
    const { x, y } = getMousePos(e)

    if (tool === 'polygon') {
      if (!drawingPolygon) {
        setPolygonPoints([{ x, y }])
        setDrawingPolygon(true)
      } else {
        setPolygonPoints(prev => [...prev, { x, y }])
      }
      return
    }

    if (tool === 'move') {
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (isInsideShape(shapes[i], x, y)) {
          setDragging(true)
          setDragIndex(i)
          setDragOffset({ x, y })
          return
        }
      }
    } else {
      setStart({ x, y })
    }
  }

  const handleMouseMove = (e) => {
    if (!dragging || dragIndex === null) return
    const { x, y } = getMousePos(e)

    setShapes(prev => {
      const updated = [...prev]
      const shape = updated[dragIndex]
      const dx = x - dragOffset.x
      const dy = y - dragOffset.y

      if (shape.type === 'rectangle') {
        shape.x += dx
        shape.y += dy
      } else if (shape.type === 'circle') {
        shape.x += dx
        shape.y += dy
      } else if (shape.type === 'line') {
        shape.x1 += dx
        shape.y1 += dy
        shape.x2 += dx
        shape.y2 += dy
      } else if (shape.type === 'polygon') {
        shape.points = shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
      }

      setDragOffset({ x, y })
      return updated
    })
  }

  const handleMouseUp = (e) => {
    if (dragging) {
      setDragging(false)
      setDragIndex(null)
      return
    }

    if (!start || tool === 'polygon' || tool === 'move') return

    const { x: endX, y: endY } = getMousePos(e)
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  )
}
