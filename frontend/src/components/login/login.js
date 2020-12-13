import './style.css'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { API } from '../../api'
import { GlobalState } from "../../GlobalState"
import { Link, useHistory } from 'react-router-dom'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { VisibilityOff, Visibility} from '@material-ui/icons';
import { Paper, TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core'

export const Login = () => {
    const classes = useStyles()
    const {setUser} = useContext(GlobalState)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [helperText, setHelperText] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)

    const history = useHistory()

    const login = () => {
        // console.log(username, password)
        
        if(username.length && password.length) {
            setError(false)
            setLoading(true)
            
            axios.post(`${API}/users/login`, {
                username, password
            }).then(res => {
                // console.log('Result: ', res.data); 
                setLoading(false)
                localStorage.setItem('user', JSON.stringify(res.data))
                setUser(res.data)
                history.push('/dashboard')
            }).catch(err => {
                console.log(err, 'Status:', err.response); 
                setHelperText(err.response.data)
                setError(true)
                setLoading(false)
            })
        }
    }

    return (
        <div className="login">
            <div className="bg-login" />
            <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-3 paper">
                <Paper className={classes.root}>
                    <h2 style={{marginTop: 0}}>Login</h2>
                    <InputField 
                        error={error}
                        type="text"
                        label="username" 
                        margin="dense" 
                        variant="outlined" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={classes.input} 
                    />
                    <InputField 
                        error={error}
                        type={showPassword ? 'text' : 'password'} 
                        label="password" 
                        margin="dense" 
                        variant="outlined" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={classes.input} 
                        helperText={helperText}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showPassword 
                                        ? <VisibilityOff 
                                            style={{cursor: 'pointer'}} 
                                            fontSize="small"
                                            onClick={() => setShowPassword(!showPassword)} 
                                        /> 
                                        : <Visibility 
                                            style={{cursor: 'pointer'}} 
                                            fontSize="small"
                                            onClick={() => setShowPassword(!showPassword)} 
                                        />
                                    }
                                </InputAdornment>
                            )
                        }}
                    />
                    <div className='d-flex justify-content-between'>
                        <Link to='/register'>
                            <Button variant="outlined" color="primary">
                                Register
                            </Button>
                        </Link>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            endIcon={loading && <CircularProgress size={14} color='inherit' />} 
                            onClick={login}
                        >
                            Sign in
                        </Button>
                    </div>
                </Paper>
            </div>
        </div>
    )
}

const InputField = withStyles({
    root: {
        marginBottom: '1rem', 
        '& .MuiInputBase-root': {
            color: '#fff',
        },
        '& label.MuiFormLabel-root': {
            color: '#aaa'
        },
        '& label.Mui-focused': {
            color: '#fff',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#aaa',
            },
            '&:hover fieldset': {
              borderColor: '#eee',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff',
            },
        },
    },
})(TextField)

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2rem',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '300px',
    }
}))