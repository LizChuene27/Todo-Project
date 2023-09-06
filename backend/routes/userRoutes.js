// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Define your routes here
// Example: Create a new task
router.post('/', verifyToken,  async (req, res) => {
  try {
    const task = await User.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
    try {
      const users = await User.find({role: 'user'});
      res.status(201).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/login', verifyToken, async (req, res) => {
    try {
      const users = await User.find({username: req.user.username});
      if (users.length){
       return res.status(201).json(users[0]);
      }
      return res.status(201).json({});
     
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // router.get('/:id', verifyToken, async (req, res) => {
  //   try {
  //     const users = await User.findById(req.params.id);
  //     res.status(201).json(users);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // });

  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const users = await User.findByIdAndDelete(req.params.id);
      res.status(201).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/todos', verifyToken, async (req, res) => {
    try {
      const users = await User.findById(req.user.id);

      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
      const todos = users.todos || [];
      res.status(201).json(todos);
    } catch (error) {
      console.log('error::::', error)
      res.status(400).json({ error: error.message });
    }
  });

// GET a single todo by ID
// router.get('/todos/:todoId', verifyToken, async (req, res) => {
//     try {
//       const user = await User.findById(req.user.id);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const todo = user.todos.find((t) => t._id.toString() === req.params.todoId);
  
//       if (!todo) {
//         return res.status(404).json({ message: 'Todo not found' });
//       }
  
//       res.status(200).json(todo);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// DELETE a specific todo by ID
router.delete('/todos/:todoId', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const todoIndex = user.todos.findIndex(
        (t) => t._id.toString() === req.params.todoId
      );
  
      if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      // Remove the todo from the user's 'todos' array
      user.todos.splice(todoIndex, 1);
  
      // Save the user to update the 'todos' array
      await user.save();
  
      res.status(204).send(); // 204 means No Content (successful deletion)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new todo for a specific user
router.post('/todos', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new todo based on the request body
      const newTodo = {
        title: req.body.title,  
        summary: req.body.summary,
        active: true, // You can set the initial completion status here
      };
  
      // Push the new todo into the user's 'todos' array
      user.todos.push(newTodo);
  
      // Save the user to update the 'todos' array
      await user.save();
  
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a specific todo by ID
router.put('/todos/:todoId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todoIndex = user.todos.findIndex(
      (t) => t._id.toString() === req.params.todoId
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update the todo based on the request body
    const updatedTodo = {
      title: req.body.title || user.todos[todoIndex].title,
      summary: req.body.summary || user.todos[todoIndex].summary,
      active:
        req.body.active !== undefined
          ? req.body.active
          : user.todos[todoIndex].active,
    };

    // Replace the existing todo with the updated todo
    user.todos[todoIndex] = updatedTodo;

    // Save the user to persist the updated todo
    await user.save();

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add other CRUD routes (GET, PUT, DELETE)

module.exports = router;
