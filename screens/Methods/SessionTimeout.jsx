
import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    Fragment,
    useContext,
} from 'react';
import moment from 'moment';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { AuthContext } from "../CommonMethods/Authentication";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { APIURL, APIPath } from "../CommonMethods/Fetch";
const SessionTimeout = (props) => {
    const [events, setEvents] = useState(['click', 'load', 'scroll']);
    const [second, setSecond] = useState(0);
    const [isOpen, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const context = useContext(AuthContext);
    const { dispatch } = useContext(AuthContext);

    let timeStamp;
    let warningInactiveInterval = useRef();
    let startTimerInterval = useRef();

    // start inactive check
    let timeChecker = () => {
        startTimerInterval.current = setTimeout(() => {
            let storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
            warningInactive(storedTimeStamp);
        }, 60000);
    };

    // warning timer
    let warningInactive = (timeString) => {

        clearTimeout(startTimerInterval.current);
        warningInactiveInterval.current = setInterval(() => {
            const diff = moment.duration(moment().diff(moment(timeString)));
            if (diff.minutes() === 15) {
                clearInterval(warningInactiveInterval.current);
                sessionStorage.removeItem('lastTimeStamp');
                setOpen(true);
                dispatch({
                    type: "LOGOUT"
                });
            }
        }, 3000);
    };
    let resetTimer = useCallback(() => {
        clearTimeout(startTimerInterval.current);
        clearInterval(warningInactiveInterval.current);
        if (context.state.isAuthenticated) {
            timeStamp = moment();
            sessionStorage.setItem('lastTimeStamp', timeStamp);
        } else {
            clearInterval(warningInactiveInterval.current);
            sessionStorage.removeItem('lastTimeStamp');
        }
        timeChecker();
        //setOpen(false);
    }, [context.state.isAuthenticated]);

    // handle close popup
    const handleClose = () => {
        dispatch({
            type: "LOGOUT"
        });
        setOpen(false);
        window.location.href = APIPath() + "login";
        // props.history.push(APIPath() + "login");
        resetTimer();
    };
    const handleCancel = () => {
        dispatch({
            type: "LOGOUT"
        });
        setOpen(false);
        window.location.href = APIPath() + "login";
        resetTimer();
    }
    useEffect(() => {
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
            clearInterval(warningInactiveInterval.current);
        });
        timeChecker();
        return () => {
            clearTimeout(startTimerInterval.current);
            //   resetTimer();
        };
    }, [resetTimer, events, timeChecker]);


    if (!isOpen) {
        return null;
    }

    // change fragment to modal and handleclose func to close
    return <Dialog maxWidth={maxWidth} disableBackdropClick={true} disableEscapeKeyDown={true} aria-labelledby="customized-dialog-title" open={isOpen}>
        <DialogTitle align="center" style={{ backgroundColor: "red", color: "white" }} id="customized-dialog-title">
            Session Timeout
        </DialogTitle>
        <DialogContent dividers>
            <ErrorOutlineIcon style={{ display: "block", margin: "0 auto", fontSize: "80px", color: "#ff5722" }} />
            <div style={{ padding: "5px 40px 28px 40px" }}>
                <h3 style={{ fontSize: "26px", margin: "10px" }}>
                    Your online session has expired.
                </h3>
                <h3 style={{ fontSize: "26px", margin: "10px" }}>
                    Please login again to continue.
                </h3>
                <Button style={{ width: "47%", margin: "7px" }} variant="contained" color="primary" onClick={handleClose}>
                    Login
                </Button>
                <Button style={{ width: "47%" }} variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </DialogContent>
    </Dialog>;
};

export default SessionTimeout;