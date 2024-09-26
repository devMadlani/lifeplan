import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FileUpload from './components/FileUpload.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FileUpload />
    {/* <App /> */}
  </StrictMode>,
)
