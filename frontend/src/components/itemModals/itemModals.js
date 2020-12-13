import "./style.css"
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { API } from "../../api"
import { useHistory } from "react-router-dom"
import { GlobalState } from '../../GlobalState'
import { 
    Modal,
    Button, 
    Select,
    MenuItem,
    TextField, 
    InputLabel,
    FormControl,
    CircularProgress, 
} from '@material-ui/core'

export const AddItem = (props) => {
    const {user, getItems} = useContext(GlobalState)
    const {
        open,
        onClose, 
        type = "Add", 
        name = "", 
        description = "", 
        price = null, 
        category = "",
        img,
        _id = ""
    } = props

    const [_name, setName] = useState(name)
    const [_description, setDescription] = useState(description)
    const [_price, setPrice] = useState(price)
    const [_category, setCategory] = useState(category)
    const [imgUrl, setImgUrl] = useState(img)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const addOrUpdate = () => {
        setLoading(true)
        setError(false)

        if(type === "Add") {
            axios({
                method: "POST",
                url: `${API}/items/add`,
                headers: {token: user.token},
                data: {
                    name: _name,
                    description: _description,
                    price: _price,
                    category: _category,
                    img: imgUrl,
                }
            }).then(res => {
                setLoading(false)
                // console.log(res.data)
                getItems()
            }).catch(err => {
                setLoading(false)
                setError(true)
                console.log(err)
            })
        } else if(type === "Update") {
            axios({
                method: "put",
                url: `${API}/items/update`,
                headers: {token: user.token},
                data: {
                    name: _name,
                    description: _description,
                    price: _price,
                    category: _category,
                    img: imgUrl,
                    _id
                }
            }).then(res => {
                setLoading(false)
                // console.log(res.data)
                getItems()
                onClose()
            }).catch(err => {
                setLoading(false)
                setError(true)
                console.log(err)
            })
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="add-item">
                <h3 style={{marginTop: 0}}>{type} item</h3>
                <TextField 
                    type="text"
                    label="name" 
                    margin="dense" 
                    variant="outlined" 
                    value={_name}
                    error={error}
                    onChange={e => setName(e.target.value)}
                    // helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                />
                <TextField 
                    type="text"
                    label="description" 
                    margin="dense" 
                    variant="outlined" 
                    value={_description}
                    error={error}
                    onChange={e => setDescription(e.target.value)}
                    // helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                />
                <TextField 
                    type="number"
                    label="price (USD)" 
                    margin="dense" 
                    variant="outlined" 
                    value={_price}
                    error={error}
                    onChange={e => setPrice(e.target.value)}
                    // helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                />
                <FormControl variant="outlined" margin="dense" error={error}>
                    <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={_category}
                        onChange={e => setCategory(e.target.value)}
                        label="Category"
                    >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="tv">TV</MenuItem>
                    <MenuItem value="watch">Watch</MenuItem>
                    <MenuItem value="headphones">Headphones</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
                <TextField 
                    type="text"
                    label="image url (optional)" 
                    margin="dense" 
                    variant="outlined" 
                    value={imgUrl}
                    error={error}
                    onChange={e => setImgUrl(e.target.value)}
                    // helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                />
                <div className='d-flex justify-content-between mt-2'>
                    <Button variant="outlined" color="primary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        onClick={addOrUpdate}
                        endIcon={loading && <CircularProgress size={14} color='inherit' />} 
                    >
                        {type}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export const DeleteItem = ({_id, open, onClose, path}) => {
    const {user, getItems} = useContext(GlobalState)
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const deleteItem = () => {
        setLoading(true)

        axios({
            method: "delete",
            url: `${API}/items/delete`,
            headers: {token: user.token},
            data: {_id}
        }).then(() => {
            setLoading(false)
            getItems()
            onClose()
            if(path === "item-info") {
                history.goBack()
            }
        }).catch(err => console.log(err))
    }


    return(
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="add-item">
                <h3>Dou you really want to delete</h3>
                <div className='d-flex justify-content-between mt-2'>
                    <Button variant="outlined" color="primary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        color="secondary" 
                        variant="contained" 
                        onClick={deleteItem}
                        endIcon={loading && <CircularProgress size={14} color='inherit' />} 
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    )
}