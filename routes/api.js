const express = require("express");
const router = express.Router();

const {
    upload,
    getAllStudents,
    getResultById,
    passedStudents,
    getCsv,
    updateupload,
} = require('../controller/student');

router.post('/upload', upload);

router.get('/getcsv', getCsv);

router.get('/getAll', getAllStudents);

router.get('/:id/result', getResultById);

router.get('/students', passedStudents);

router.post('/upload/update/:id', updateupload);

module.exports = router;