import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, MenuItem } from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';

export default function Post({
  id,
  content,
  userId,
  userName,
  createdAt,
  fetchPosts,
}) {
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const date = new Date(createdAt);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = async () => {
    const newContent = prompt('Enter new content', content);
    if (newContent) {
      const updatePostMutation = `
    mutation UpdatePost($input: UpdatePostInput!) {
      updatePost(input: $input) {
        id
        content
      }
    }
  `;

      try {
        await API.graphql(
          graphqlOperation(updatePostMutation, {
            input: { id, content: newContent },
          })
        );
        fetchPosts();
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
    handleClose();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (confirmDelete) {
      const deletePostMutation = `
    mutation DeletePost($input: DeletePostInput!) {
      deletePost(input: $input) {
        id
      }
    }
  `;

      try {
        await API.graphql(
          graphqlOperation(deletePostMutation, { input: { id } })
        );
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
    handleClose();
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          user &&
          user.attributes.sub === userId && (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="settings"
                onClick={handleMenu}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                id="long-menu"
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem key="edit" onClick={handleEdit}>
                  Edit
                </MenuItem>
                <MenuItem key="delete" onClick={handleDelete}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )
        }
        title={userName}
        subheader={formattedDate}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
