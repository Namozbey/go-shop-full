import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API } from "./api"

export const GlobalState = createContext()

export const Provider = ({children}) => {
    const [user, setUser] = useState({token: "", firstname: "", lastname: ""})
    const [items, setItems] = useState([])
    const [searchText, setSearchText] = useState("")
    const [badges, setBadges] = useState({fav: false, shop: false})
    const [openSidebar, setOpenSidebar] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [category, setCategory] = useState(["phone", "laptop", "tv", "watch", "headphones", "other"])
    const [price, setPrice] = useState({all: true, custom: [50, 600]})
    
    useEffect(() => {
        setFetching(true)
        getItems()
    }, [category, price, searchText])

    const getItems = () => {
        let _price = price.all ? [0, 1000000] : price.custom

        axios({
            method: "GET",
            url: `${API}/items/?price=${JSON.stringify(_price)}&category=${JSON.stringify(category)}&search=${searchText}`,
            headers: {token: user.token}
        }).then(({data}) => {
            // console.log(data)
            setItems(data.length === 1 ? [...data, {alone: true}] : data.reverse())
            setFetching(false)
        }).catch(err => console.log(err))
    }

    return (
        <GlobalState.Provider value={{
            user,
            setUser: val => setUser(val),
            items,
            getItems,
            // setItems: val => setItems(val),
            badges,
            setBadges: val => setBadges(val),
            openSidebar,
            setOpenSidebar: val => setOpenSidebar(val),
            price,
            setPrice: val => setPrice(val),
            category,
            setCategory: val => setCategory(val),
            searchText, 
            setSearchText: val => setSearchText(val),
            fetching,
        }}>
            {children}
        </GlobalState.Provider>
    )
}

export const defaultImg = "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg"