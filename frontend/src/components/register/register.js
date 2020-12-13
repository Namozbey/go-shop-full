import './style.css'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { API } from '../../api'
import { GlobalState } from "../../GlobalState"
import { Link, useHistory } from 'react-router-dom'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { VisibilityOff, Visibility} from '@material-ui/icons';
import { Paper, TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core'

export const Register = () => {
    const classes = useStyles()
    const {setUser} = useContext(GlobalState)
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const [errorIndexs, setErrorIndexs] = useState({
        firstname: 0,
        lastname: 0,
        username: 0,
        password: 0,
        confirmPass: 0,
    })
    
    const history = useHistory()

    const reg = () => {
        setLoading(true)

        if(password === confirmPass) {
            axios.post(`${API}/users/reg`, {
                firstname,
                lastname,
                username,
                password,
            }).then(res => {
                // console.log('Result: ', res.data);
                setUser(res.data)
                localStorage.setItem('user', JSON.stringify(res.data))
                setLoading(false)
                history.push('/dashboard')
            }).catch(err => {
                console.log(err.response.data)
                setErrorIndexs(err.response.data)
                // setHelperText(err.response.data)
                // setError(true)
                setLoading(false)
            })
        } else {
            setErrorIndexs({...errorIndexs, confirmPass: 4})
        }
    }

    const onChangeFirstname = val => {
        setErrorIndexs({...errorIndexs, firstname: /^[a-zA-Z]+$/.test(val) || !val.length ? 0 : 5});
        setFirstname(val)
    }

    const onChangeLastname = val => {
        setErrorIndexs({...errorIndexs, lastname: /^[a-zA-Z]+$/.test(val) || !val.length ? 0 : 5});
        setLastname(val)
    }

    return (
        <div className="register">
            <div className="bg-reg" />
            <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-3 paper">
                <Paper className={classes.root}>
                    <h2 style={{marginTop: 0}}>Register</h2>
                    <InputField 
                        type="text"
                        label="Firstname" 
                        margin="dense" 
                        variant="outlined" 
                        value={firstname} 
                        error={errorIndexs.firstname}
                        onChange={e => onChangeFirstname(e.target.value)}
                        helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                    />
                    <InputField 
                        type="text"
                        label="Lastname" 
                        margin="dense" 
                        variant="outlined" 
                        value={lastname} 
                        error={errorIndexs.lastname}
                        onChange={e => onChangeLastname(e.target.value)}
                        helperText={Boolean(errorIndexs.lastname) && errors[errorIndexs.lastname]}
                    />
                    <InputField 
                        type="text"
                        label="Username" 
                        margin="dense" 
                        variant="outlined" 
                        value={username} 
                        error={errorIndexs.username}
                        onChange={e => setUsername(e.target.value)}
                        helperText={Boolean(errorIndexs.username) && errors[errorIndexs.username]}
                    />
                    <InputField 
                        type={showPassword ? "text" : "password"}
                        label="Password" 
                        margin="dense" 
                        variant="outlined" 
                        value={password} 
                        error={errorIndexs.password}
                        onChange={e => setPassword(e.target.value)}
                        helperText={Boolean(errorIndexs.password) && errors[errorIndexs.password]}
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
                    <InputField 
                        type={showConfirmPass ? "text" : "password"}
                        label="Confirm password" 
                        margin="dense" 
                        variant="outlined" 
                        value={confirmPass} 
                        error={errorIndexs.confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        helperText={Boolean(errorIndexs.confirmPass) && errors[errorIndexs.confirmPass]}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showConfirmPass 
                                        ? <VisibilityOff 
                                            style={{cursor: 'pointer'}} 
                                            fontSize="small"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)} 
                                        /> 
                                        : <Visibility 
                                            style={{cursor: 'pointer'}} 
                                            fontSize="small"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)} 
                                        />
                                    }
                                </InputAdornment>
                            )
                        }}
                    />
                    <div className='d-flex justify-content-between'>
                        <Link to='/login'>
                            <Button variant="outlined" color="primary">
                                Login
                            </Button>
                        </Link>
                        <Button 
                            color="primary" 
                            variant="contained" 
                            onClick={reg}
                            endIcon={loading && <CircularProgress size={14} color='inherit' />} 
                        >
                            Sign up
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
        // '& label.MuiInputLabel-outlined': {
        //     transform: 'translate(14px, 14px) scale(1)'
        // },
        // '& input.MuiInputBase-input.MuiOutlinedInput-input': {
        //     paddingTop: "14px",
        //     paddingBottom: "14px",
        // },
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
        width: '100%'
    }
}))

const errors = {
    "1": "kamida 3 ta belgidan iborat bo'lishi kerak",
    "2": "Parol 5 ta belgidan kam bo'lmasligi kerak",
    "3": "Username alaqachon mavjud",
    "4": "Tasdiqlash paroli xato kiritilgan",
    "5": "Mumkin bo'lmagan belgidan foydalanilgan",
}