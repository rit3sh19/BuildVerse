import './App.css'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import MoodTracker from './pages/MoodTracker'
import Journal from './pages/Journal'
import { useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'

function App() {  
  const auth = useAuth();
  return (
  <main>
    <Header></Header>
    <ChatProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} /> 
        <Route 
          path="/mood" 
          element={auth?.isLoggedIn ? <MoodTracker /> : <Login />} 
        />
        <Route 
          path="/journal" 
          element={auth?.isLoggedIn ? <Journal /> : <Login />} 
        />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </ChatProvider>
  </main>
  )}
export default App
