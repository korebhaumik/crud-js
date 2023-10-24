const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    username: { type: String },
    URL: { type: String, required: true, unique: true },
    ETag: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    metadata: { type: String },
  },
  { timestamps: true }
);

const File = mongoose.model("File", FileSchema);

module.exports = File;
