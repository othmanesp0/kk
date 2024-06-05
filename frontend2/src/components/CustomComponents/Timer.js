import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Timer({ initialSeconds, onTimeUp }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      console.log('Timer reached zero');
      setOpen(true);
      onTimeUp();
    }
  }, [seconds, onTimeUp]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {seconds}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" color="primary">Time's up!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">The timer has reached zero.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Timer;