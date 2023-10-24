const {
  getAllFilesHandler,
  getFileHandler,
  deleteFileHandler,
  updateFileHandler,
  creates3handler,
  deletes3handler,
  gets3handler,
} = require("./controllers/s3.controller");
const multer = require("multer");

const upload = multer();
function routes(app) {
  app.get("/", getHandler);

  app.post("/addItem", upload.single("file"), creates3handler);
  app.delete("/deleteItem", deletes3handler);
  app.get("/getItem", gets3handler);

  app.post("/update", updateFileHandler);
  app.get("/getId", getFileHandler);
  app.get("/getAll", getAllFilesHandler);
  app.delete("/delete", deleteFileHandler);
}

function getHandler(req, res) {
  res.status(200).json({ message: "api is working." });
}

module.exports = routes;
