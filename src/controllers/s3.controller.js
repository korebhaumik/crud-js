const {
  getAllFiles,
  getFileById,
  deleteFileById,
  updateFileById,
} = require("../services/newFile");
const {
  DeleteObjectCommand,
  S3Client,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { deleteFromDB, saveToDB } = require("../services/file.service");
const path = require("path");
require("dotenv").config();

// Create a new S3Client object with the AWS access key ID, secret access key, and region specified in the environment variables
const client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const creates3handler = async (req, res) => {
  try {
    // Check if req.file is undefined or if req.body is falsy
    if (req.file === undefined || !req.body)
      return res.status(400).json({ message: "No file uploaded." });

    // Extract the username and metadata from the request body
    const { username, metadata } = req.body;

    // Define an array of allowed file extensions and get the file extension of the uploaded file
    const allowedExtensions = [
      ".png",
      ".jpeg",
      ".jpg",
      ".txt",
      ".pdf",
      ".pptx",
    ];
    const fileExtension = path.extname(req.file.originalname);

    // Check if the file extension is not allowed
    if (!allowedExtensions.includes(fileExtension))
      return res.status(400).json({
        message: `Invalid file type. File types supported are '.png', '.jpeg', '.jpg', '.txt', '.pdf' `,
      });

    // Define a maximum file size limit of 10 MB and check if the file size exceeds the limit
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (req.file.size > maxFileSize)
      throw new Error("File size exceeds the maximum limit of 10 MB.");

    // Create a new Upload object with the S3Client object and the file data, including the file buffer, file name, and S3 bucket name
    const upload = new Upload({
      client,
      params: {
        ACL: "public-read",
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        // Body: fs.readFileSync("src/controllers/Assignment_1.pdf"),
      },
    });

    // Upload the file to S3 and extract the file URL, ETag, and filename from the upload result
    const result = await upload.done();
    // @ts-ignore
    const URL = result.Location;
    // @ts-ignore
    const ETag = result.ETag;
    // @ts-ignore
    const filename = result.Key;

    // Save the file metadata to mongoDB
    const fileInstance = await saveToDB(
      URL,
      filename,
      ETag,
      username,
      metadata
    );
    res.status(200).json(fileInstance);
  } catch (err) {
    // Catch any errors thrown during the file upload process and return a 400 response with an error message
    console.log(err);
    res.status(400).json({ code: err.code, message: err.message });
  }
};

const deletes3handler = async (req, res) => {
  try {
    const { filename } = req.query;

    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    });

    const result = await client.send(command);
    await deleteFromDB(filename);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    // Catch any errors thrown during the file upload process and return a 400 response with an error message
    console.log(err);
    res.status(400).json({ code: err.code, message: err.message });
  }
};

const gets3handler = async (req, res) => {
  try {
    const { filename } = req.query;
    console.log(filename);

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    });

    const response = await client.send(command);
    const result = await response.Body?.transformToString("utf8");
    // console.log(result);

    res.status(200).json({ rawData: result });
  } catch (err) {
    // Catch any errors thrown during the file upload process and return a 400 response with an error message
    console.log(err);
    res.status(400).json({ code: err.code, message: err.message });
  }
};

const getAllFilesHandler = async (req, res) => {
  try {
    const { filename, date } = req.query;
    const fileInstances = await getAllFiles();

    if (!filename && !date) return res.status(200).json(fileInstances);
    if (!filename && date) {
      return res.status(200).json(
        fileInstances.filter((file) => {
          //   console.log(file.createdAt.toDateString(), date);
          return file.createdAt.toDateString() === date;
        })
      );
    }
    if (filename && !date)
      return res
        .status(200)
        .json(fileInstances.filter((file) => file.filename === filename));

    const output = fileInstances.filter(
      (file) => file.filename === filename && file.createdAt === date
    );
    res.status(200).json(output);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};
const getFileHandler = async (req, res) => {
  try {
    const { id } = req.query;
    const fileInstance = await getFileById(id);
    res.status(200).json(fileInstance);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};
const deleteFileHandler = async (req, res) => {
  try {
    const { id } = req.query;
    await deleteFileById(id);
    res.status(200).json({ msg: "file deleted" });
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};
const updateFileHandler = async (req, res) => {
  try {
    const { URL, username, metadata, filename, ETag, id } = req.body;
    const fileData = { URL, username, metadata, filename, ETag, id };
    const fileInstance = await updateFileById(id, fileData);
    res.status(200).json(fileInstance);
  } catch (error) {
    res.status(400).json({ code: error.code, msg: error.message });
  }
};

module.exports = {
  creates3handler,
  deletes3handler,
  gets3handler,
  getAllFilesHandler,
  getFileHandler,
  deleteFileHandler,
  updateFileHandler,
};
