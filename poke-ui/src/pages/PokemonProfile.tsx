import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PokemonProfile.scss';
import { usePokemon } from '../contexts/PokemonContext';

interface PokemonDetails {
    name: string;
    sprites: {
        front_default: string;
    };
    weight: number;
    height: number;
    abilities: {
        ability: {
            name: string;
        };
        is_hidden: boolean;
    }[];
}

const PokemonProfile: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const { isPokemonCaught, catchPokemon, releasePokemon } = usePokemon();

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`, { withCredentials: false });
                setPokemon(response.data);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };

        fetchPokemonDetails();
    }, [name]);

    const handleCatchOrRelease = async () => {
        try {
            if (isPokemonCaught(name!)) {
                await axios.post(`http://localhost:8800/api/pokemon/release/${name}`);
                releasePokemon(name!);
            } else {
                await axios.post(`http://localhost:8800/api/pokemon/catch/${name}`);
                catchPokemon(name!);
            }
        } catch (error) {
            console.error(`Failed to ${isPokemonCaught(name!) ? 'release' : 'catch'} Pokémon:`, error);
        }
    };

    if (!pokemon) {
        return <div>Loading...</div>;
    }

    const { sprites, weight, height, abilities } = pokemon;
    const nonHiddenAbilities = abilities.filter((ability) => !ability.is_hidden);

    return (
        <div className="pokemon-profile">
            <h2>{pokemon.name}</h2>
            <img src={sprites.front_default} alt={pokemon.name} />
            <p><strong>Weight:</strong> {weight} hectograms</p>
            <p><strong>Height:</strong> {height} decimetres</p>
            <p><strong>Abilities:</strong></p>
            <ul>
                {nonHiddenAbilities.map((ability) => (
                    <li key={ability.ability.name}>{ability.ability.name}</li>
                ))}
            </ul>
            <button onClick={handleCatchOrRelease}>
                {isPokemonCaught(pokemon.name) ? 'Release' : 'Catch'}
            </button>
        </div>
    );
};

export default PokemonProfile;
