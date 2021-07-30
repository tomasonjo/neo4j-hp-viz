import { React, useState } from "react";
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
    Drawer,
    List,
    Divider,
    IconButton,
    Container,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Timeline from './components/Timeline'
import Exploration from './components/Exploration'




const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        //    paddingTop: theme.spacing(4),
        //    paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    navLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    appBarImage: {
        maxHeight: '75px',
        paddingRight: '20px',
    },
}))


export default function App() {
    const [open, setOpen] = useState(true)
    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    const classes = useStyles()

    return (
        <Router>
            <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>

                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                >
                    <div className={classes.toolbarIcon}>
                        {open ? <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton> :
                            <IconButton onClick={handleDrawerOpen}>
                                <ChevronLeftIcon />
                            </IconButton>
                        }
                    </div>
                    <Divider />
                    <List>
                        <Link to="/" className={classes.navLink}>
                            <ListItem button>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Exploration" />
                            </ListItem>
                        </Link>

                        <Link to="/timeline" className={classes.navLink}>
                            <ListItem button>
                                <ListItemIcon>
                                    <TimelineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Timeline" />
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Switch>
                            <Route exact path="/" component={Exploration} />
                            <Route exact path="/timeline" component={Timeline} />
                        </Switch>
                    </Container>
                </main>
            </div>
        </Router>
    )
}