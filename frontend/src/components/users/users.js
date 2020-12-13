import "./style.css"
import { useState, useContext, useEffect } from "react"
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar'
import { API } from '../../api'
import PersonIcon from '@material-ui/icons/Person'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { GlobalState } from "../../GlobalState"
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import { 
    List,
    Divider,
    ListItem, 
    IconButton, 
    ListItemText, 
    ListItemAvatar, 
    LinearProgress,
    CircularProgress, 
} from '@material-ui/core'


export const Users = () => {
    const classes = useStyles();
    const {user} = useContext(GlobalState)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(null)

    const history = useHistory()

    useEffect(() => {
        getUsers();
    }, [user])

    const getUsers = () => {
        axios({
            method: "get",
            url: `${API}/users/`,
            headers: {token: user.token}
        }).then(res => {
            setUsers(res.data.reverse())
        }).catch(err => console.log(err))
    }

    const setPermission = (permission, index, username) => {
        setLoading(index)
        if(permission === "admin") {
            axios({
                method: "post",
                url: `${API}/users/setUser`,
                headers: {token: user.token},
                data: {username}
            }).then(res => {
                if(res.data === "success") {
                    setUsers(users.map((v,i) => ({...v, permission: i === index ? "user" : v.permission})))
                    setLoading(null)
                }
            }).catch(err => {
                console.log(err)
                if(err.response.status === 401) {
                    history.push('/login')
                }
            })
        } else if(permission === "user") {
            axios({
                method: "post",
                url: `${API}/users/setAdmin`,
                headers: {token: user.token},
                data: {username}
            }).then(res => {
                if(res.data === "success") {
                    setUsers(users.map((v,i) => ({...v, permission: i === index ? "admin" : v.permission})))
                    setLoading(null)
                }
            }).catch(err => {
                console.log(err)
                if(err.response.status === 401) {
                    history.push('/login')
                }
            })
        }
    }

    return (
        <div className="d-flex justify-content-center mt-2">
            <div className="col-12 col-sm-10 col-mg-8 col-lg-6 col-xl-4 d-flex flex-column p-0">
                <List className={classes.root}>
                    {users.length ? users.map(({firstname, lastname, username, createdAt, updatedAt, permission}, i) => (
                        <div className="w-100" key={i}>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>{firstname[0].toUpperCase()}{lastname[0].toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <div className="d-flex flex-wrap justify-content-between w-100 align-items-center">
                                    <ListItemText primary={`${firstname} ${lastname}`} secondary={username} />
                                    <div>
                                        <p className="m-0 size-14">Update: {updatedAt.slice(0,10)}</p>
                                        <p className="m-0 size-14">Create: {createdAt.slice(0,10)}</p>
                                    </div>
                                </div>
                                {user.permission === "owner" && 
                                <IconButton 
                                    color="primary"
                                    aria-label="admin" 
                                    style={{marginLeft: 5}}
                                    onClick={() => setPermission(permission, i, username)} 
                                >
                                    {loading === i
                                        ? <CircularProgress size={20} />
                                        : permission === "admin" 
                                        ? <PersonIcon />
                                        : <PermIdentityIcon />
                                    }
                                </IconButton>}
                            </ListItem>
                            {users.length - 1 !== i && 
                                <Divider style={{marginRight: 16}} variant="inset" component="li" />
                            }
                        </div>
                    )) : (
                        <LinearProgress color="secondary" style={{marginTop: "-0.5rem"}} />
                    )}
                </List>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 0,
    },
}));
