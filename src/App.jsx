import './App.css'
import { useState } from 'react';
import Buttons from './components/Buttons/Buttons'
import { NavButton, Button } from './components/Buttons/Buttons'

function App() {
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    
    return (
        <div className='buttons-bar'>
            <Buttons>
                <NavButton text="Profile" isSelected={selectedButtonId === 0} onClick={() => setSelectedButtonId(0)}/>
                <NavButton text="Education" isSelected={selectedButtonId === 1} onClick={() => setSelectedButtonId(1)}/>
                <NavButton text="Experience" isSelected={selectedButtonId === 2} onClick={() => setSelectedButtonId(2)}/>
            </Buttons>
            <Button text="Create" isSelected={false}/>
        </div>
    )
}

export default App
