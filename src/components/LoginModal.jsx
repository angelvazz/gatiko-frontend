import { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Auth } from 'aws-amplify'; // import the Auth module from aws-amplify
import { AuthContext } from '../context/AuthContext';

export default function LoginModal({ open, handleClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { checkUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await Auth.signIn(username, password);
      checkUser();
      handleClose();
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in your credentials to login.
          </DialogContentText>
          <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
            <Stack direction="column" spacing={2}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
