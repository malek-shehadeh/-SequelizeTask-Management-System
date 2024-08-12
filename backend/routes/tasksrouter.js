const express = require("express");
const taskcontroller= require('../controllers/taskscontroller');
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, taskcontroller.createTask);
router.get("/", authenticateToken,taskcontroller. getTask);
router.put("/:task_id", authenticateToken,taskcontroller. updateTask);
router.delete("/:task_id", authenticateToken,taskcontroller. deleteTask);

module.exports = router;
