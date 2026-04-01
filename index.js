const {initializeDatabase} = require("./db/db.connect")
const Book = require("./models/book.models")
initializeDatabase();

const express = require("express")
const app = express()

app.use(express.json())

//function to add new book to the DB

async function createNewBook(newBookData) {
    try{
        const book = new Book(newBookData)
        const saveBook = await book.save()
        return saveBook
    }catch(error){
        console.error(error)
    }
}

//API route to add new book data to the DB 

app.post("/books", async (req, res)=>{
    try{
        const savedBook = await createNewBook(req.body)
        if(savedBook) {
            res.status(201).json({message: "Book added successfully", book: savedBook})
        } else {
            res.status(400).json({error: "Something went wrong"})
        }
    }catch(error){
        res.status(500).json({error: "Failed creating new book data"})
    }
})

//function to read all books in DB

async function readAllBooks() {
    try{
        const allBookData = await Book.find()
        return allBookData
    }catch(error){
        console.log(error)
    }
}

//API route to get all the books from DB

app.get("/books", async (req, res)=>{
    try{
        const allBooks = await readAllBooks()
        if (allBooks.length != 0) {
            res.status(200).json(allBooks)
        } else {
            res.status(404).json({error: "No books found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book data"})
    }
})

//function to find book details by its title

async function findBookByTitle(bookTitle) {
    try{
        const bookByTitle = await Book.findOne({title: bookTitle})
        return bookByTitle
    }catch(error){
        throw error
    }
}

//API route to get a book's detail by its title

app.get("/books/:bookTitle", async (req, res)=>{
    try{
        const bookDetails = await findBookByTitle(req.params.bookTitle)
        if(bookDetails) {
            res.status(200).json(bookDetails)
        } else {
            res.status(404).json({error: "No book found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch the book details"})
    }
})

//Function to find book details by author name

async function findBookByAuthor(bookAuthor){
    try{
        const booksByAuthor = await Book.findOne({author: bookAuthor})
        return booksByAuthor
    }catch(error){
        throw error
    }
}

//API route to get book details by author name

app.get("/books/author/:bookAuthor", async (req, res) => {
    try{
        const bookDetails = await findBookByAuthor(req.params.bookAuthor)
        if(bookDetails){
            res.status(200).json(bookDetails)
        } else {
            res.status(404).json({error: "No books found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book details", error: error})
    }
})

// Function to get book details by genre

async function getBooksByGenre(bookGenre){
    try{
        const booksByGenre = await Book.find({genre: bookGenre})
        return booksByGenre
    }catch(error){
        throw error
    }
}

// API route to get book details by genre

app.get("/books/genre/:bookGenre", async (req, res)=>{
    try{
        const booksOfGenre = await getBooksByGenre(req.params.bookGenre)
        if(booksOfGenre){
            res.status(200).json(booksOfGenre)
        } else {
            res.status(404).json({error: "No books found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch books", error: error})
    }
})

// Function to get books by published year
async function getBooksByYear(releaseYear) {
    try {
        const booksByYear = await Book.find({ publishedYear: releaseYear });
        return booksByYear;
    } catch (error) {
        throw error;
    }
}

// API route to get books by release year

app.get("/books/year/:releaseYear", async (req, res) => {
    try {
        const books = await getBooksByYear(req.params.releaseYear);
        
        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ error: "No books found for this year" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books by year", details: error.message });
    }
})

//Function to update book details by id
async function updateBookById (bookId, dataToUpdate){
    try{
        const bookUpdated = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return bookUpdated
    }catch(error){
        throw error
    }
}

//API route to update book details by Id
app.post("/books/:bookId", async (req, res)=>{
    try{
        const updatedBook = await updateBookById(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: "Book details updated successfully", book: updatedBook})
        } else {
            res.status(404).json({error: "No books found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update book details"})
    }
})

//Function to update book details by title
async function updateBookByTitle (bookTitle, dataToUpdate){
    try{
        const bookUpdatedByTitle = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return bookUpdatedByTitle
    }catch(error){
        throw error
    }
}

//API route to update book details by title
app.post("/books/title/:bookTitle", async (req, res)=>{
    try{
        const updatedBookByTitle = await updateBookByTitle(req.params.bookTitle, req.body)
        if(updatedBookByTitle){
            res.status(200).json({message: "Book details updated successfully", book: updatedBookByTitle})
        } else {
            res.status(404).json({error: "Book doesn't exist"})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({error: "Failed to update book details", error})
    }
})

// Function to delete a book by its ID
async function deleteBookById(bookId) {
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        return deletedBook;
    } catch (error) {
        throw error;
    }
}

// API route to delete a book by its ID
app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBookById(req.params.bookId);
        if (deletedBook) {
            res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
        } else {
            res.status(404).json({ error: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete book" });
    }
})

const PORT = 7000
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
