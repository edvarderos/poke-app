import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface PokemonContextType {
  caughtPokemons: string[];
  fetchCaughtPokemons: () => void;
  isPokemonCaught: (name: string) => boolean;
  catchPokemon: (name: string) => void;
  releasePokemon: (name: string) => void;
}

interface PokemonProviderProps {
  children: ReactNode;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [caughtPokemons, setCaughtPokemons] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchCaughtPokemons = async () => {
    if (!user) return;
    try {
      const response = await axios.get('http://localhost:8800/api/pokemon/list');
      setCaughtPokemons(response.data);
    } catch (error) {
      console.error('Failed to fetch caught Pokémons', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCaughtPokemons();
    }
  }, [user]);

  const isPokemonCaught = (name: string) => {
    return caughtPokemons.includes(name);
  };

  const catchPokemon = (name: string) => {
    setCaughtPokemons((prevCaughtPokemons) => [...prevCaughtPokemons, name]);
  };

  const releasePokemon = (name: string) => {
    setCaughtPokemons((prevCaughtPokemons) =>
      prevCaughtPokemons.filter((pokemon) => pokemon !== name)
    );
  };

  return (
    <PokemonContext.Provider value={{ caughtPokemons, fetchCaughtPokemons, isPokemonCaught, catchPokemon, releasePokemon }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};
