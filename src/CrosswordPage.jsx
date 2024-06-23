import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Crossword, { CrosswordSizeContext, ThemeProvider } from '@jaredreisinger/react-crossword';
import './styles.css'; // Import the CSS file where the correct and incorrect classes are defined

const themeContext = {
  cellBackground: 'rgb(255,255,255)',
  cellBorder: 'rgb(0,0,0)',
  textColor: 'rgb(0,0,0)',
  numberColor: 'rgba(0,0,0, 0.25)',
  focusBackground: 'rgb(255,255,0)',
  highlightBackground: 'rgb(255,255,204)',
};

const sizeContext = {
  cellSize: 125,
  cellPadding: 0.125,
  cellInner: 30 - 0.125 * 2,
  cellHalf: 30 / 2,
  fontSize: (30 - 0.125 * 2) * 0.7,
};

function CrosswordPage() {
  const { topic } = useParams();
  const [crosswordData, setCrosswordData] = useState(null);
  const [status, setStatus] = useState('');
  const [autoCheck, setAutoCheck] = useState(false); // State for autocheck
  const crosswordRef = useRef(null);  // Create a ref for the Crossword component
  const [incorrectCells, setIncorrectCells] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/crossword/${topic}`)
      .then(response => response.json())
      .then(data => setCrosswordData(data));
  }, [topic]);

  const handleCrosswordComplete = () => {
    if (crosswordRef.current.isCrosswordCorrect()) {
      setStatus('Correct!');
    } else {
      setStatus('Incorrect. Keep trying!');
    }
  };

  const handleCellChange = (row, col, char) => {
    setStatus(''); // Clear status when user changes a cell
    if (autoCheck) {
      validateCell(row, col, char);
    }
  };

  const validateCell = (row, col, char) => {
    console.log(`validateCell called with row: ${row}, col: ${col}, char: ${char}`);

    const correctAnswer = getCorrectAnswer(row, col);
    console.log(`Correct answer for cell [${row}, ${col}] is: ${correctAnswer}`);

    setIncorrectCells(prev => {
      const newIncorrectCells = prev.filter(cell => !(cell.row === row && cell.col === col));
      if (char && char.toUpperCase() !== correctAnswer) {
        newIncorrectCells.push({ row, col });
      }
      return newIncorrectCells;
    });
  };

  const getCorrectAnswer = (row, col) => {
    for (const direction of ['across', 'down']) {
      for (const key in crosswordData[direction]) {
        const clue = crosswordData[direction][key];
        if (
          (direction === 'across' && row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) ||
          (direction === 'down' && col === clue.col && row >= clue.row && row < clue.row + clue.answer.length)
        ) {
          return clue.answer[direction === 'across' ? col - clue.col : row - clue.row];
        }
      }
    }
    return '';
  };

  const renderIncorrectCells = () => {
    return incorrectCells.map(({ row, col }) => (
      <rect
        key={`incorrect-${row}-${col}`}
        x={col * sizeContext.cellSize}
        y={row * sizeContext.cellSize}
        width={sizeContext.cellSize}
        height={sizeContext.cellSize}
        fill="lightcoral"
        opacity="0.5"
      />
    ));
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={themeContext}>
      <CrosswordSizeContext.Provider value={sizeContext}>
        <div className="crossword-container">
          <h2>Crossword for topic: {topic}</h2>
          <div>
            <label>
              <input
                type="checkbox"
                checked={autoCheck}
                onChange={() => setAutoCheck(!autoCheck)}
              />
              Autocheck
            </label>
          </div>
          <div style={{ width: '25em', position: 'relative' }}>
            <Crossword
              ref={crosswordRef}
              data={crosswordData}
              onCrosswordComplete={handleCrosswordComplete}
              onCellChange={handleCellChange}
            />
            <svg
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {renderIncorrectCells()}
            </svg>
          </div>
          <p style={{ color: status === 'Correct!' ? 'green' : 'red' }}>{status}</p>
        </div>
      </CrosswordSizeContext.Provider>
    </ThemeProvider>
  );
}

export default CrosswordPage;
