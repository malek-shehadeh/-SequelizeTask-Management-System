const db = require("../models");

exports.createTask = async (req, res) => {
  try {
    const { task_name, task_description } = req.body;
    const user_id = req.user.id;

    const task = await db.Tasks.create({
      task_name,
      task_description,
      user_id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: "An error occurred while creating the task" });
  }
};

exports.getTask = async (req, res) => {
  try {
    const tasks = await db.Tasks.findAll({
      where: {
        user_id: req.user.id,
        deleted: false
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { task_name, task_description } = req.body;

    console.log('Update request:', { task_id, task_name, task_description });

    const [updatedRowsCount, updatedRows] = await db.Tasks.update(
      { task_name, task_description },
      {
        where: {
          task_id: task_id,
          user_id: req.user.id
        },
        returning: true
      }
    );

    console.log('Update result:', updatedRows);

    if (updatedRowsCount > 0) {
      res.json(updatedRows[0]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: "An error occurred while updating the task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    const [updatedRowsCount] = await db.Tasks.update(
      { deleted: true },
      {
        where: {
          task_id: task_id,
          user_id: req.user.id
        }
      }
    );

    if (updatedRowsCount > 0) {
      res.send({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: "An error occurred while deleting the task" });
  }
};