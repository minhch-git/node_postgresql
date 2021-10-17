const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json()); // req.body

// ROUTES //

// get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await pool.query(
      'SELECT todo_id, description FROM todo '
    );
    res.status(200).json(todos.rows);
  } catch (error) {
    console.log(error);
  }
});

// get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      'SELECT todo_id, description FROM todo WHERE todo_id = $1',
      [id]
    );
    console.log(todo);
    res.status(200).json(todo.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

// creat a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES ($1) RETURNING *',
      [description]
    );
    res.status(200).json(newTodo.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

// update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      'UPDATE todo SET description=$1 WHERE todo_id = $2',
      [description, id]
    );
    res.status(200).json(updateTodo);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

// delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await pool.query('SELECT todo_id FROM todo ');
    const currentId = todos.rows.find(todo => {
      console.log(typeof todo.todo_id);
      console.log(typeof id);
      return todo.todo_id == id;
    });
    console.log(currentId);
    if (!currentId) {
      console.log('No todo id');
      return res.json('No todo id');
    }
    const deleteTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id = $1',
      [id]
    );
    res.status(200).json(deleteTodo);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
