import Navbar from './components/NavBar';
import NewPost from './components/NewPost';
import Post from './components/Post';
import './App.css';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';

Amplify.configure(awsconfig);

function App() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const login = !!user;
  console.log('posts', posts);

  const listPostsQuery = `
    query listPosts {
      listPosts {
        id
        content
        userId
        userName
        createdAt
      }
    }
  `;

  const fetchPosts = async () => {
    try {
      const postData = await API.graphql(graphqlOperation(listPostsQuery));
      const sortedPosts = postData.data.listPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosts(sortedPosts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="PostDiv">
        <div className="square-div">
          <NewPost login={login} fetchPosts={fetchPosts} />
        </div>
      </div>
      <div className="post">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((e, i) => (
            <Post
              key={i}
              id={e.id}
              content={e.content}
              userId={e.userId}
              userName={e.userName}
              createdAt={e.createdAt}
              fetchPosts={fetchPosts}
            />
          ))
        ) : (
          <p>No posts for the moment.</p>
        )}
      </div>
    </div>
  );
}

export default App;
