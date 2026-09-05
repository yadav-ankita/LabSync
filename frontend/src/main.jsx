import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ComplaintProvider } from './context/ComplaintContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { FacultyProvider } from './context/FacultyContext.jsx'
import { StudentProvider } from './context/StudentContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AdminProvider>
          <FacultyProvider>
            <StudentProvider>
              <ComplaintProvider>
                <App />
              </ComplaintProvider>
            </StudentProvider>
          </FacultyProvider>
        </AdminProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)