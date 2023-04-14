import Tasks from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { content, color, date } = req.body;
    if (!req.userID) {
      return res.json({ message: "id not found" });
    }
    const data = new Tasks({
      content,
      color,
      date,
      user: req.userID,
    });
    const task = await data.save();
    res.json({ ...task._doc });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const getAll = async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.params.id ,});
    if (!tasks) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ tasks: tasks });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const getByColor = async (req, res) => {
  try {
    const tasks = await Tasks.find({ 
      user: req.params.id ,
      color: req.params.color});
    if (!tasks) {
      return res.status(404).json({ message: "user or color not found" });
    }
    res.json({ tasks: tasks });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const update = async (req, res) => {
  try {
    const { newText } = req.body;
    const id = req.params.id;
    const task = Tasks.findByIdAndUpdate(
      id,
      {
        content: newText,
      },
      (err, doc) => {
        if (err) return res.status(404).json({ message: "error" });
        if (!doc) return res.status(404).json({ message: "obj not found" });
        res.status(200).json({ message: "task was updated" });
      }
    );
    if (!task) {
      res.status.json({ message: "task not found" });
    }
  } catch (e) {}
};
