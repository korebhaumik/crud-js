const {
  createStudent,
  deleteStudentById,
  getStudentById,
  getAllStudents,
  updateStudentById,
} = require("../services/student.service");


//Creating a new student
const createStudentHandler = async (req, res) => {
  try {
    const { name, sapid, batch, div } = req.body;
    const studentInstance = await createStudent({ name, sapid, batch, div });
    res.status(200).json(studentInstance);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

//Getting all student details
const getAllHandler = async (req, res) => {
  try {
    const studentInstances = await getAllStudents();
    res.status(200).json(studentInstances);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

//Getting a specific student details by their sapid
const getStudentHandler = async (req, res) => {
  try {
    const { sapid } = req.query;
    const studentInstance = await getStudentById(sapid);
    res.status(200).json(studentInstance);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

//Updating student details by their sapid
const updateStudentHandler = async (req, res) => {
  try {
    const { sapid, name, batch, div } = req.body;
    const studentData = { name, batch, div, sapid };
    const studentInstance = await updateStudentById(sapid, studentData);
    res.status(200).json(studentInstance);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

//Deleting a student by their sapid
const deleteStudentHandler = async (req, res) => {
  try {
    const { sapid } = req.query;
    const { acknowledged, deletedCount } = await deleteStudentById(sapid);
    res.status(200).json({ acknowledged, deletedCount });
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

module.exports = {
  createStudentHandler,
  getAllHandler,
  getStudentHandler,
  updateStudentHandler,
  deleteStudentHandler,
};
