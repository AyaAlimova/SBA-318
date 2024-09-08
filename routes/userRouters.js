const express = require('express')
const router = express.Router();

//Data
let users = [
  {id: 1, name: "Raul", email: "raul@gmail.com"},
  {id: 2, name: "Monica", email: "monica@yahoo.com"}
];

// Home page (rendered with EJS)
router.get('/', (req, res) => {
  res.render('index', { users });
});

router.get('/users', (req, res) =>{
  console.log("User Page")
  res.send('User Page')
})

router.get('/users/:id', (req, res) =>{
  const user = users.find(u => u.id === parseInt(req.params.id));
  if(!users){
    const error = new Error('User not found');
    return next(error);
  }
  res.json(user)
})

//create a new user
router.post('/users', (req, res, next) => {
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

// Delete a user
router.delete('/users/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(userIndex, 1); // Remove the user from the array
  res.status(204).end(); // No content response
});

module.exports = router; 
