import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';
import { usePokemon } from '../contexts/PokemonContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { fetchCaughtPokemons } = usePokemon();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(username, password);
            fetchCaughtPokemons();
            navigate('/pokemon');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
