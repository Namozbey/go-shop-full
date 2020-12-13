import "./style.css"
import React, {useContext, useState, useEffect} from "react"
import axios from "axios"
import { API } from "../../api"
import DeleteIcon from '@material-ui/icons/Delete'
import { GlobalState } from "../../GlobalState"
import { IconButton, LinearProgress, CircularProgress } from "@material-ui/core"

export const ShoppingCart = () => {
    const {user, badges, setBadges} = useContext(GlobalState)

    const [items, setItems] = useState("")
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        getItems()
        // console.log("user changed")
    }, [user])

    useEffect(() => {
        setBadges({...badges, shop: false})
        localStorage.setItem("badges", JSON.stringify({...badges, shop: false}))
    }, [])

    const getItems = () => {
        axios({
            method: "get",
            url: `${API}/items/shopping-cart`,
            headers: {token: user.token}
        }).then(res => {
            setLoading(null)
            setItems(res.data.reverse())
        }).catch(err => console.log(err))
    }

    const handleDeleteFromShop = (_id, index) => {
        setLoading(index)
        axios({
            method: "delete",
            url: `${API}/items/shopping-cart`,
            headers: {token: user.token},
            data: {_id}
        }).then(() => {
            getItems()
        }).catch(err => console.log(err))
    }

    return (
        <div className="container-fluid container-md mt-2">
            {items.length ? items.map(({name, price, description, updatedAt, category, img, _id}, index) => (
                <>
                    <div className="row" key={index}>
                        <div className="col-4">
                            <div className="img-content">
                                <img src={img} alt="item image" />
                                <div className="delete-button">
                                    <IconButton 
                                        color="secondary"
                                        aria-label="delete" 
                                        onClick={() => handleDeleteFromShop(_id, index)} 
                                    >
                                        {loading === index 
                                            ? <CircularProgress size={20} color='secondary' /> 
                                            : <DeleteIcon />
                                        }
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <h4 className="mb-4">{name}</h4>
                            <div className="price-date">
                                <h5>${price}</h5>
                                <p>{updatedAt.slice(0,10)}</p>
                            </div>
                            <p><b>Category:</b> {category}</p>
                            <p>{description}</p>
                        </div>
                    </div>
                    {items.length !== index + 1 && <hr className="my-2" />}
                </>
            )) : items === "" ? (
                <LinearProgress color="secondary" style={{marginTop: "-0.5rem"}} />
            ) : (
                <div className="nothing-found">
                    <h2>Nothing has found</h2>
                </div>
            )}
        </div>
    )
}