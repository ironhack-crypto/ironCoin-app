import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import CoinList from './LastApiData.json'
import 'bulma/css/bulma.css';
import Home from './components/home/Home';
import CoinPage from './components/graphPage/graphPage.js';
import Ticker from './components/Ticker';
import axios from 'axios';
import Navbar from './components/nav/Navbar';
import Contact from './components/contact/Contact'
import MarketPage from './components/marketPage/MarketPage'
import regression from 'regression';

class App extends Component {

  state = {
    coins: [], 
    models: []
  }

  //SERVER PROMISE-REQUEST==========================================
  componentDidMount() {
    axios
      .get(// TAKE COMMENT OFF WHEN DEPLOYING AND PUT IN LIVE API!! vvvvv
        // "https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=be474ff9-0c14-4391-8ae4-c85c6eabda97"
      ).then(response => {
        this.generateModel(0, response.data.data)
        // this.setState({ //set state to coin list. Data twice because of how the objects are designed in API
        //   coins: response.data.data,
        // })//end setstate
      })//end then
      .catch((err) => {
        this.generateModel(0, CoinList)
        this.generateModel(1, CoinList)
        this.generateModel(2, CoinList)
      });
  }
  // =================================================================
  generateModel = (ind, CoinList) => {
    let week = CoinList[ind]?.quote.USD.price * (1 - (CoinList[ind]?.quote.USD.percent_change_7d / 100))
    let day = CoinList[ind]?.quote.USD.price * (1 - (CoinList[ind]?.quote.USD.percent_change_24h / 100))
    let hour = CoinList[ind]?.quote.USD.price * (1 - (CoinList[ind]?.quote.USD.percent_change_1h / 100))
    let curr = Math.floor(CoinList[ind]?.quote.USD.price * 100) / 100
    let name = CoinList[ind].name
    let data = []
    let msInWeek = 60 * 60 * 24 * 7 * 1000;
    let msInDay = msInWeek / 7;
    let msInHour = msInDay / 24;
    for (let i = 0; i < msInWeek; i += 1000)
      data.push([i, week])

    for (let j = 0; j < msInDay; j += 1000)
      data.push([j + msInWeek, day])

    for (let k = 0; k < msInHour; k += 1000)
      data.push([k + msInWeek + msInDay, hour])

    data.push([msInWeek + msInDay + msInHour + 1000, curr])
    let modelsList = [...this.state.models]
    console.log(regression.polynomial([[1, week], [2, day], [3, hour], [4, curr]], { order: 4 }))
    modelsList.push(regression.polynomial([[1, week], [2, day], [3, hour], [4, curr]], { order: 4 }))
    //const result = { [name]: regression.polynomial([[1, week], [2, day], [3, hour], [4, curr]], { order: 4 }) }; //1 week ago needs to be many points, but one hour is less seconds
    this.setState({// sets the state to default JSON file if error is returned
      models: modelsList,
      coins: CoinList
    })
  }



  render() {
    //CODE TO PRINT ENTIRE OBJECT FROM API CALL====================================================  
    // let str = JSON.stringify(this.state.coins);
    // str = JSON.stringify(this.state.coins, null, 4); // (Optional) beautiful indented output.
    // console.log(str); // Logs output to dev tools console.
    // alert(str);
    // ================================================================================================



    return (
      <div >
        <Navbar coins={this.state.coins} />
        <Switch>
          <Route exact path="/" render={(props) => <Home coins={this.state.coins} models={this.state.models} {...this.state.coins} />} />
          <Route exact path="/market" render={(props) => <MarketPage coins={this.state.coins} {...props} />} />
          <Route path="/coin" render={(props) => <CoinPage coins={this.state.coins} {...props} />} />
          <Route path="/contact" render={(props) => <Contact coins={this.state.coins}  {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default App;

//axios.get('https://ironrest.herokuapp.com/findOne/shane?hello=Mike').then(res => console.log(res))