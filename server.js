const express = require('express');
const path = require("path")
const cors = require('cors');
const { PORT, DB, DB_PROD } = require('./config');
const { success, error } = require('consola');
const port = PORT || 8000;
const apiRoutes = require('./routes/api');
const multer = require("multer")


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'files');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime().toString() + '-' + file.originalname);
    }
  });
  
  const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };
    

app.use(multer({ storage: fileStorage, fileFilter: csvFilter }).single("file"))

app.use("/files", express.static(path.join(__dirname, "files")))

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
    success({
        message: `Server is running on port: 8000`,
        badge: true
    });
});

