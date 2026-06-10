import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/posts" 
          element={token ? <Posts /> : <Navigate to="/login" />} 
        />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;