const fs = require('fs')
const fs2 = require('fs').promises; 
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./backend/db.json')
const userdb = JSON.parse(fs.readFileSync('./backend/db.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({username, password}){
  return userdb.users.findIndex(user => user.password === password && (user.email === username || user.username === username)) !== -1
}

function isUserExist({username}){
  return userdb.users.findIndex(user => user.email === username || user.username === username) !== -1
}
// Register New User
server.post('/auth/register', async (req, res) => {
  try{

    console.log("register endpoint called; request body:");
    console.log(req.body);
    const {id, username, email, password} = req.body;

    if(isUserExist({email}) === true || isUserExist({username}) === true) {
      const status = 401;
      const message = 'Email and Password already exist';
      res.status(status).json({status, message});
      return
    }

    //Add new user
    userdb.users.push({id, username, email, password, role: 'user'})

    res.status(201);
      
    fs2.writeFile("./backend/db.json", JSON.stringify(userdb));

    return;
   
  }catch(err) {
    console.error(err)
    return res.status(400);
  }

})

const writeFile = (data) => {
  new Promise((resolve, reject) => {
    fs.writeFile("./backend/db.json", JSON.stringify(data), (err, data) => {
      if (err) { reject(err); }
      else { resolve(data); }
    });
  })
}

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {username, password} = req.body;
  if (isAuthenticated({username, password}) === false) {
    const status = 401
    const message = 'Incorrect username or password'
    res.status(status).json({status, message})
    return
  }
  const access_token = createToken({username, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

server.get('/api/users', (req, res) => {
  // Check if the user is authenticated
  const loginUser = verifyToken(req.headers.authorization.split(' ')[1]);
  console.log(loginUser)
  if (loginUser) {
    
    // You can use the loginUser data as needed
    // For example, you can find the user in your database using the ID
    const user = userdb.users.find((u) => u.password === loginUser.password && (u.email === loginUser.username || u.username === loginUser.username));

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
});

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
    const token = req.headers.authorization.split(' ')[1]
    if(token === 'user'){
      next()
    }else{
      verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     req.user = verifyTokenResult;
     next()
    }
    
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(8000, () => {
  console.log('Running JWT Auth API Server on port 8000')
})