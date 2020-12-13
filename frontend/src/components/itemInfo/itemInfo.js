import "./style.css"
import React, { useEffect, useState, useContext } from "react"
import axios from 'axios'
import { API } from "../../api"
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { IconButton } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import { AddItem, DeleteItem } from "../itemModals/itemModals"
import { useLocation, useHistory } from "react-router-dom"
import { GlobalState, defaultImg } from "../../GlobalState"

export const ItemInfo = () => {
    const {state} = useLocation()
    const history = useHistory()
    const {user, items, badges, setBadges} = useContext(GlobalState)

    const {index, _fav, _shop_cart} = state ? state : emptyState
    const {
        name, price, description, img, editable, fav, shop_cart, _id, updatedAt, category
    } = items[index] ? items[index] : emptyItems

    const [favourite, setFavourite] = useState(_fav)
    const [shoppingCart, setShoppingCart] = useState(_shop_cart)

    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    
    useEffect(() => {
        if(!state) {
            history.goBack()
        }
    }, [])

    const handleDelete = () => {
        setDeleteModal(true)
    }

    const isFav = () => {
        if(favourite === undefined) {
            return fav
        } else {
            return favourite
        }
    }
    
    const inShopCart = () => {
        if(shoppingCart === undefined) {
            return shop_cart
        } else {
            return shoppingCart
        }
    }

    const addToFav = () => {
        if(isFav()) {
            setFavourite(false)
            axios({
                method: "delete",
                url: `${API}/items/favourite`,
                headers: {token: user.token},
                data: {_id}
            }).then(() => {
                setBadges({...badges, fav: true})
                localStorage.setItem("badges", JSON.stringify({...badges, fav: true}))
            }).catch(err => {
                console.log(err)
                setFavourite(true)
            })
        } else {
            setFavourite(true)
            axios({
                method: "put",
                url: `${API}/items/favourite`,
                headers: {token: user.token},
                data: {_id}
            }).then(() => {
                setBadges({...badges, fav: true})
                localStorage.setItem("badges", JSON.stringify({...badges, fav: true}))
            }).catch(err => {
                console.log(err)
                setFavourite(false)
            })
        }
    }

    const addToShopCart = () => {
        if(inShopCart()) {
            setShoppingCart(false)
            axios({
                method: "delete",
                url: `${API}/items/shopping-cart`,
                headers: {token: user.token},
                data: {_id}
            }).then(() => {
                setBadges({...badges, shop: true})
                localStorage.setItem("badges", JSON.stringify({...badges, shop: true}))
            }).catch(err => {
                console.log(err)
                setShoppingCart(true)
            })
        } else {
            setShoppingCart(true)
            axios({
                method: "put",
                url: `${API}/items/shopping-cart`,
                headers: {token: user.token},
                data: {_id}
            }).then(() => {
                setBadges({...badges, shop: true})
                localStorage.setItem("badges", JSON.stringify({...badges, shop: true}))
            }).catch(err => {
                console.log(err)
                setShoppingCart(false)
            })
        }
    }

    const ButtonsContent = ({children}) => {
        return (
            <>
                {editable 
                    ? <div className="d-flex flex-wrap justify-content-between justify-content-sm-end">
                        {children}
                    </div>
                    :<div className="d-flex flex-wrap justify-content-end">
                        {children}
                    </div>
                }
            </>
        )
    }

    return (
        <div className="container-fluid container-md mt-4">
            <div className="row">
                <div className="col-12 col-sm-5">
                    <div className="img-content">
                        <img 
                            src={img} 
                            alt="item image"
                            onError={e => {
                                e.target.onerror = null; 
                                e.target.src = defaultImg;
                            }} 
                        />
                    </div>
                </div>
                <div className="col-12 col-sm-7">
                    <h3 className="mb-4">{name}</h3>
                    <div className="price-date">
                        <h4>${price}</h4>
                        <p className="size-20">{updatedAt.slice(0,10)}</p>
                    </div>
                    <p className="size-20"><b>Category:</b> {category}</p>
                    <p className="size-20">{description}</p>
                    <ButtonsContent>
                        <IconButton 
                            color="secondary"
                            aria-label="favorite" 
                            onClick={addToFav} 
                        >
                            {isFav() ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <IconButton 
                            color="primary"
                            aria-label="shopping cart" 
                            onClick={addToShopCart} 
                        >
                            {inShopCart() ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
                        </IconButton>
                        {editable && 
                        <IconButton 
                            // color="primary"
                            aria-label="edit" 
                            onClick={() => setUpdateModal(true)} 
                        >
                            <EditIcon />
                        </IconButton>}
                        {editable && 
                        <IconButton 
                            color="secondary"
                            aria-label="delete" 
                            onClick={handleDelete} 
                        >
                            <DeleteIcon />
                        </IconButton>}
                    </ButtonsContent>
                </div>
            </div>
            {updateModal && 
            <AddItem 
                type="Update"
                open={updateModal}
                onClose={() => setUpdateModal(false)}
                {...items[index]}
            />}
            {deleteModal && 
            <DeleteItem
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                _id={_id}
                path="item-info"
            />}
        </div>
    )
}

const emptyItems = {
    name: "", price: "", description: "", img: "", editable: "", 
    fav: "", shop_cart: "", _id: "", updatedAt: "", category: ""
}

const emptyState = {index: 0, _fav: "", _shop_cart: ""}