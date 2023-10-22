const express = require("express");
const routes = require("./routes");
const connectToDb = require("./utils/connect");
const cors = require("cors");
const app = express();
const port = 1338;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

routes(app);

(async () => {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
