const Student = require("../schema/student.schema");

// Create a new student
const createStudent = async ({ name, sapid, batch, div }) => {
  const student = new Student({ name, sapid, batch, div });
  try {
    await student.save();
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all students
const getAllStudents = async () => {
  try {
    const students = await Student.find({});
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a student by ID
const getStudentById = async (sapid) => {
  try {
    const student = await Student.findOne({ sapid });
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a student by ID
const updateStudentById = async (sapid, studentData) => {
  try {
    const student = await Student.findOneAndUpdate({sapid}, studentData, {
      new: true,
    });
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a student by ID
const deleteStudentById = async (sapid) => {
  try {
    console.log(sapid);
    const student = await Student.deleteOne({ sapid });
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
