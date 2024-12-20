import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CharacterList = ({ onCharacterClick }) => {
  const [characters, setCharacters] = useState([]); // All fetched characters
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [hasMore, setHasMore] = useState(true); // Flag for more data
  const observer = useRef(); // Observer for infinite scrolling
  const isFetchingRef = useRef(false); // Prevents duplicate fetches

  const fetchCharacters = async () => {
    if (isFetchingRef.current) return; // Prevent multiple fetches at once
    isFetchingRef.current = true;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://gateway.marvel.com/v1/public/characters`,
        {
          params: {
            ts: 1,
            apikey: import.meta.env.VITE_PUBLIC_KEY,
            hash: import.meta.env.VITE_HASH,
            limit: 100,
            offset,
          },
        }
      );

      const results = response.data.data.results;

      if (results.length === 0) {
        setHasMore(false); // No more data to fetch
      }

      // Ensure unique characters by ID
      const uniqueCharacters = Array.from(
        new Map([...characters, ...results].map((char) => [char.id, char])).values()
      );

      setCharacters(uniqueCharacters);
    } catch (err) {
      setError('Failed to fetch characters. Please try again later.');
      console.error('Error fetching characters:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchCharacters(); // Initial fetch
  }, [offset]);

  const lastCharacterRef = useRef();
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setOffset((prevOffset) => prevOffset + 100); // Load more characters
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (lastCharacterRef.current) observer.current.observe(lastCharacterRef.current);

    return () => {
      if (lastCharacterRef.current) observer.current.unobserve(lastCharacterRef.current);
    };
  }, [lastCharacterRef.current, hasMore]);

  if (error) return <p>{error}</p>;

  return (
    <div className="character-grid">
      {loading && characters.length === 0 && (
        <div className="loading">Loading characters...</div>
      )}
      {characters.map((character, index) => (
        <div
          key={character.id}
          className="character-item"
          onClick={() => onCharacterClick(character.id)}
          ref={index === characters.length - 1 ? lastCharacterRef : null}
        >
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
          />
          <p>{character.name}</p>
        </div>
      ))}
      {loading && characters.length > 0 && <p>Loading more characters...</p>}
    </div>
  );
};

export default CharacterList;
