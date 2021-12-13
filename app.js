//Here we use the es5 prototypes to create the project

//Book constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//UI constructor
function UI() { }

//showAlert prototype for error message/ success message
UI.prototype.showAlert = function(message,className){

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
    container.insertBefore(div,form);

    //Now we need to add a timeout so that the error/success message disappears after few seconds
    setTimeout(function(){
        document.querySelector(".alert").remove();
    },2000);


}

//prototype addBookToList
UI.prototype.addBookToList = function (book) {
    const list = document.getElementById("book-list");

    //Create an element
    const row = document.createElement("tr");

    //insert cols
    row.innerHTML = `
        <td> ${book.title}</td>
        <td> ${book.author}</td>
        <td> ${book.isbn}</td>
        <td> <a href="#" class="delete">X</a></td>
    `;

    //append the row to the list
    list.appendChild(row);
}

//removeBook prototype
UI.prototype.removeBook = function(target){

    //We'll use event delegation here
    if(target.className === "delete"){
        target.parentElement.parentElement.remove();
    }

}


//clearInputFields prototype
UI.prototype.clearFields = function () {

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";

}


//Event listener for adding the book
document.getElementById("book-form").addEventListener("submit", function (e) {
    //getting the form values
    const title = document.getElementById("title").value,
        author = document.getElementById("author").value,
        isbn = document.getElementById("isbn").value;

    //Instantiating the book constructor
    const book = new Book(title, author, isbn);

    //Instantiate the UI
    const ui = new UI();

    //Validate the input fields
    if (title === "" || author === "" || isbn === "") {
        
        //showAlert prototype sp that we can add our custom error message
        ui.showAlert("Please add something","error");
    }
    else {
        //add book to list
        ui.addBookToList(book);

        //Show the success alert when the book is added
        ui.showAlert("Book successfully added!","success");

        //Clear the input fields after adding the books
        ui.clearFields();
    }



    e.preventDefault();

});

//Event listener for deleting the book
document.querySelector("#book-list").addEventListener("click",function(e){

    //Instantiate the UI
    const ui = new UI();

    //removeBook function is called
    ui.removeBook(e.target);

    //showAlert
    ui.showAlert("Book deleted successfully", "success");

    e.preventDefault();
});
