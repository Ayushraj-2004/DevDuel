import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Battle from './pages/Battle';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/battle/:roomId" element={<Battle/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;