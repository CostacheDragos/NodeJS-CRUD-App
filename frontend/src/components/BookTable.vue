<template>
  <div class="book-list">
    <h1>Books</h1>
    <h3 v-if="showFail" class="fail-message">Failed to delete!</h3>
    <button @click="openAdd" class="add-button">Add book</button>
    <table class="book-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.Id" class="book-row">
          <td>{{ book.Title }}</td>
          <td>{{ book.Author }}</td>
          <td>{{ book.Genre }}</td>
          <td>{{ book.Rating }}</td>
          <td>
            <div class="button-group">
              <button @click="openEdit(book)" class="edit-button">Edit</button>
              <button @click="deleteBook(book)" class="delete-button">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>
  
<script setup lang="ts">
import type { Book } from '@/interfaces/book';
import router from "@/router/index.js";
import { useBookStore } from '@/stores/bookStore';
import { onBeforeMount, reactive, ref } from 'vue';

const bookStore = useBookStore();
const books = reactive<Book[]>([])
const showFail = ref(false);


onBeforeMount(async () => {
  books.length = 0;
  books.push(...await bookStore.getAllBooks());
});


function openEdit(book: Book) {
    // Set the edited book to the one selected by the user
    bookStore.updateEditedBook(book);

    // Redirect to the edit page
    router.push("/edit");
}

function openAdd() {
  // Using the same edit form, but without setting an edited book
  bookStore.resetEdited();
  router.push("/edit");
}

async function deleteBook(book: Book) {
  if(!await bookStore.deleteBook(book)) {
    showFail.value = true;
    return;
  }

  const idx = books.findIndex(currentBook => currentBook.Id == book.Id);
  books.splice(idx, 1);
}
</script>


<style scoped>
.fail-message {
  color: red;
}

.book-list {
  max-width: 800px;
  margin: 0 auto;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.book-table th,
.book-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.book-table th {
  background-color: #f2f2f2;
}

.book-row:hover {
  background-color: #f9f9f9;
}

.add-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
}

.add-button:hover {
  background-color: #0056b3;
}

.button-group {
  display: flex;
}

.edit-button,
.delete-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 8px 15px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button {
  background-color: #dc3545;
}

.edit-button:hover,
.delete-button:hover {
  background-color: #218838;
}
</style>