import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CrosswordPage from './CrosswordPage';
import './CrosswordPage.css';

function App() {
    const [topic, setTopic] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setTopic(event.target.value);
    };

    const handleSubmit = () => {
        navigate(`/crossword/${topic}`);
    };

    return (
        <div>
            <h1>Choose a Topic for Crossword <br/> (for now only enter "example")</h1>
            <input 
                type="text" 
                value={topic} 
                onChange={handleInputChange} 
                placeholder="Enter a topic" 
            />
            <button onClick={handleSubmit}>Start Crossword</button>
            <p>Current topic: {topic}</p>

            <Routes>
                <Route path="/crossword/:topic" element={<CrosswordPage />} />
            </Routes>
        </div>
    );
}

export default App;
