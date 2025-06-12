import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ToolProvider } from './context/ToolContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToolProvider>
    <App />
  </ToolProvider>
)

