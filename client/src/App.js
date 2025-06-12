import { ToolProvider } from './context/ToolContext'
import Toolbar from './components/Toolbar'
import CanvasArea from './components/CanvasArea'

function App() {
  return (
    <ToolProvider>
      <div className="flex h-screen">
        <Toolbar />
        <div className="flex-1 flex justify-center items-center bg-gray-100">
          <CanvasArea />
        </div>
      </div>
    </ToolProvider>
  )
}

export default App
