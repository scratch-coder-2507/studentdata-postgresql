const chai = require('chai');
const chaiHttp = require('chai-http');
//const app = require('../server').app;
//var request = require("supertest").agent(app.listen());

chai.should();

chai.use(chaiHttp);

describe('Students API', () => {

    //Test the GET API to get all student
    describe("GET /api/getAllStudents", () => {
        it("It should GET all the students", (done) => {
            chai.request('http://localhost:8000')
            .get('/api/getAll')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                done();
            })
        })

        it("It should not GET all the students", (done) => {
            chai.request('http://localhost:8000')
            .get('/api/getsAll')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(404);
                response.body.should.be.a('object');
                done();
            })
        })
    });

    //Test the GET API to get the student result by ID

    describe("GET /api/:id/result", () => {
        it("It should GET the students result by ID", (done) => {
            const id = 1;
            chai.request('http://localhost:8000')
            .get('/api/'+id+'/result')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('total');
                response.body.should.have.property('result');
                response.body.should.have.property('success').eq(true);
                done();
            })
        })
        it("It should not GET the students result by ID", (done) => {
            const id = 134;
            chai.request('http://localhost:8000')
            .get('/api/'+id+'/result')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                done();
            })
        })
    });

    //Test the POST API to add new student

    describe("POST /api/upload", () => {
        it("It should POST a student", (done) => {
            const student = {
                Name: "qwertyuiop",
                Age: 20,
                Mark1: 41,
                Mark2: 73,
                Mark3: 91
            };
            chai.request('http://localhost:8000')
            .post('/api/upload')
            .send(student)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Data inserted successfully');
                response.body.should.have.property('success').eq(true);
                done();
            })
        });

        it("It should not POST a student without the name property", (done) => {
            const student = {
                Age: 20,
                Mark1: 41,
                Mark2: 73,
                Mark3: 91
            };
            chai.request('http://localhost:8000')
            .post('/api/upload')
            .send(student)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(400);
                response.body.should.be.a('object');4
                response.body.should.have.property('error').eq('null value in column \"name\" of relation \"students\" violates not-null constraint');
                response.body.should.have.property('success').eq(false);
                done();
            })
        })
    });

    //Tests the POST API to update the students details

    describe("POST /api/upload/update/:id", () => {
        it("It should update a student", (done) => {
            const id = 2;
            const student = {
                Name: "qwertyuiop",
                Age: 20,
                Mark1: 41,
                Mark2: 73,
                Mark3: 91
            };
            chai.request('http://localhost:8000')
            .post('/api/upload/update/'+id)
            .send(student)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('message').eq('Data successfully updated');
                response.body.should.have.property('success').eq(true);
                done();
            })
        });

        it("It should not update a student without the ID", (done) => {
            const student = {
                Age: 20,
                Mark1: 41,
                Mark2: 73,
                Mark3: 91
            };
            chai.request('http://localhost:8000')
            .post('/api/upload')
            .send(student)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(400);
                response.body.should.be.a('object');
                done();
            })
        })
    });

    //Test the GET API to fetch the results of students by passed/failed

    describe("GET /api/students", () => {
        it("It should GET the students who are passed", (done) => {
            let params = "passed";
            chai.request('http://localhost:8000')
            .get('/api/students?resultStatus='+params)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                done();
            })
        });

        it("It should GET the students who are failed", (done) => {
            let params = "failed";
            chai.request('http://localhost:8000')
            .get('/api/students?resultStatus='+params)
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                done();
            })
        });

        it("It should not GET the students who are passed/failed", (done) => {
            chai.request('http://localhost:8000')
            .get('/api/students?resultStatus')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq('No student records');
                done();
            })
        });
    });

    //Tests the GET API to get the CSV file of the students data

    describe("GET /api/getcsv", () => {
        it("It should GET the CSV file", (done) => {
            chai.request('http://localhost:8000')
            .get('/api/getcsv')
            .end((err, response) => {
                if(err) {
                    console.log('Cannot get api')
                }
                response.should.have.status(200);
                done();
            })
        })
    });
})