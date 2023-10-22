const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sapid: { type: Number, required: true, unique: true },
    batch: { type: String, required: true },
    div: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
