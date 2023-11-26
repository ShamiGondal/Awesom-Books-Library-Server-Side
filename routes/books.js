const mongoose = require('mongoose');
const express = require('express');
const Book = require('../model/books');
const multer = require('multer');
const moment = require('moment'); 
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//.end point to fetch the rooms

router.get('/fetchBooks', [], async (req, res) => {

  try {

    const allBooks = await Book.find()
    res.json(allBooks)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }

})


//end point to fetch the rooms with id
router.get('/fetchBook/:id', [], async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {

    const singleBook = await Book.findOne({ _id: id });
    res.json(singleBook)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }

})


//end point to add the room

router.post('/addBook', upload.single('picture'), async (req, res) => {

  try {

    const { picture, name, description, Rtype, comments, likes, price } = req.body;
    const newBook = new Book({ picture, name, description, Rtype, comments, likes, price });
    const savedBook = await newBook.save()
    res.json(savedBook)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred +backend");
  }

});


//end point to like the room
router.post('/likes/:id', [], async (req, res) => {
  const bookId = req.params.id.replace(/["']/g, '');

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.likes === undefined) {
      return res.status(500).json({ success: false, message: 'Likes property not found in the Book' });
    }
    book.likes += 1;
    await book.save();
    res.json({ success: true, message: 'Like increased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//end point to comment on room
router.post('/comments/:id', [], async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.comments === undefined) {
      return res.status(500).json({ success: false, message: 'comment property not found in the Book' });
    }
    const { comments } = req.body;
    book.comments.push(comments);
    await book.save()
    res.json({ success: true, message: 'Comment added successfully', book });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

})


//end point to delete the reservation
router.delete('/deleteBook/:id', async (req, res) => {
  const bookId = req.params.id.replace(/["']/g, '');

  try {
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




module.exports = router;