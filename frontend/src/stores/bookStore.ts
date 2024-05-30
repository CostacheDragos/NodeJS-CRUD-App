import type { Book } from "@/interfaces/book";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBookStore = defineStore("bookStore", () => {
        const emptyBook = {
            Id: "",
            Title: "",
            Author: "",
            Genre: "",
            Rating: 0
        };

        const baseURL = "http://localhost:3000";

        const editedBook = ref<Book>(emptyBook);
        
        function updateEditedBook(newBook: Book){
            editedBook.value = newBook;
        }

        function resetEdited() {
            editedBook.value = emptyBook;
        }

        async function createBook(book: Book): Promise<boolean> {
            try {
                const response = await fetch(`${baseURL}/book`, 
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(book)    
                });
    
                if(response.status !== 200)
                    return false;
                
                return true;
            } catch(error) {
                console.error(error);
                return false;
            }
        }

        async function updateBook(book: Book): Promise<boolean> {
            try {
                const response = await fetch(`${baseURL}/book/${book.Id}`, 
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(book)    
                });
    
                if(response.status !== 200)
                    return false;
                
                return true;
            } catch(error) {
                console.error(error);
                return false;
            }
        }

        async function getAllBooks(): Promise<Book[]> {
            try {
                const response = await fetch(`${baseURL}/books`);
    
                if(response.status !== 200)
                    return [];
    
                const books: Book[] = await response.json();
                console.log(books);
    
                return books;
            } catch(error) {
                console.error(error);
                return [];
            }
        }

        async function deleteBook(bookToBeDeleted: Book): Promise<boolean>  {
            try {
                const response = await fetch(`${baseURL}/book/${bookToBeDeleted.Id}`, 
                    {
                        method: "DELETE"
                    }
                );
    
                if(response.status !== 200)
                    return false;
                
                return true;
            } catch(error) {
                console.error(error);
                return false;
            }
        }
        
        return { editedBook, updateEditedBook, resetEdited, createBook, getAllBooks, updateBook, deleteBook };
    }
);