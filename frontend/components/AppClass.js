import React from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super();
    this.state = {
      ...initialState,
      currentPosition: initialIndex
    };

    this.squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  getXY = () => {
     //It it not necessary to have a state to track the coordinates.
     //It's enough to know what index the "B" is at, to be able to calculate them.
    const index = this.squares.indexOf(this.state.currentPosition);
    return {
      x: this.checkIndex(index) + 1,
      y: (index < 3 ? 1 : (index > 2 && index < 6) ? 2 : 3)
    }
  }

  checkIndex = (num) => {
    if(num < 3) return num;
    return this.checkIndex(num - 3)
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = this.getXY();
    return `Coordinates (${coordinates.x}, ${coordinates.y})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...initialState, currentPosition: initialIndex})
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    this.setState({message: initialMessage});
    const coordinates = this.getXY();
    if(direction === "up") coordinates.y -=1
    if(direction === "down") coordinates.y +=1
    if(direction === "left") coordinates.x -=1
    if(direction === "right") coordinates.x +=1

    const newIndex = this.convertXYToIndex(coordinates);
    if((direction === "left" || direction === "right") && coordinates.x > 0 && coordinates.x < 4){ this.setState((state) => ({steps: state.steps + 1})); return newIndex}
    if((direction === "up" || direction === "down") && coordinates.y > 0 && coordinates.y < 4){ this.setState((state) => ({steps: state.steps + 1})); return newIndex}

    this.setState({message: `You can't go ${direction}`});
    return this.state.currentPosition;
  }

  convertXYToIndex = ({x, y}) => {
    return y === 1 ? (x - 1) : y === 2 ? (x + y) : y === 3 ? ((x + y) + 2) : initialIndex
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    this.setState({currentPosition: this.getNextIndex(evt.target.id)});
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({email: evt.target.value});
  }

  onSubmit = async (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const {x, y} = this.getXY();
    const {steps, email} = this.state;
    const result = await fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x, y, steps, email })
    });

    this.setState({message: (await result.json()).message});
  }

  render() {
    const { className } = this.props;
    const { steps, currentPosition, email, message } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === currentPosition ? ' active' : ''}`}>
                {idx === currentPosition ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" value={email} onChange={this.onChange} placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
