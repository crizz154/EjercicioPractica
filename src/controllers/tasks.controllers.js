import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user : req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newTask = new Task({
      title,
      description,
      date,
      user: req.user.id,
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // Verificar que los datos necesarios estén presentes
    if (!title || !description || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Logging para ver qué datos llegan
    console.log("Datos recibidos para actualizar la tarea:", req.body);

    // Verifica si la fecha tiene un formato correcto
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Actualización de la tarea
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Asegúrate de que el usuario es el dueño de la tarea
      { title, description, date },
      { new: true }
    );

    if (!taskUpdated) {
      return res.status(404).json({ message: "Task not found or user is not authorized" });
    }

    return res.json(taskUpdated);
  } catch (error) {
    console.error("Error actualizando la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};

// export const updateTask = async (req, res) => {
//   try {
//     const { title, description, date } = req.body;
//     const taskUpdated = await Task.findOneAndUpdate(
//       { _id: req.params.id },
//       { title, description, date },
//       { new: true }
//     );
//     return res.json(taskUpdated);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};