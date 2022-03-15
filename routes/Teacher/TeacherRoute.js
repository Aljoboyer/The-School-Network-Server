const router = require("express").Router();
const mongoose = require("mongoose");
const RequestCare = require("../../models/Student/requestCare");
const ResultSchema = require("../../models/Shared/ResultSchema");
const ResultCollection = new mongoose.model("ResultCollection", ResultSchema);
const NoticeSchema = require("../../models/Teacher/NoticeSchema");
const StudentNoticeCollection = new mongoose.model(
    "studentnoticecollection",
    NoticeSchema
);
const userSchema = require("../../models/Shared/UserSchema");
const userCollection = new mongoose.model("usercollection", userSchema);
const BookCollection = require("../../models/Teacher/AddBook");
const ObjectId = require('mongodb').ObjectId; 

//geting all student extra care
router.get("/requestCare", async (req, res) => {
    const teacherclass = req.query.teacherclass;

    const requests = await RequestCare.find({class: teacherclass}); //here RequestCare is the schema name
    res.status(200).json(requests);
});
router.post("/PublishResult", async (req, res) => {
    const result = new ResultCollection(req.body);
    try {
        await result.save();
        res.send({ success: "success" });
    } catch (er) {
        console.log(er);
    }
});

// Publish notice from teachers for students
router.post("/PublishNotice", async (req, res) => {
    const notice = new StudentNoticeCollection(req.body);
    
    try {
        await notice.save();
        res.send({ success: "success" });
    } catch (er) {
        console.log(er);
    }
});

// Get teachers information
router.get("/TeacherProfile", async (req, res) => {
    const teacherEmail = req.query.email;
    const response = await userCollection.findOne({ email: teacherEmail });
    res.send(response);
});

// Update teachers profile picture
router.put("/UpdateTeacherDP", async (req, res) => {
    const email = req.query.email;
    const front = req.files.userImage.data;
    // console.log(email);

    const encodedpic1 = front.toString("base64");
    const img = Buffer.from(encodedpic1, "base64");

    const query = { email: email };
    const update = await userCollection.findOneAndUpdate(
        query,
        { $set: { img: img } },
        { upsert: true }
    );
    res.send(update);
});

// Add teacher info
router.put("/AddTeacherInfo", async (req, res) => {
    const personalStatement = req.body.personalStatement;
    const education = req.body.education;
    const email = req.body.email;
    // console.log(statement, education, email);
    const query = { email: email };
    const update = await userCollection.findOneAndUpdate(
        query,
        {
            $set: { personalStatement, education },
        },
        { upsert: true }
    );
    res.send(update);
});

// Add teacher info
router.get("/GetIndividualCare/:id", async (req, res) => {
    const id = req.params.id;
    console.log('ids', id)
    const care = await RequestCare.findOne({_id: Object(id)})
    res.send(care);
});

// Add teacher info
router.get("/ChangeRequestHandler", async (req, res) => {
    const query = {_id: Object(req.query.id)};
    const status = req.query.status;
    await RequestCare.findOneAndUpdate(query, {$set: {status: status,}}, {upsert: true})
    res.send({status: status});
});

//Teacher Adding Book Library to book
router.post("/AddBook", async (req, res) => {
    const data = req.body;
    const imgdata = req.files.bookImg.data;

    const encodedpic1 = imgdata.toString("base64");
    const bookImg = Buffer.from(encodedpic1, "base64");
    const book = {...data, bookImg}

    const addBook = new BookCollection(book);
    
    await addBook.save();

    res.send({success: 'success'});
});

// Add teacher info
router.get("/GetAllBooks", async (req, res) => {
    console.log('hitted')
    const books = await BookCollection.find()
  
    res.send(books);
});

module.exports = router;
