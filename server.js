const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT||5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin:admin@cluster0.nnmoam9.mongodb.net/?appName=notes");

const noteSchema = mongoose.Schema({
    title: String,
    content: String
})

const Note = mongoose.model('Note', noteSchema);

app.get("/notes", async (req, res) => {
    try {
        const response = await Note.find();
        res.json(response);
    }
    catch (err) {
        res.status(504).json({ err: "server error" })
    }
})

app.post("/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400).json("Title and content required");
    }
    else {
        const newNote = new Note({ title, content });
        try {
            const savedNote = await newNote.save();
            res.json(savedNote);
        } catch (error) {
            res.sendStatus(500).json({ error: "Server Error" });
        }
    }
})

app.delete("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const foundNote = await Note.deleteOne({ _id: id });
    if (foundNote.deletedCount == 1) {
        res.json("note deleted successfully");
    }
    else {
        res.status(400).json("Error deleting the node");
    }
})

app.put("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    if (!title || !content) {
        res.json("Title and content required");
    }
    else {
        try {
            const updatedNote = await Note.findByIdAndUpdate(id, { title: title, content: content });
            console.log(updatedNote);
        }
        catch (error) {
            console.log(error)
        }
    }
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})