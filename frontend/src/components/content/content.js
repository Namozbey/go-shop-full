import './style.css'
import React, { useState, useContext } from 'react'
import Fade from 'react-reveal/Fade'
import axios from 'axios'
import { API } from "../../api"
import { Link } from "react-router-dom"
import EditIcon from '@material-ui/icons/Edit'
import Skeleton from '@material-ui/lab/Skeleton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { textMarker } from "../../textMarker"
import { makeStyles } from '@material-ui/core/styles'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import { AddItem, DeleteItem } from "../itemModals/itemModals"
import { GlobalState, defaultImg } from "../../GlobalState"
import { Paper, Button, ButtonGroup } from '@material-ui/core'
// import defaultImg from "../../assets/img/image-not-found.jpg"

export const Content = () => {
    const classes = useStyles()
    const {items, user, badges, setBadges, searchText} = useContext(GlobalState)

    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const [item, setItem] = useState({})
    const [_id, setId] = useState("")

    const [favs, setFavs] = useState({})
    const [shopCart, setShopCart] = useState({})

    const handleUpdate = (val) => {
        setItem(val)
        setUpdateModal(true)
    }

    const handleDelete = (id) => {
        setId(id)
        setDeleteModal(true)
    }

    const isFav = (i, fav) => {
        if(favs[i] === undefined) {
            return fav
        } else {
            return favs[i]
        }
    }

    const inShopCart = (i, shop_cart) => {
        if(shopCart[i] === undefined) {
            return shop_cart
        } else {
            return shopCart[i]
        }
    }

    const addToFav = (_id, index, fav) => {
        if(isFav(index, fav)) {
            setFavs({...favs, [index]: false})
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
                setFavs({...favs, [index]: true})
            })
        } else {
            setFavs({...favs, [index]: true})
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
                setFavs({...favs, [index]: false})
            })
        }
    }

    const addToShopCart = (_id, index, shop_cart) => {
        if(inShopCart(index, shop_cart)) {
            setShopCart({...shopCart, [index]: false})
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
                setShopCart({...shopCart, [index]: true})
            })
        } else {
            setShopCart({...shopCart, [index]: true})
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
                setShopCart({...shopCart, [index]: false})
            })
        }
    }

    return (
        <div className="content">
            <h5>{items.length && items[1].alone ? 1 : items.length} results</h5>
            <div className="row">
                <Fade bottom cascade>
                    {items.length ? items.map((item, i) => {
                        const {name, price, description, img, editable, fav, shop_cart, _id, alone} = item
                        return (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 item" key={i}>
                                {!alone && <Paper elevation={1} className={classes.paper}>
                                    <div className="img-content">
                                    <Link to={{
                                        pathname: "/dashboard/item-info", 
                                        state: {index: i, _fav: favs[i], _shop_cart: shopCart[i]}
                                    }}>
                                        <img 
                                            src={img} 
                                            alt="item image" 
                                            onError={e => {
                                                e.target.onerror = null; 
                                                e.target.src = defaultImg;
                                            }}
                                        />
                                    </Link>
                                        {editable &&
                                            <ButtonGroup size="small" className={classes.btngroup} variant="text" color="primary">
                                                <Button onClick={() => handleUpdate(item)}>
                                                    <EditIcon size="small" />
                                                </Button>
                                                <Button onClick={() => handleDelete(_id)} color="secondary">
                                                    <DeleteIcon size={10} />
                                                </Button>
                                            </ButtonGroup>
                                        }
                                    </div>
                                    <div>
                                        <h6 className="font-weight-bold text-dark">${price}</h6>
                                        <h6 className="truncate font-weight-bolder m-0 pb-1 text-dark">
                                            {textMarker(name, searchText)}
                                        </h6>
                                        <p className="truncate">{textMarker(description, searchText)}</p>
                                    </div>
                                    <div className="paper-footer">
                                        <ButtonGroup fullWidth={true} variant="text" aria-label="text primary button group">
                                            <Button onClick={() => addToFav(_id, i, fav)} color="secondary">
                                                {isFav(i, fav) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                            </Button>
                                            <Button onClick={() => addToShopCart(_id, i, shop_cart)} color="primary">
                                                {inShopCart(i, shop_cart) ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </Paper>}
                            </div>
                        )
                    }) : arr.map((v,i) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={i}>
                            <Skeleton variant="rect" animation="wave" height={140} />
                            <Skeleton animation="wave" width="40%" height={10} style={{marginTop: 5}} />
                            <Skeleton animation="wave" width="60%" height={10} style={{marginTop: 5}} />
                            <Skeleton animation="wave" width="95%" height={10} style={{marginTop: 5}} />
                        </div>
                    ))}
                </Fade>
            </div>
            {updateModal && 
            <AddItem 
                type="Update"
                open={updateModal}
                onClose={() => setUpdateModal(false)}
                {...item}
            />}
            {deleteModal && 
            <DeleteItem
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                _id={_id}
            />}
        </div>
    )
}

const useStyles = makeStyles({
    paper: {
        padding: "1rem",
        color: "#626262",
        borderRadius: '10px',
        overflow: "hidden",
        // width: '100%'
    },
    btngroup: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff'
    }
})

const arr = ["","","","","","","","","","","",""]