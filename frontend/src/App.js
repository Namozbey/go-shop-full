import './App.css';
import React, { useEffect, useContext } from 'react'
import { Users } from "./components/users/users"
import { Login } from './components/login/login'
import { AppRoute } from './AppRoute'
import { Register } from './components/register/register'
import { ItemInfo } from "./components/itemInfo/itemInfo"
import { UserInfo } from "./components/userInfo/userInfo"
import { Dashboard } from './components/dashboard/dashboard'
import { Favourites } from "./components/favourites/favourites"
import { GlobalState } from "./GlobalState"
import { ShoppingCart } from "./components/shoppingCart/shoppingCart"
import { HashRouter as Router, Switch } from 'react-router-dom'


function App() {
  const {setUser, setBadges} = useContext(GlobalState)
  const user = localStorage.getItem("user")
  const badges = JSON.parse(localStorage.getItem("badges"))
  
  // console.log(badges)
  localStorage.removeItem("badges")

  useEffect(() => {
    if(user) {
      setUser(JSON.parse(user))
    }

    if(badges) {
      setBadges(badges)
    }
  }, [])

  return (
    <div className="app">
      <Router>
        <Switch>
          <AppRoute type="auth" path='/' exact>
            <Login />
          </AppRoute>
          <AppRoute type="auth" path='/login'>
            <Login />
          </AppRoute>
          <AppRoute type="auth" path='/register'>
            <Register />
          </AppRoute>
          <AppRoute path='/dashboard' exact>
            <Dashboard />
          </AppRoute>
          <AppRoute path='/dashboard/favourites'>
            <Favourites />
          </AppRoute>
          <AppRoute path='/dashboard/shopping-cart'>
            <ShoppingCart />
          </AppRoute>
          <AppRoute path='/dashboard/item-info'>
            <ItemInfo />
          </AppRoute>
          <AppRoute path='/user-info'>
            <UserInfo />
          </AppRoute>
          <AppRoute path='/dashboard/users'>
            <Users />
          </AppRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
