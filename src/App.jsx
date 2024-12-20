import React, { useState } from 'react';
import CharacterList from './components/CharacterList';
import CharacterDetail from './components/CharacterDetail';
import './App.css';

const App = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [filter, setFilter] = useState('all'); // Tracks the selected filter (e.g., 'A', '#', 'all')

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Marvel Comics Characters</h1>
        <div className="alphabet-filter">
          <span onClick={() => handleFilterClick('all')} className={filter === 'all' ? 'active' : ''}>
            All
          </span>
          <span onClick={() => handleFilterClick('#')} className={filter === '#' ? 'active' : ''}>
            #
          </span>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
            <span
              key={letter}
              onClick={() => handleFilterClick(letter)}
              className={filter === letter ? 'active' : ''}
            >
              {letter}
            </span>
          ))}
        </div>
      </header>

      <div className="app-content">
        {/* Left Section: Character List */}
        <div className="character-list-container">
          <CharacterList filter={filter} onCharacterClick={setSelectedCharacterId} />
        </div>

        {/* Right Section: Character Detail */}
        <div className="character-detail-container">
          <CharacterDetail characterId={selectedCharacterId} />
        </div>
      </div>
    </div>
  );
};

export default App;
