import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import './CSS/NewPost.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function NewPost({ login, fetchPosts }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const userId = user ? user.attributes.sub : null;

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSendPost = async () => {
    setLoading(true);
    try {
      const postDetails = {
        content,
        userId,
        userName: user.username,
      };

      const createPostMutation = `mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        content
        userId
        userName
        createdAt
      }
    }`;

      console.log('content:', postDetails.content);
      console.log('userId:', postDetails.userId);
      console.log('userName:', postDetails.userName);

      await API.graphql(
        graphqlOperation(createPostMutation, { input: postDetails })
      );
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error sending post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-component">
      <form style={{ display: 'grid', placeItems: 'end' }}>
        <TextField
          id="outlined-multiline-static"
          label="What's on your mind?"
          onChange={handleChange}
          multiline
          disabled={!login}
          rows={6}
          value={content}
          sx={{
            m: { xs: 2, sm: 5 },
            width: { xs: '300px', sm: '500px', md: '700px' },
          }}
        />
        {!loading ? (
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!login || loading || !content.trim()}
            onClick={handleSendPost}
            sx={{ width: '100px', m: { xs: 1, sm: 2 } }}
          >
            Send
          </Button>
        ) : (
          <LoadingButton
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{ width: '100px', m: { xs: 1, sm: 2 } }}
          >
            <span>Sendo</span>
          </LoadingButton>
        )}
      </form>
    </div>
  );
}
