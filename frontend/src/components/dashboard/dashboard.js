import './style.css'
import React, { useState, useEffect, useContext } from 'react'
import logo from "../../assets/img/logo.png"
import CloseIcon from '@material-ui/icons/Close'
import { Content } from "../content/content"
import SelectAllIcon from '@material-ui/icons/SelectAll'
import { makeStyles } from '@material-ui/core/styles'
import { GlobalState } from "../../GlobalState"
import { 
    Paper,
    Radio,
    Drawer,
    Slider,
    Avatar,
    Checkbox,
    IconButton, 
    Typography,
    RadioGroup,
    LinearProgress,
    FormControlLabel,
} from '@material-ui/core'

const pricetext = value => {
    return `$${value}`
}

export const Dashboard = () => {
    const classes = useStyles()
    const {user, fetching, openSidebar, setOpenSidebar, price, setPrice, getItems, setCategory} = useContext(GlobalState)

    const [byPrice, setByPrice] = useState("all");
    const [selectedAll, setSelectedAll] = useState(false)
    const [checked, setChecked] = useState({
        phone: true,
        laptop: true,
        tv: true,
        watch: true,
        headphones: true,
        other: true
    })

    useEffect(() => {
        if(user.token.length) {
            getItems()
        }
    }, [user.token])

    useEffect(() => {
        let _category = [];
        
        for(let key in checked) {
            if(checked[key]) _category.push(key);
        }

        setCategory(_category)

    }, [checked])

    useEffect(() => {
        setPrice({...price, all: byPrice === "all" ? true : false})
    }, [byPrice])
    
    const handleSelectAll = () => {
        setChecked({
            phone: selectedAll,
            laptop: selectedAll,
            tv: selectedAll,
            watch: selectedAll,
            headphones: selectedAll,
            other: selectedAll,
        })
        setSelectedAll(!selectedAll)
    }

    const handleChangeCheckbox = e => {
        setChecked({...checked, [e.target.name]: e.target.checked})
    }

    const SidebarContent = () => (
        <>
            <h5>Filters</h5>
            <Paper elevation={1} className={classes.paper}>
                <h5>By price</h5>
                <RadioGroup 
                    aria-label="gender" 
                    name="gender1" 
                    value={byPrice} 
                    onChange={e => setByPrice(e.target.value)}
                >
                    <FormControlLabel 
                        value="all" 
                        control={<Radio color="primary" />} 
                        label="All"
                        style={{marginBottom: 0}} 
                    />
                    <FormControlLabel 
                        value="custom" 
                        control={<Radio color="primary" />} 
                        label="Custom" 
                    />
                </RadioGroup>
                <Slider
                    value={price.custom}
                    onChange={(event, newValue) => setPrice({all: price.all, custom: newValue})}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={() => pricetext(price.custom)}
                    max={1000}
                    disabled={byPrice !== "custom"}
                />
                <hr />
                <div className="by-type-label">
                    <h5>By category</h5>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        style={{marginRight: '-12px'}}
                        onClick={handleSelectAll}
                    >
                        <SelectAllIcon />
                    </IconButton>
                </div>
                <div className="by-type-content">
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.phone}
                            onChange={handleChangeCheckbox}
                            name="phone"
                            color="primary"
                        />
                        }
                        label="Phone"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.laptop}
                            onChange={handleChangeCheckbox}
                            name="laptop"
                            color="primary"
                        />
                        }
                        label="Laptop"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.tv}
                            onChange={handleChangeCheckbox}
                            name="tv"
                            color="primary"
                        />
                        }
                        label="TV"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.watch}
                            onChange={handleChangeCheckbox}
                            name="watch"
                            color="primary"
                        />
                        }
                        label="Watch"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.headphones}
                            onChange={handleChangeCheckbox}
                            name="headphones"
                            color="primary"
                        />
                        }
                        label="Headphones"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={checked.other}
                            onChange={handleChangeCheckbox}
                            name="other"
                            color="primary"
                        />
                        }
                        label="Other"
                    />
                </div>
            </Paper>
        </>
    )

    return (
        <>
            {fetching ? <LinearProgress color="secondary" /> : <div style={{padding: '2px'}} />}
            <div className="dashboard">
                <div className={classes.sidebar}>
                    <SidebarContent />
                </div>
                <Drawer anchor="left" open={openSidebar} onClose={() => setOpenSidebar(false)}>
                    <div className={classes.drawerSidebar}>
                        <div className="d-flex justify-content-between align-items-center sidebar-header">
                            <div className="d-flex align-items-center">
                                <Avatar alt="Logo" src={logo} />
                                <Typography variant="h6" style={{marginLeft: '0.5rem'}} noWrap>
                                    Go Shop
                                </Typography>
                            </div>
                            <IconButton color="inherit" onClick={() => setOpenSidebar(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <SidebarContent />
                    </div>
                </Drawer>
                <Content />
            </div>
        </>
    )
}

const useStyles = makeStyles(theme => ({
    sidebar: {
        display: 'none',
        width: "350px",
        padding: "1rem",
        [theme.breakpoints.up('md')]: {
          display: 'block',
        },
    },
    drawerSidebar: {
        display: 'block',
        width: "250px",
        padding: "1rem",
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
    },
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
}))
