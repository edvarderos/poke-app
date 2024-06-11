import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../contexts/PokemonContext';
import '../styles/Register.scss';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { fetchCaughtPokemons } = usePokemon();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/api/auth/register', {
                username,
                email,
                password,
            });
            console.log('Registration response:', response.data);
            await login(username, password);
            fetchCaughtPokemons();
            navigate('/pokemon');
        } catch (error) {
            console.error('Failed to register user:', error);
            setError('Failed to register');
        }
    };

    return (
        <div className='register'>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
                {error && <div>{error}</div>}
            </form>
        </div>
    );
};

export default Register;
