import React, { useEffect, useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [currentPosition, setCurrentPosition] = useState(initialIndex);
  const [errorMessage, setErrorMessage ] = useState(initialMessage)
  const [email, setEmail, handleInputEmail] = useInput();
  const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const index = squares.indexOf(currentPosition);
    return {
      x: checkIndex(index) + 1,
      y: (index < 3 ? 1 : (index > 2 && index < 6) ? 2 : 3)
    }
  }

  function checkIndex(num){
    if(num < 3) return num;
    return checkIndex(num - 3)
  }

  const getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = getXY();
    return `Coordinates (${coordinates.x}, ${coordinates.y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setEmail(initialEmail);
    setCurrentPosition(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    setErrorMessage(initialMessage);
    const coordinates = getXY();
    if(direction === "up") coordinates.y -=1
    if(direction === "down") coordinates.y +=1
    if(direction === "left") coordinates.x -=1
    if(direction === "right") coordinates.x +=1

    const newIndex = convertXYToIndex(coordinates);
    //if(squares.find(number => number === newIndex) !== undefined) return newIndex
    if((direction === "left" || direction === "right") && coordinates.x > 0 && coordinates.x < 4) return newIndex
    if((direction === "up" || direction === "down") && coordinates.y > 0 && coordinates.y < 4) return newIndex

    setErrorMessage(`You can't go ${direction}`);
    return currentPosition;
  }

  const convertXYToIndex = ({x, y}) => {
    return y === 1 ? (x - 1) : y === 2 ? (x + y) : y === 3 ? ((x + y) + 2) : initialIndex
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    setCurrentPosition(getNextIndex(evt.target.id))
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved 0 times</h3>
      </div>
      <div id="grid">
        {
          squares.map(idx => (
            <div key={idx} className={`square${idx === currentPosition ? ' active' : ''}`}>
              {idx === currentPosition ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{errorMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" value={email} placeholder="type email" onChange={(e) => handleInputEmail(e.target.value)}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const handleChanges = updatedValue => {
    setValue(updatedValue);
  };
  return [value, setValue, handleChanges];
}
