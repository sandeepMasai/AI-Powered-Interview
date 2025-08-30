
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter  } from 'react-router-dom'
import {InterviewProvider} from './context/InterviewContext'
createRoot(document.getElementById('root')).render(
 <BrowserRouter >
 <InterviewProvider>
    <App />
 </InterviewProvider>

 </BrowserRouter>
   
  
)
