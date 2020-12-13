import "./style.css"
import React, { useState, useContext, useEffect } from "react"
import axios from 'axios'
import { API } from '../../api'
import { GlobalState } from "../../GlobalState"
import { VisibilityOff, Visibility} from '@material-ui/icons';
import { TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core'

export const UserInfo = () => {
    const {user, setUser} = useContext(GlobalState)
    
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const [errorIndexs, setErrorIndexs] = useState({
        firstname: 0,
        lastname: 0,
        password: 0,
        confirmPass: 0,
    })

    useEffect(() => {
        setFirstname(user.firstname)
        setLastname(user.lastname)
    }, [user])

    const update = () => {
        if(password === confirmPass) {
            setLoading(true)
            let newUser = {
                token: user.token,
                firstname,
                lastname,
                permission: user.permission
            }

            axios({
                method: 'put',
                url: `${API}/users/edit`,
                headers: {token: user.token},
                data: {
                    firstname,
                    lastname,
                    password,
                }
            }).then(() => {
                localStorage.setItem('user', JSON.stringify(newUser))
                setUser(newUser)
                setLoading(false)
                setErrorIndexs({
                    firstname: 0,
                    lastname: 0,
                    password: 0,
                    confirmPass: 0,
                })
                // console.log("success")
            }).catch(err => {
                if(err.response.status === 400) {
                    setErrorIndexs(err.response.data)
                }
                setLoading(false)
            })
        } else {
            setErrorIndexs({...errorIndexs, confirmPass: 4})
        }
    }

    return (
        <div className="d-flex justify-content-center mt-3">
            <div className="col-11 col-sm-9 col-mg-7 col-lg-5 col-xl-3 d-flex flex-column">
                <h2 style={{marginTop: 0}}>Edit</h2>
                <TextField 
                    type="text"
                    label="Firstname" 
                    margin="dense" 
                    // variant="outlined" 
                    // style={{marginTop: "1rem"}}
                    value={firstname} 
                    error={errorIndexs.firstname}
                    onChange={e => setFirstname(e.target.value)}
                    helperText={Boolean(errorIndexs.firstname) && errors[errorIndexs.firstname]}
                />
                <TextField 
                    type="text"
                    label="Lastname" 
                    margin="dense" 
                    // variant="outlined" 
                    style={{marginTop: "1rem"}}
                    value={lastname} 
                    error={errorIndexs.lastname}
                    onChange={e => setLastname(e.target.value)}
                    helperText={Boolean(errorIndexs.lastname) && errors[errorIndexs.lastname]}
                />
                <TextField 
                    type={showPassword ? "text" : "password"}
                    label="Password" 
                    margin="dense" 
                    // variant="outlined" 
                    style={{marginTop: "1rem"}}
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
                <TextField 
                    type={showConfirmPass ? "text" : "password"}
                    label="Confirm password" 
                    margin="dense" 
                    // variant="outlined" 
                    style={{marginTop: "1rem"}}
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
                <div className='d-flex justify-content-end'>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        style={{marginTop: "1rem"}}
                        onClick={update}
                        endIcon={loading && <CircularProgress size={14} color='inherit' />} 
                    >
                        Update
                    </Button>
                </div>
            </div>
        </div>
    )
}

const errors = {
    "1": "kamida 3 ta belgidan iborat bo'lishi kerak",
    "2": "Parol 5 ta belgidan kam bo'lmasligi kerak",
    "4": "Tasdiqlash paroli xato kiritilgan",
    "5": "Mumkin bo'lmagan belgidan foydalanilgan",
}