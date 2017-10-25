import React, { Component } from 'react';

const defaultPieces = [
  "yellow card",
  "red card",
  "orange card",
  "blue coin",
  "green coin",
  "purple coin"
];

// let temp = [];
// this.state.allPlayers.map(i => {
//   let temp2 = [];
//   this.state.fields.map(j => {
//     temp2.push(0);
//   });
//   temp.push(temp);
// })

// const players = ["mary", "max", "rebecca", "felix"];

function createZeroArray(num) {
  let arr = []
  for (var i=0; i<num; i++){
    arr.push(0);
  }
  return arr;
}

export default class PlayGame extends Component {
  
  constructor(props) {
    super(props);
    this.state= {
      currentPlayer: '',
      allPlayers: [],
      fields: defaultPieces,
      namesCompleted: false
    }
  }
  
  render() {
    return (
      <div className="container" id='game'>

        {!this.state.namesCompleted &&

          <div>
            <form className="form-inline">
              <label className="sr-only" for="inlineFormInput">New Player</label>
              <input type="text" 
                className="form-control mb-2 mr-sm-2 mb-sm-0"
                placeholder="enter new player"
                value={this.state.currentPlayer}
                onChange={e => {
                  this.setState({ currentPlayer: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.state.allPlayers.push({name: this.state.currentPlayer, values: createZeroArray(this.state.defaultPieces.length)});

                    this.props.updatePlayers(this.state.allPlayers);

                    this.setState({currentPlayer:''});
                  }
                }} 
              >
              </input>
              <button type="submit" className='btn btn-default' onClick={e => {
                this.state.allPlayers.push({name: this.state.currentPlayer, values: createZeroArray(this.state.defaultPieces.length)});

                this.props.updatePlayers(this.state.allPlayers);

                this.setState({currentPlayer:''});
              }}>
              Add
              </button>

            </form>

            <button onClick={e => {
              this.setState({namesCompleted: true});
            }}>Start Game</button>

          </div>

        }

        {this.state.namesCompleted &&

          <div>
            <table className="table table-bordered">

              <thead>
                <tr>
                  <td>Players</td>

                  {this.state.fields.map(piece => {
                    return <td>{piece}</td>;
                  })}

                  <td>Total Score</td>
                </tr>
              </thead>

              <tbody>
                {this.props.allPlayers.map((player, i) => {
                  return (
                    <tr>
                      <td>{player}</td>
                      {this.state.fields.map((piece, j) => {
                        return (
                          <td contentEditable="true" onChange={e => {
                            let allPlayers = [...this.state.allPlayers];
                            allPlayers[i].values[j] = e.target.value;
                            this.setState({allPlayers});
                          }}> {this.state.allPlayers[i].values[j]}
                          </td>
                        )
                      })}
                      <td>0</td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            <button className='btn btn-default'>Compute Winner</button>
          </div>
        
        }

      </div>
    )
  }
}
