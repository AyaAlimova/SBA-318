//importing the express js module into application
const express = require('express')

//initializing the app using the express
const app = express();

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

app.get('/error', (req, res, next) => {
  const error = new Error('This is an intentional error');
  next(error)
})
app.use(errorHandling)



app.listen(3000, () => {
  console.log("Server has started!");
})
