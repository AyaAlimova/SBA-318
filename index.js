//importing the express js module into application
const express = require('express')
const path = require('path');
const userRoutes = require('./routes/userRouters'
)

//initializing the app using the express
const app = express();

//To parse JSON request bodies
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/users', userRoutes);


let posts = [
  { id: 1, title: "Post 1", content: "This is the first post", userId: 1},
  {id: 2, title: "Post 2", content: "This is the second post", userId: 2}
];

let comments = [
  {id: 1, text: "Super post", userId: 1, userId: 2},
  {id: 2, text: "Thanks for sharing", userId: 1, userId: 2}
];

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

function logger(req, res, next){
  console.log(`${req.method} request for '${req.url}'`);
  next();
}

const customHeader = (req, res, next) => {
  res.setHeader('X-Custom-Header', 'Hello World');
  next();
}

// Error handling
const errorHandling = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({error: 'Something went wrong!'})
}

app.use(logger);
app.use(customHeader);


// GET all posts with optional user filtering
app.get('/posts', (req, res) => {
  const { userId } = req.query;
  let filteredPosts = [...posts];

  if (userId) {
    filteredPosts = filteredPosts.filter(post => post.userId === parseInt(userId));
  }

  const postsWithUser = filteredPosts.map(post => {
    const user = users.find(u => u.id === post.userId);
    return { ...post, user };
  });
  res.json(postsWithUser);})

app.get('/posts/:id', (req, res, next) =>{
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if(!post){
    const error = new Error('Post not found')
    return(error)
  }
  res.json(post)
})

app.get('/comments', (req, res) =>{
  res.json(comments);
});

app.get('/posts/:postId/comments', (req, res, next) =>{
const postComments = comments.filter(c => c.postId === parseInt(req.params.postId));
if (postComments.length === 0) {
  const error = new Error('No comments found for this post');
  return next(error);
}
res.json(postComments);
});

// Update a post (PATCH)
app.patch('/posts/:id', (req, res, next) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  const updates = req.body;
  posts[postIndex] = { ...posts[postIndex], ...updates };
  res.json(posts[postIndex]);
});

app.get('/error', (req, res, next) => {
  const error = new Error('This is an intentional error');
  next(error)
})
app.use(errorHandling)

app.listen(3000, () => {
  console.log("Server has started!");
})
