import axios from 'axios';

const baseUrl = "http://localhost:8000"
const createUser = async (user) => {
    try {
        if(user.username && user.email && user.password){
            const existUser = await isUserExist(user.email)
            if(!existUser){
                await API_Call(`${baseUrl}/auth/register`, 'post', {
                    ...user, 
                    password: hashPassword(user.password),  
                    role: 'user', 
                    // id: generateRandomId(10)
                }, {authorization: 'Bearer user'})
                return {message: 'User created successfully', status: 201 }
            }
            return {message: 'User Already exists' }
        }else{
            return {message: "Invalid username or password"}
        }
    } catch (err){
        console.error(err)
        return {message: "Invalid username or password"}
    }
}

const createAdminUser = async () => {
    try {
        const user = {
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin'
        }
        if(user.username && user.email && user.password){
            const existUser = await isUserExist(user.email)
            if(!existUser){
                await API_Call(`${baseUrl}/auth/admin/register`, 'post', {
                    ...user, 
                    password: hashPassword(user.password),  
                   
                    // id: generateRandomId(10)
                }, {authorization: 'Bearer user'})
                return {message: 'User created successfully', status: 201 }
            }
            return {message: 'User Already exists' }
        }else{
            return {message: "Invalid username or password"}
        }
    } catch (err){
        console.error(err)
        return {message: "Invalid username or password"}
    }
}

const createTodo = async (userId, todo) => {
    try {
        if(todo.title && todo.summary){
          
            await API_Call(`${baseUrl}/users/todos`, 'post', {
                ...todo, 
                // userId: userId,
                active: true,
                // id: generateRandomId(10)
            })
            return {message: 'Todo created successfully', status: 201 }
          
        }else{
            return {message: "Invalid input"}
        }
    } catch (err){
        console.error(err)
        return {message: "Invalid input"}
    }
}

const updateTodo = async (todoId, todo) => {
    try {
        if(todo.title && todo.summary){
          
            await API_Call(`${baseUrl}/users/todos/${todoId}`, 'put', {
                ...todo
            })
            return {message: 'Todo updated successfully', status: 200 }
          
        }else{
            return {message: "Invalid input"}
        }
    } catch (err){
        console.error(err)
        return {message: "Invalid input"}
    }
}

const getTodos = async (userId) => {
    try {
        const todos = await API_Call(`${baseUrl}/users/todos`)
        return todos
    } catch (err){
        console.error(err)
        return []
    }
}

const deleteTodo = async (todoId) => {
    try {
        const todos = await API_Call(`${baseUrl}/users/todos/${todoId}`, 'delete')
        return todos
    } catch (err){
        console.error(err)
        return []
    }
}
const getUsers = async () => {
    try {
        const users = await API_Call(`${baseUrl}/users?role=user`)
        return users
    } catch (err){
        console.error(err)
        return []
    }
}

const deleteUser = async (userId) => {
    try {
        const users = await API_Call(`${baseUrl}/users/${userId}`, 'delete')
        return users
    } catch (err){
        console.error(err)
        return []
    }
}

const getUserById = async (userId) => {
    try {
        const user =  await API_Call(`${baseUrl}/users/${userId}`)
        return user
    } catch (err){
        console.error(err)
        return false
    }
}

const getQueryUser = async (query) => {
    try{
        const user = await API_Call(`${baseUrl}/users${query}`)
        return user
    }catch(err){
        console.log(err)
        return false
    }
}

const isUserExist = async (username) => {
    const user = await getQueryUser(`?email=${username}`)
    console.log('user: ' + user)
    if(user && user.length > 0){
        return true
    }
    return false
}

const loginUser = async (user) => {
    try {
        const token = await API_Call(`${baseUrl}/auth/login`, 'post', user)
        return token
    } catch (err){
        console.error(err)
        return false
    }
}



const API_Call = (url, method = 'get', data = {}, headers = {}) => {
    const token = localStorage.getItem('token')
    if(token){
        headers = {
            authorization: `Bearer ${token}`,
        }
    }
    console.log("headers:::", headers, token)
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url,
            // responseType: 'json',
            data,
            headers
          })
        .then(res => { console.log('res data:::', res); resolve(res.data) })
        .catch(err => { console.log('err data:::', err.message); reject(err) })
    })
}

const hashPassword = (password, salt = 'utf8') => {
    return password
}

const verifyPassword = (inputPassword, storedHashedPassword) => {
    const hashedInputPassword = hashPassword(inputPassword);
    return hashedInputPassword.toString('utf-8') === storedHashedPassword;
}

const getLoginUser = () => {
    try{
        const user = JSON.parse(localStorage.getItem('loginUser'))
        return user
    }catch(err){
        return false
    }
}

const getLoginUserByToken = async () => {
    try {
        const user =  await API_Call(`${baseUrl}/users/login`)
        return user
    } catch (err){
        console.error(err)
        return false
    }
}


const generateRandomId = (length)  => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  
    return randomId;
  }


  export {
    createUser,
    getUsers,
    getUserById,
    getQueryUser,
    verifyPassword,
    getLoginUser,
    createTodo,
    updateTodo,
    getTodos,
    deleteTodo,
    deleteUser,
    loginUser,
    getLoginUserByToken,
    createAdminUser
  }