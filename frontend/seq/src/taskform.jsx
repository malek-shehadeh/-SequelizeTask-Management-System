import React, { useState, useEffect } from 'react';
import axios from './axios'; // Ensure this path is correct and axios is properly configured

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    task_name: '',
    task_description: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', { // Assuming baseURL is set in axios
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message); // Only display the error message
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/tasks/${editing}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => task.task_id === editing ? response.data : task));
      setEditing(null);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const handleDelete = async (task_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${task_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove the deleted task from the local state
      setTasks(tasks.filter(task => task.task_id !== task_id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const startEditing = (task) => {
    setEditing(task.task_id);
    setTaskData({ task_name: task.task_name, task_description: task.task_description });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>{editing ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="task_name"
            placeholder="Task Name"
            value={taskData.task_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="task_description"
            placeholder="Task Description"
            value={taskData.task_description}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editing ? 'Confirm Edit' : 'Create Task'}
          </button>
        </form>
      </div>
      <div style={styles.taskList}>
        <h3 style={styles.subtitle}>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul>
            {tasks.map(task => (
              <li key={task.task_id} style={styles.taskItem}>
                <h4>{task.task_name}</h4>
                <p>{task.task_description}</p>
                <button onClick={() => startEditing(task)} style={styles.button}>Edit</button>
                <button onClick={() => handleDelete(task.task_id)} style={styles.button}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  form: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
    color: 'blue'
  },
  subtitle: {
    marginBottom: '10px',
    color: 'blue'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: 'blue'
  },
  button: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  taskList: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: 'blue'
  },
  taskItem: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: 'blue'
  }
};

export default Task;
