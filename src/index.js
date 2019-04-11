import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './tailwind.css'

const App = () => {
  const [player, setPlayer] = useState(true)
  const [squares, setSquares] = useState([[], []])
  const [history, setHistory] = useState([])
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    handleWinner(!player ? 0 : 1)
  })

  const handleWinner = player => {
    const winningValues = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ]
    if (squares[0].length > 2) {
      winningValues.forEach(value => {
        let set = []

        for (let i of value) {
          if (squares[player].includes(i)) {
            set = [...set, i]
            if (set.length > 2) {
              setWinner(!player ? 'X' : 'O')
            }
          }
        }
      })
    }
  }

  const handleClick = e => {
    const [X, O] = squares
    const position = parseInt(e.target.dataset.box)
    if (e.target.innerHTML.length < 1 && !winner) {
      if (player) {
        setSquares([[...X, position], [...O]])
        setHistory([
          ...history,
          {
            id: X.length + O.length + 1,
            player: true,
            position,
            saved: squares
          }
        ])
      } else {
        setSquares([[...X], [...O, position]])
        setHistory([
          ...history,
          {
            id: O.length + X.length + 1,
            player: false,
            position,
            saved: squares
          }
        ])
      }

      setPlayer(!player)
    }
  }

  const handleSquareRender = player => {
    if (squares[0].includes(player)) {
      return 'x'
    } else if (squares[1].includes(player)) {
      return 'o'
    }
  }

  const handleTimeTravle = e => {
    const position = e._targetInst.key
    setSquares(history[position].saved)
    setPlayer(history[position].player)
    setHistory(history.slice(0, position))
    if (winner) {
      setWinner(null)
    }
  }

  const handleReset = props => {
    setSquares([[], []])
    setPlayer(true)
    setWinner(null)
    document.querySelectorAll('button').forEach(btn => (btn.innerHTML = ''))
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <div className="flex flex-col justify-center items-center">
        <WinningMessage winner={winner} handleReset={handleReset} />
        <div>
          <p className="mb-4">
            Current player is{' '}
            <span className="text-4xl ml-2">{player ? 'x' : 'o'}</span>
          </p>
        </div>
        <div className="flex">
          <Square box={1} text={handleSquareRender(1)} onClick={handleClick} />
          <Square box={2} text={handleSquareRender(2)} onClick={handleClick} />
          <Square box={3} text={handleSquareRender(3)} onClick={handleClick} />
        </div>
        <div className="flex">
          <Square box={4} text={handleSquareRender(4)} onClick={handleClick} />
          <Square box={5} text={handleSquareRender(5)} onClick={handleClick} />
          <Square box={6} text={handleSquareRender(6)} onClick={handleClick} />
        </div>
        <div className="flex">
          <Square box={7} text={handleSquareRender(7)} onClick={handleClick} />
          <Square box={8} text={handleSquareRender(8)} onClick={handleClick} />
          <Square box={9} text={handleSquareRender(9)} onClick={handleClick} />
        </div>
      </div>
      <div>
        <div className="flex flex-col ml-4 mt-8 w-48 h-72 max-h-full bg-gray-300 justify-start items-center">
          <h3 className="text-md mb-1 font-bold">History</h3>
          {history.length > 1 && (
            <>
              {history.map((move, index) => (
                <button
                  key={index}
                  onClick={handleTimeTravle}
                  className="px-2 bg-green-300 rounded mb-1"
                >
                  player {move.player ? 'X' : 'O'} position {move.position}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const Square = props => {
  return (
    <button
      data-box={props.box}
      onClick={props.onClick}
      className="w-16 h-16 border-2 border-black bg-gray-300 custom-text"
    >
      {props.text}
    </button>
  )
}

const WinningMessage = ({ winner, handleReset }) => {
  return (
    <>
      {winner && (
        <div className="flex flex-col">
          <p>
            <span>{winner}</span> is the winner
          </p>
          <button className="px-4 mt-2 bg-gray-600" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
