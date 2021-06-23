import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  
  state = {
    manager : '', 
    players : [], 
    balance : '', 
    value : '', 
    message : ''
  };

  async componentDidMount ()  {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Waiting on transaction success....'});
    await lottery.methods.pickWinner().send({
      from : accounts[0]
    });

    this.setState({ message : 'A winner has been picked!!!'});
  }

  onSubmit = async (event) =>  {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message : 'You have been entered successfully'});
  };
  render() {
    console.log(web3.version);
  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>
        This contract is managed by { this.state.manager }.
        __{this.state.players.length}__ no. of players take part in the lottery
        For a price money of {web3.utils.fromWei(this.state.balance, 'ether')} ether!
      </p>
      <hr/>

      <form onSubmit = {this.onSubmit}>
        <h4>Want to try your luck!</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
          value = {this.state.value}
          onChange = {event => this.setState({ value : event.target.value})}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr/>
      <h3>{this.state.message}</h3>
      <hr/>

      <h4>Ready to pick a winner ?</h4>
      <button onClick = {this.onClick} >Pick a winner!</button>
    </div>
  );
 }
}
export default App;
