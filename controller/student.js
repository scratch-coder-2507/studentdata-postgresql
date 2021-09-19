const pool = require('../database');
const path = require("path")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const uuid = require("uuid/v4")

const upload = async (req, res) => {
    const { 
        Name,
        Age, 
        Mark1,
        Mark2, 
        Mark3
    } = req.body;
    try {
        const newStudent = await pool.query(
            "INSERT INTO students (Name, Age, Mark1, Mark2, Mark3) VALUES($1, $2, $3, $4, $5)",
            [Name, Age, Mark1, Mark2, Mark3]
        );
        res.status(200).json({
            success: true, 
            message: "Data inserted successfully",
            data: newStudent
        });
        
    } catch (err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}

const getAllStudents = async (req, res) => {
    try {
        const getAll = await pool.query(
            "SELECT * FROM students"
        );

        res.status(200).json({
            success: true, 
            data: getAll.rows
        });
        
    } catch (err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}

const getResultById = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) {
            res.status(404).send("Student with the provided ID does not exist")
        }
        const resultById = await pool.query("SELECT Mark1, Mark2, Mark3 FROM students WHERE id = $1", [id]);
        if(!resultById) {
            res.status(404).send("Student with the provided ID does not exist")
        }
        const mark = resultById.rows[0];
        let total = parseInt(mark.mark1) + parseInt(mark.mark2) + parseInt(mark.mark3);
        let percentage = parseFloat(total/3);
        res.status(200).json({
            success: true, 
            data: resultById.rows,
            total: total,
            result: percentage
        });
        
    } catch (err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}


const passedStudents = async (req, res) => {
    const { resultStatus } = req.query
    try {
        const getAll = await pool.query(
            "SELECT * FROM students"
        );

        let students = []
        getAll.rows.forEach(stud => {
            const mark = stud;
            let total = parseInt(mark.mark1) + parseInt(mark.mark2) + parseInt(mark.mark3);
            let percentage = parseFloat(total/3);
            if(percentage < 33 && resultStatus == "failed") {
                students.push(stud)
            } else if(percentage >= 33 && resultStatus == "passed") {
                students.push(stud)
            }
        })
        if(students.length == 0) {
            res.status(400).json({
                success: false,
                message: "No student records"
            });
        }
        res.status(200).json({
            success: true,
            data: students
        });
    } catch(err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}

const getCsv = async (req, res) => {    
    try {
        const getAll = await pool.query(
            "SELECT * FROM students"
        );
        const csvWriter = createCsvWriter({
            path: path.join(__dirname, "../files/stfile.csv"),
            header: [
                {id: 'name', title: 'name'},
                {id: 'age', title: 'age'},
                {id: 'marks1', title: 'marks1'},
                {id: 'marks2', title: 'marks2'},
                {id: 'marks3', title: 'marks3'}
            ]
        });
         
        let records = [];
        getAll.rows.forEach(st => {
            let obj = {
                name: st.name,
                age: st.age,
                marks1: st.mark1,
                marks2: st.mark2,
                marks3: st.mark3,
            }
            records.push(obj)
        })
        if(records.length == 0){
            res.status(400).json({
                success: false, 
                error: "No records found"
            })
        }
         console.log(records)
        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done');
                res.redirect("/files/stfile.csv")
              
            }).catch((err) => {
                res.status(400).json({
                    success: false, 
                    error: err.message
                })
            });  
        } catch(err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}



const updateupload = async (req, res) => {
    const {id} = req.params;
    const { 
        Name,
        Age, 
        Mark1,
        Mark2, 
        Mark3
    } = req.body;
    try {
        const updateById = await pool.query("UPDATE students SET Name=$1, Age=$2, Mark1=$3, Mark2=$4, Mark3=$5 WHERE id = $6", [Name, Age, Mark1, Mark2, Mark3, id]);
        res.status(200).json({
            success: true,
            message: "Data successfully updated",
            data: updateById
        });
    } catch(err) {
        res.status(400).json({
            success: false, 
            error: err.message
        })
    }
}

module.exports = {
    upload,
    getCsv,
    getAllStudents,
    getResultById,
    passedStudents,
    updateupload
}