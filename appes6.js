//class Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }
}

//class UI
class UI {

    addBookToList(book) {
        const list = document.getElementById("book-list");

        //Create an element
        const row = document.createElement("tr");

        //insert cols
        row.innerHTML = `
        <td> ${book.title} </td>
        <td> ${book.author} </td>
        <td>${book.isbn}</td>
        <td> <a href="#" class="delete">X</a></td>
    `;

        //append the row to the list
        list.appendChild(row);
    }

    showAlert(message, className) {
        //Create a div
        const div = document.createElement("div");

        // add classnames to the div
        div.className = `alert ${className}`;

        //create a text node
        div.appendChild(document.createTextNode(message));

        //Now we use event delegation to get the parent so that we can insertBefore the element that we want
        const container = document.querySelector(".container");
        const form = document.getElementById("book-form");

        //Now we need to insert our error message
        container.insertBefore(div, form);

        //Now we need to add a timeout so that the error/success message disappears after few seconds
        setTimeout(function () {
            document.querySelector(".alert").remove();
        }, 2000);

    }

    removeBook(target) {
        if (target.className === "delete") {
            target.parentElement.parentElement.remove();
        }

    }

    clearFields() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }

}

//class Store
class Store {

    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static displayBooks() {

        const books = Store.getBooks();

        books.forEach(function (book) {
            //instantiating the UI class
            const ui = new UI();

            //Using the addToBookList function so that we dont have to repeat ourself
            ui.addBookToList(book);

        });


    }

    static addBooks(book) {

        const books = Store.getBooks();

        books.push(book);

        //Setting the books to local storage
        localStorage.setItem("books", JSON.stringify(books));

    }

    static removeBooks(isbn) {
        const books = Store.getBooks();

        books.forEach(function (book, index) {

            if (book.isbn === isbn) {
                books.splice(index, 1);
            }

        });

        //Set the changes to local storage
        localStorage.setItem("books", JSON.stringify(books));
    }
}

//DOM load event to load things inside the DOM
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event listener for adding the book
document.getElementById("book-form").addEventListener("submit", function (e) {
    //getting the form values
    const title = document.getElementById("title").value,
        author = document.getElementById("author").value,
        isbn = document.getElementById("isbn").value;

    //Creating an object of the book class
    const book = new Book(title, author, isbn);

    //Creatin an object of the UI class
    const ui = new UI();

    //Validate the input fields
    if (title === "" || author === "" || isbn === "") {

        //showAlert prototype sp that we can add our custom error message
        ui.showAlert("Please add something", "error");
    }
    else {
        //add book to list
        ui.addBookToList(book);

        //store to local storage
        Store.addBooks(book);

        //Show the success alert when the book is added
        ui.showAlert("Book successfully added!", "success");

        //Clear the input fields after adding the books
        ui.clearFields();
    }

    e.preventDefault();

});

//Event listener for deleting the book
document.getElementById("book-list").addEventListener("click", function (e) {

    //Instantiate the UI
    const ui = new UI();

    //removeBook function is called
    ui.removeBook(e.target);

    //Remove from local storage
    //Now we want to remove the element but we dont have ids or classnames so we have to use a little DOM magic here
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    //showAlert
    ui.showAlert("Book deleted successfully", "success");


    e.preventDefault();
});