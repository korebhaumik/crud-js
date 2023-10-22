const {
  createStudentHandler,
  getStudentHandler,
  deleteStudentHandler,
  getAllHandler,
  updateStudentHandler,
} = require("./controllers/student.controller");

function routes(app) {
  app.get("/", getHandler);
  app.post("/create", createStudentHandler);
  app.post("/update", updateStudentHandler);
  app.get("/getId", getStudentHandler);
  app.get("/getAll", getAllHandler);
  app.delete("/delete", deleteStudentHandler);
}

function getHandler(req, res) {
  res.status(200).json({ message: "api is working." });
}

module.exports = routes;
