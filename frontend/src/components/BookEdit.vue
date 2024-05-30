<template>
    <div class="edit-book-form">
        <h2>Edit Book</h2>
        <h3 v-if="showFail" class="fail-message">Failed to save!</h3>

        <div class="form-group">
            <label for="title">Title</label>
            <input v-model="bookStore.editedBook.Title" class="form-control">
        </div>

        <div class="form-group">
            <label for="author">Author</label>
            <input v-model="bookStore.editedBook.Author" class="form-control">
        </div>

        <div class="form-group">
            <label for="genre">Genre</label>
            <input v-model="bookStore.editedBook.Genre" class="form-control">
        </div>

        <div class="form-group">
            <label for="rating">Rating</label>
            <input v-model="bookStore.editedBook.Rating" class="form-control">
        </div>
          
        <button @click="onSubmit" class="save-button">Save</button>
        <button @click="onCancel" class="cancel-button">Cancel</button>
    </div>  
</template>

<script setup lang="ts">
import { useBookStore } from '@/stores/bookStore';
import router from "@/router/index.js";
import { ref } from 'vue';


const bookStore = useBookStore();

const showFail = ref(false);

async function onSubmit() {
    let success = false;

    // If the Id of the edited book is empty, create a new book
    if(bookStore.editedBook.Id === "") 
        success = await bookStore.createBook(bookStore.editedBook);
    else
        success = await bookStore.updateBook(bookStore.editedBook);

    if(success) {
        bookStore.resetEdited();
        router.push("/");
    } 
    else 
        showFail.value = true;
}

function onCancel() {
    router.push("/");
}
</script>


<style scoped>
.fail-message {
    color: red;
}

.edit-book-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.save-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc0a0a;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 5px;
}

.cancel-button:hover {
  background-color: #9d0606;
}
</style>