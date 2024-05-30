import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { Book } from './interfaces/book';
import mongoose, { model, Schema } from 'mongoose';
import cors from 'cors';

// Application setup
const app = express();
const PORT = 3000;

// Used to parse the request bodies
app.use(bodyParser.json());

// Allow all origins for dev purposes
app.use(cors());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/bookstore')
.then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Create a book model using mongoose for easy CRUD operations on the DB
function setupSchema(): mongoose.Model<Book> {
    const schema = new Schema<Book>({
        Title: { type: String, required: true },
        Author: { type: String, required: true },
        Genre: { type: String, required: true },
        Rating: { type: Number, required: true },
    });

    // Mapping the "_id" to "Id"
    schema.set('toJSON', {
        transform: function(document, record, options) {
            record.Id = record._id;
            delete record._id;
            delete record.__v;
        }
    });

    return model('Book', schema);
}

const BookModel = setupSchema();


// Endpoints
// Create a book
app.post("/book", async (request: Request, response: Response) => {
    const bookData: Book = request.body;

    if(!bookData)
        return response.status(400).send("Invalid book data!");

    try {
        const newBook = new BookModel(bookData);
        await newBook.save();
        response.status(200).send("Book data saved successfully");
        console.log("Book data saved successfully")
    } catch(error) {
        response.status(500).send("Failed to save book data");
        console.error(error);
    }
});

// Get all books
app.get("/books", async (_, response: Response) => {
    try {
        const books = await BookModel.find({});
        response.status(200).json(books);
    } catch (error) {
        response.status(500).send("Failed to retrieve books");
        console.error(error);
    }
});

// Update a book
app.put("/book/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    const updateData = request.body;
  
    try {
        const updatedBook = await BookModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
        if (!updatedBook) {
            return response.status(404).send("Book not found");
        }
        response.status(200).send("Book data updated successfully");
    } catch (error) {
        response.status(500).send("Failed to update book data");
    }
  });

// Delete a book
app.delete("/book/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
  
    try {
      const deletedBook = await BookModel.findOneAndDelete({ _id: id });
      if (!deletedBook) {
        console.log("Book not found");
        return response.status(404).send("Book not found");
      }

      response.status(200).send("Book deleted successfully");
      console.log("Book deleted successfully");
    } catch (error) {
        response.status(500).send("Failed to delete book");
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});