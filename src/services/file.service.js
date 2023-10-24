const File = require("../schema/file.schema");

const saveToDB = async (URL, filename, ETag, username, metadata) => {
  try {
    const fileInstance = new File({ URL, username, metadata, filename, ETag });
    await fileInstance.save();
    return fileInstance;
  } catch (err) {
    throw err;
  }
};

const deleteFromDB = async (filename) => {
  try {
    const res = await File.deleteOne({ filename });
    return res;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveToDB,
  deleteFromDB,
};
