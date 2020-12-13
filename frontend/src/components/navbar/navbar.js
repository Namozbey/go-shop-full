import "./style.css"
import React, { useContext, useState } from 'react'
import Menu from '@material-ui/core/Menu'
import logo from "../../assets/img/Logo.png"
import Badge from '@material-ui/core/Badge'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import MoreIcon from '@material-ui/icons/MoreVert'
import InputBase from '@material-ui/core/InputBase'
import GroupIcon from '@material-ui/icons/Group'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { AddItem } from '../itemModals/itemModals'
import FavoriteIcon from '@material-ui/icons/Favorite'
import AccountCircle from '@material-ui/icons/AccountCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useHistory } from "react-router-dom"
import { GlobalState } from "../../GlobalState"
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { fade, makeStyles } from '@material-ui/core/styles'

export const Navbar = () => {
  const classes = useStyles();
  const {user, setUser, badges, setBadges, setOpenSidebar, setSearchText} = useContext(GlobalState)
  const history = useHistory()

  const [modalOpen, setModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [text, setText] = useState("")

  const handleSearch = (key) => {
    if(key === "Enter") {
      setSearchText(text.toLowerCase())
    }
  }

  const handleChangeText = val => {
    setText(val)
    if(val === "") {
      setSearchText("")
    }
  }

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleOpenModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleLogOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("badges")
    setUser({token: "", firstname: "", lastname: ""})
    setBadges({fav: false, shop: false})
    history.push('/login')
  }

  const handleOpenDashboard = () => {
    history.push("/dashboard")
  }

  const handleOpenFav = () => {
    handleMobileMenuClose()
    history.push("/dashboard/favourites")
  }

  const handleOpenShop = () => {
    handleMobileMenuClose()
    history.push("/dashboard/shopping-cart")
  }

  const handleOpenUserInfo = () => {
    handleMenuClose()
    handleMobileMenuClose()
    history.push("/user-info")
  }

  const handleOpenUsers = () => {
    handleMobileMenuClose()
    history.push("/dashboard/users")
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleOpenUserInfo}>{user.firstname} {user.lastname}</MenuItem>
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleOpenShop}>
        <IconButton aria-label="Shopping cart" color="inherit">
          <Badge variant={badges.shop ? "dot" : ""} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p style={{margin: 0}}>Shopping cart</p>
      </MenuItem>
      <MenuItem onClick={handleOpenFav}>
        <IconButton aria-label="Favourites" color="inherit">
          <Badge variant={badges.fav ? "dot" : ""} color="secondary">
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <p style={{margin: 0}}>Favourite</p>
      </MenuItem>
      <MenuItem onClick={handleOpenModal}>
        <IconButton aria-label="Add new item" color="inherit">
          <AddCircleIcon />
        </IconButton>
        <p style={{margin: 0}}>Add item</p>
      </MenuItem>
      {(user.permission === "admin" || user.permission === "owner") &&
        <MenuItem onClick={handleOpenUsers}>
          <IconButton aria-label="All users" color="inherit">
            <GroupIcon />
          </IconButton>
          <p style={{margin: 0}}>Users</p>
        </MenuItem>
      }
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p style={{margin: 0}}>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </IconButton>
          <Avatar onClick={handleOpenDashboard} className={classes.logo} alt="Logo" src={logo} />
          <Typography onClick={handleOpenDashboard} className={classes.title} variant="h6" noWrap>
            Go Shop
          </Typography>
          <div >
              <div className={classes.search}>
              <div className={classes.searchIcon}>
                  <SearchIcon />
              </div>
              <InputBase
                  value={text}
                  onChange={e => handleChangeText(e.target.value)}
                  onKeyPress={e => handleSearch(e.key)}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
              />
              </div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {(user.permission === "admin" || user.permission === "owner") &&
              <IconButton onClick={handleOpenUsers} aria-label="All users" color="inherit">
                <GroupIcon />
              </IconButton>
            }
            <IconButton onClick={handleOpenModal} aria-label="Add new item" color="inherit">
                <AddCircleIcon />
            </IconButton>
            <IconButton aria-label="shopping cart" color="inherit">
              <Badge onClick={handleOpenShop} variant={badges.shop ? "dot" : ""} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleOpenFav} aria-label="Favourites" color="inherit">
              <Badge variant={badges.fav ? "dot" : ""} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {modalOpen && <AddItem 
        open={modalOpen}
        onClose={handleOpenModal} 
      />}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    display: 'none',
    marginLeft: '1rem',
    cursor: "pointer",
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  logo: {
    display: 'none',
    cursor: "pointer",
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));