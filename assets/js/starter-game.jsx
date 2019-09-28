import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    var initialLetters = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];
    let {randomized,status} = this.AssignValues(initialLetters);
    this.state = {Alphabets : randomized,
                  indisplay : [],
                  finished : [],
                  visibilityStatus : status,
                  numOfClicks : 0,
                };
  //Referred to https://reactjs.org/docs/handling-events.html for binding events
   this.handleClick = this.handleClick.bind(this);
  }

   AssignValues(initialLetters){
      var randomized = _.shuffle(initialLetters);
      var status = [];
      for(var i=0;i<16;i++){
        status[i] = "hide";
      }
      return {randomized,status};
  }


  swap(_ev) {
    let state1 = _.assign({}, this.state, { left: !this.state.left });
    this.setState(state1);
  }

  hax(_ev) {
    alert("hax!");
  }

  setTimeoutFunc(status,indisp){
      var that = this;
      //Reffered https://javascript.info/settimeout-setinterval for timer
      setTimeout(function (){
      status[indisp[0]] =  "hide";
      status[indisp[1]] = "hide";
      indisp.splice(0,2);
      that.setState({visibilityStatus: status, indisplay: indisp});
    },1000);
  }

  handleClick(e){
    var id = e.target.id;
    if(this.state.finished.length === 8 || this.state.indisplay.includes(id) || this.state.finished.flat().includes(id)){
      return;
    }
    var status = this.state.visibilityStatus;
    var indisp = this.state.indisplay;
    var complete = this.state.finished;
    var moves = this.state.numOfClicks;

    if(indisp.length < 2){
      status[id] = "show";
      indisp.push(id);
      moves++;

    }

    if(indisp.length === 2){
      if(this.state.Alphabets[indisp[0]] === this.state.Alphabets[indisp[1]]){
        status[indisp[0]] = status[indisp[1]] = "show";

        var removed=indisp.splice(0,2);
        complete.push(removed);
        console.log(this.state.finished);
      }

      else {
        this.setTimeoutFunc(status,indisp);

    }
    }

   this.setState({visibilityStatus: status, indisplay: indisp, finished: complete,numOfClicks:moves});

}

  handleReset(){
    var initialLetters = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];
    let {randomized,status} = this.AssignValues(initialLetters);
    var complete = [];
    var indisp = [];
    this.setState({Alphabets : randomized, indisplay: indisp, finished: complete, visibilityStatus: status,numOfClicks:0});
  }

  render() {
    var allTiles= [];
    var rowWiseTiles = [];
    var tileIndex = 0;
    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {

        var inputLetter = <input type="button"  className="display" id={tileIndex} value={(this.state.visibilityStatus[4*i+j] === "hide" ? "" : this.state.Alphabets[4*i+j])}
        onClick={() => this.handleClick(event)}
         />

        rowWiseTiles.push(inputLetter);
        tileIndex++;
      }
      allTiles.push(rowWiseTiles);
      rowWiseTiles = [];
    }
    return (
      <div>
      <p className ="displayGameDetails"><u>MEMORY GAME </u></p>
      <div className="gridDisplay buttons">
        {allTiles}

      </div>
      <div className= "displayGameDetails">
      No of Clicks : {this.state.numOfClicks}
      <br/>
      Game Status : {this.state.numOfClicks === 0? " Game Not Started" : (this.state.finished.length === 8? "You Won" : "Game In Progress")}
      </div>
      <div>
      <input type="button" className="resetButton" id="resetBtn" value="Reset Game" onClick={()=>this.handleReset()}/>
      </div>
      </div>
    );
  }
}
