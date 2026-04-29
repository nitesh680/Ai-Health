import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, RotateCcw, Trophy, Brain, Palette, Hash, Type, Layers } from 'lucide-react';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('idle'); // idle, playing, showing, input, success, fail

  // Color Sequence Game State
  const [colorSequence, setColorSequence] = useState([]);
  const [userColorInput, setUserColorInput] = useState([]);
  const colors = [
    { name: 'red', emoji: '🔴', class: 'bg-red-500' },
    { name: 'green', emoji: '🟢', class: 'bg-green-500' },
    { name: 'blue', emoji: '🔵', class: 'bg-blue-500' },
    { name: 'yellow', emoji: '🟡', class: 'bg-yellow-500' },
  ];

  // Number Sequence Game State
  const [numberSequence, setNumberSequence] = useState([]);
  const [userNumberInput, setUserNumberInput] = useState('');

  // Alphabet Game State
  const [alphabetSequence, setAlphabetSequence] = useState([]);
  const [userAlphabetInput, setUserAlphabetInput] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Card Matching Game State
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const cardEmojis = ['🧠', '❤️', '🌟', '🌈', '🌸', '🦋', '🌺', '🍀'];

  // Initialize games
  const startColorGame = () => {
    setActiveGame('color');
    setGameState('playing');
    setLevel(1);
    setScore(0);
    generateColorSequence(3);
  };

  const startNumberGame = () => {
    setActiveGame('number');
    setGameState('playing');
    setLevel(1);
    setScore(0);
    generateNumberSequence(3);
  };

  const startAlphabetGame = () => {
    setActiveGame('alphabet');
    setGameState('playing');
    setLevel(1);
    setScore(0);
    generateAlphabetSequence(3);
  };

  const startCardGame = () => {
    setActiveGame('card');
    setGameState('playing');
    setLevel(1);
    setScore(0);
    initializeCards();
  };

  // Color Sequence Logic
  const generateColorSequence = (length) => {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setColorSequence(seq);
    setUserColorInput([]);
    setGameState('showing');
    
    // Show sequence with delay
    setTimeout(() => setGameState('input'), length * 800 + 1000);
  };

  const handleColorClick = (color) => {
    if (gameState !== 'input') return;
    
    const newInput = [...userColorInput, color];
    setUserColorInput(newInput);
    
    if (newInput.length === colorSequence.length) {
      checkColorSequence(newInput);
    }
  };

  const checkColorSequence = (input) => {
    const correct = input.every((color, idx) => color.name === colorSequence[idx].name);
    if (correct) {
      setGameState('success');
      setScore(s => s + level * 10);
      setTimeout(() => {
        setLevel(l => l + 1);
        generateColorSequence(colorSequence.length + 1);
      }, 1500);
    } else {
      setGameState('fail');
    }
  };

  // Number Sequence Logic
  const generateNumberSequence = (length) => {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1);
    }
    setNumberSequence(seq);
    setUserNumberInput('');
    setGameState('showing');
    setTimeout(() => setGameState('input'), length * 600 + 1000);
  };

  const handleNumberSubmit = () => {
    const correct = userNumberInput === numberSequence.join('');
    if (correct) {
      setGameState('success');
      setScore(s => s + level * 10);
      setTimeout(() => {
        setLevel(l => l + 1);
        generateNumberSequence(numberSequence.length + 1);
      }, 1500);
    } else {
      setGameState('fail');
    }
  };

  // Alphabet Game Logic
  const generateAlphabetSequence = (length) => {
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    setAlphabetSequence(seq);
    setUserAlphabetInput('');
    setGameState('showing');
    setTimeout(() => setGameState('input'), length * 600 + 1000);
  };

  const handleAlphabetSubmit = () => {
    const correct = userAlphabetInput.toUpperCase() === alphabetSequence.join('');
    if (correct) {
      setGameState('success');
      setScore(s => s + level * 10);
      setTimeout(() => {
        setLevel(l => l + 1);
        generateAlphabetSequence(alphabetSequence.length + 1);
      }, 1500);
    } else {
      setGameState('fail');
    }
  };

  // Card Matching Logic
  const initializeCards = () => {
    const gameCards = [...cardEmojis, ...cardEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, matched: false }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.includes(card.id)) return;
    
    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map(id => cards.find(c => c.id === id));
      if (first.emoji === second.emoji) {
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, first.emoji]);
          setCards(cards.map(c => c.emoji === first.emoji ? { ...c, matched: true } : c));
          setFlippedCards([]);
          setScore(s => s + 20);
          if (matchedPairs.length + 1 === cardEmojis.length) {
            setGameState('success');
          }
        }, 500);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setActiveGame(null);
    setGameState('idle');
    setScore(0);
    setLevel(1);
    setColorSequence([]);
    setNumberSequence([]);
    setAlphabetSequence([]);
    setCards([]);
  };

  const games = [
    { id: 'color', name: 'Color Sequence', icon: Palette, emoji: '🔴🟢🔵', desc: 'Repeat the color pattern', color: 'from-red-500 to-orange-500' },
    { id: 'number', name: 'Number Memory', icon: Hash, emoji: '3→7→2', desc: 'Recall the number sequence', color: 'from-blue-500 to-cyan-500' },
    { id: 'alphabet', name: 'Alphabet Recall', icon: Type, emoji: 'A→D→F', desc: 'Remember letter order', color: 'from-green-500 to-emerald-500' },
    { id: 'card', name: 'Card Matching', icon: Layers, emoji: '🧠❤️', desc: 'Find matching pairs', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary-500" /> Brain Games
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Train your memory and boost cognitive health with fun exercises
          </p>
        </motion.div>
      </div>

      {/* Score Display */}
      {activeGame && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex items-center justify-between glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{score}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Level</p>
            <p className="text-2xl font-bold text-primary-500">{level}</p>
          </div>
        </motion.div>
      )}

      {/* Game Selection */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, idx) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (game.id === 'color') startColorGame();
                if (game.id === 'number') startNumberGame();
                if (game.id === 'alphabet') startAlphabetGame();
                if (game.id === 'card') startCardGame();
              }}
              className="glass-card p-6 text-left hover:shadow-xl transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <game.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">{game.name}</h3>
              <p className="text-2xl mb-2">{game.emoji}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{game.desc}</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Color Sequence Game */}
      {activeGame === 'color' && (
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {gameState === 'showing' && (
              <motion.div key="showing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Watch the sequence...</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {colorSequence.map((color, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.6 }}
                      className={`w-20 h-20 rounded-2xl ${color.class} flex items-center justify-center text-4xl shadow-lg`}
                    >
                      {color.emoji}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {gameState === 'input' && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Your turn! Click the colors in order:</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {colors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleColorClick(color)}
                      className={`w-20 h-20 rounded-2xl ${color.class} flex items-center justify-center text-4xl shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      {color.emoji}
                    </motion.button>
                  ))}
                </div>
                <p className="mt-6 text-slate-500">Progress: {userColorInput.length} / {colorSequence.length}</p>
              </motion.div>
            )}

            {gameState === 'success' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-2xl font-bold text-green-500 mb-2">Correct!</p>
                <p className="text-slate-600 dark:text-slate-300">Moving to level {level + 1}...</p>
              </motion.div>
            )}

            {gameState === 'fail' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">😅</div>
                <p className="text-2xl font-bold text-red-500 mb-4">Game Over!</p>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Final Score: {score}</p>
                <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Number Sequence Game */}
      {activeGame === 'number' && (
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {gameState === 'showing' && (
              <motion.div key="showing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Remember the numbers...</p>
                <div className="flex justify-center gap-4">
                  {numberSequence.map((num, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.5 }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {gameState === 'input' && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Type the numbers in order:</p>
                <input
                  type="text"
                  value={userNumberInput}
                  onChange={(e) => setUserNumberInput(e.target.value.replace(/\D/g, '').slice(0, numberSequence.length))}
                  className="input-field text-center text-3xl font-bold w-48 tracking-widest"
                  placeholder="???"
                  autoFocus
                />
                <div className="mt-4">
                  <button
                    onClick={handleNumberSubmit}
                    disabled={userNumberInput.length !== numberSequence.length}
                    className="btn-primary disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'success' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-2xl font-bold text-green-500 mb-2">Correct!</p>
                <p className="text-slate-600 dark:text-slate-300">Moving to level {level + 1}...</p>
              </motion.div>
            )}

            {gameState === 'fail' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">😅</div>
                <p className="text-2xl font-bold text-red-500 mb-2">Wrong!</p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">Correct was: {numberSequence.join(' → ')}</p>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Final Score: {score}</p>
                <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Alphabet Game */}
      {activeGame === 'alphabet' && (
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {gameState === 'showing' && (
              <motion.div key="showing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Remember the letters...</p>
                <div className="flex justify-center gap-4">
                  {alphabetSequence.map((letter, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.5 }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {gameState === 'input' && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Type the letters in order:</p>
                <input
                  type="text"
                  value={userAlphabetInput}
                  onChange={(e) => setUserAlphabetInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, alphabetSequence.length))}
                  className="input-field text-center text-3xl font-bold w-48 tracking-widest"
                  placeholder="???"
                  autoFocus
                />
                <div className="mt-4">
                  <button
                    onClick={handleAlphabetSubmit}
                    disabled={userAlphabetInput.length !== alphabetSequence.length}
                    className="btn-primary disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'success' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-2xl font-bold text-green-500 mb-2">Correct!</p>
                <p className="text-slate-600 dark:text-slate-300">Moving to level {level + 1}...</p>
              </motion.div>
            )}

            {gameState === 'fail' && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-4">😅</div>
                <p className="text-2xl font-bold text-red-500 mb-2">Wrong!</p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">Correct was: {alphabetSequence.join(' → ')}</p>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Final Score: {score}</p>
                <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Card Matching Game */}
      {activeGame === 'card' && (
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <p className="text-slate-600 dark:text-slate-300">
              Matches: {matchedPairs.length} / {cardEmojis.length}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card)}
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${
                  card.matched || flippedCards.includes(card.id)
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {card.matched || flippedCards.includes(card.id) ? card.emoji : '?'}
              </motion.button>
            ))}
          </div>

          {matchedPairs.length === cardEmojis.length && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-2xl font-bold text-green-500 mb-2">You Won!</p>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Final Score: {score}</p>
              <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Back Button */}
      {activeGame && gameState !== 'fail' && matchedPairs.length !== cardEmojis.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetGame}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default Games;
