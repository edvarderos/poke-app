import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/PokemonList.scss';
import { usePokemon } from '../contexts/PokemonContext';

interface Type {
    name: string;
    url: string;
}

interface Pokemon {
    name: string;
    url: string;
}

const PokemonList: React.FC = () => {
    const [types, setTypes] = useState<Type[]>([]);
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showCaughtOnly, setShowCaughtOnly] = useState<boolean>(false);
    const navigate = useNavigate();
    const { isPokemonCaught, caughtPokemons } = usePokemon();

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/type', {
                    withCredentials: false,
                });
                setTypes(response.data.results);
            } catch (error) {
                console.error('Error fetching Pokémon types:', error);
            }
        };

        fetchTypes();
    }, []);

    const handleTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/type/${selectedType}`, {
                withCredentials: false,
            });
            const pokemons = response.data.pokemon.map((p: any) => p.pokemon);
            setPokemons(pokemons);
        } catch (error) {
            console.error(`Error fetching Pokémon of type ${selectedType}:`, error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowCaughtOnly(event.target.checked);
    };

    const handlePokemonSelect = (name: string) => {
        navigate(`/pokemon/${name}`);
    };

    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCaught = !showCaughtOnly || isPokemonCaught(pokemon.name);
        return matchesSearch && matchesCaught;
    });

    return (
        <div>
            <h2>Pokémon List by Type</h2>
            <select value={selectedType} onChange={handleTypeChange}>
                <option value="" disabled>Select a Type</option>
                {types.map((type) => (
                    <option key={type.name} value={type.name}>{type.name}</option>
                ))}
            </select>
            {selectedType && (
                <div>
                    <h3>Pokémon of type {selectedType}</h3>
                    <input
                        type="text"
                        placeholder="Search Pokémon"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={showCaughtOnly}
                            onChange={handleCheckboxChange}
                        />
                        Show caught only
                    </label>
                    <ul>
                        {filteredPokemons.map((pokemon) => (
                            <li
                                key={pokemon.name}
                                onClick={() => handlePokemonSelect(pokemon.name)}
                                className={isPokemonCaught(pokemon.name) ? 'caught' : ''}
                            >
                                {pokemon.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PokemonList;
