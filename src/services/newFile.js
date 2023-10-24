const File = require("../schema/file.schema");

// Create a new file
const createFile = async (URL, filename, ETag, username, metadata) => {
  try {
    const fileInstance = new File({ URL, username, metadata, filename, ETag });
    await fileInstance.save();
    return fileInstance;
  } catch (err) {
    throw err;
  }
};

// Get all files
const getAllFiles = async () => {
  try {
    const files = await File.find({});
    return files;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a file by ID
const getFileById = async (id) => {
  try {
    const file = await File.findById(id);
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a student by ID
const updateFileById = async (id, fileData) => {
  try {
    console.log(fileData);
    const file = await File.findByIdAndUpdate(id, fileData, {
      new: true,
    });
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a file by ID
const deleteFileById = async (id) => {
  try {
    const result = await File.findByIdAndDelete(id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createFile,
  getAllFiles,
  getFileById,
  updateFileById,
  deleteFileById,
};
