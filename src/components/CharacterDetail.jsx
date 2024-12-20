import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CharacterDetail = ({ characterId }) => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!characterId) return;

    const fetchCharacterDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/characters/${characterId}`,
          {
            params: {
              ts: 1,
              apikey: import.meta.env.VITE_PUBLIC_KEY,
              hash: import.meta.env.VITE_HASH,
            },
          }
        );
        setCharacter(response.data.data.results[0]);
      } catch (err) {
        setError('Failed to fetch character details.');
        console.error('Error fetching character details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetail();
  }, [characterId]);

  if (!characterId) return <p className="placeholder">Select a character to see details.</p>;
  if (loading) return <p className="placeholder">Loading character details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="character-detail">
      <h2>{character.name}</h2>
      <div className="image-container">
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          className="character-detail-image"
        />
      </div>
      <p>{character.description || 'No description available for this character.'}</p>

      <h3>Associated Comics</h3>
      <ul>
        {character.comics.items.length > 0 ? (
          character.comics.items.map((comic, index) => <li key={index}>{comic.name}</li>)
        ) : (
          <p>No comics available for this character.</p>
        )}
      </ul>
    </div>
  );
};

export default CharacterDetail;
