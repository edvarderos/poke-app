import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PokemonList from './pages/PokemonList';
import NavBar from './components/NavBar';
import './styles/App.scss';
import PokemonProfile from './pages/PokemonProfile';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/pokemon"
          element={
            <ProtectedRoute>
              <PokemonList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pokemon/:name"
          element={
            <ProtectedRoute>
              <PokemonProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
