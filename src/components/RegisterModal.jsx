import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { Auth } from 'aws-amplify';

export default function RegisterModal({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in your details to sign up.
          </DialogContentText>
          <form onSubmit={handleSignUp}>
            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
              <Stack direction="column" spacing={2}>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Sign Up</Button>
              </DialogActions>
            </Paper>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
