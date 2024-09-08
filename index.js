//importing the express js module into application
const express = require('express')

//initializing the app using the express
const app = express();

//To parse JSON request bodies
app.use(express.json());

let users = [
  {id: 1, name: "Raul", email: "raul@gmail.com"},
  {id: 2, name: "Monica", email: "monica@yahoo.com"}
];

let posts = [
  { id: 1, title: "Post 1", content: "This is the first post", userId: 1},
  {id: 2, title: "Post 2", content: "This is the second post", userId: 2}
];

let comments = [
  {id: 1, text: "Super post", userId: 1, userId: 2},
  {id: 2, text: "Thanks for sharing", userId: 1, userId: 2}
];

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

app.get("/", (req, res)=>{
  console.log('Home page')
  res.send("Home Page")
})

app.get('/users', (req, res) =>{
  console.log("User Page")
  res.send('User Page')
})

app.get('/users/:id', (req, res) =>{
  const user = users.find(u => u.id === parseInt(req.params.id));
  if(!users){
    const error = new Error('User not found');
    return next(error);
  }
  res.json(user)
})
//create a new user
app.post('/users', (req, res, next) => {
  const {name, email} = req.body;
  if(!name || !email){
    return res.status(400).json({error: 'Name and email are required'})
  }
  const newUser ={
    id: users.length +1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser)
});

app.get('/posts', (req, res) => {
  res.json(posts)
})

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


app.get('/error', (req, res, next) => {
  const error = new Error('This is an intentional error');
  next(error)
})
app.use(errorHandling)



app.listen(3000, () => {
  console.log("Server has started!");
})
