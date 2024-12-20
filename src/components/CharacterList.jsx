import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CharacterList = ({ onCharacterClick }) => {
  const [characters, setCharacters] = useState([]); // Current batch of characters
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(true); // Loading state
  const [hasMore, setHasMore] = useState(true); // Flag to indicate if more characters are available

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://gateway.marvel.com/v1/public/characters`,
        {
          params: {
            ts: 1,
            apikey: import.meta.env.VITE_PUBLIC_KEY,
            hash: import.meta.env.VITE_HASH,
            limit: 20, // Fetch 20 characters per request
            offset,
          },
        }
      );
      const results = response.data.data.results;

      if (results.length === 0) {
        setHasMore(false); // No more characters to load
      } else {
        setCharacters((prev) => [...prev, ...results]); // Append new characters to the list
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [offset]);

  const handleNext = () => {
    if (hasMore) {
      setOffset((prevOffset) => prevOffset + 20); // Increment offset for the next batch
    }
  };

  return (
    <div className="character-grid">
      {characters.map((character) => (
        <div
          key={character.id}
          className="character-item"
          onClick={() => onCharacterClick(character.id)}
        >
          <img
            src={`${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`}
            alt={character.name}
          />
          <p>{character.name}</p>
        </div>
      ))}

      {loading && <p>Loading characters...</p>}

      {!loading && hasMore && (
        <button className="next-button" onClick={handleNext}>
          Load More
        </button>
      )}

      {!hasMore && <p>No more characters to display.</p>}
    </div>
  );
};

export default CharacterList;
