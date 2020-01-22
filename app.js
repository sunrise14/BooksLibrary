//setting up the server and test if it runs
var express = require('express');
var app = express(); // allows to add routes and serve as server

// to grab elements from front end and from within our url
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');

var db = 'mongodb://localhost/example';
mongoose.connect(db);

app.use(bodyParser.json()) //use body parser to parse json , you have to say it explicitly for json 
app.use(bodyParser.urlencoded({ //enables us to give and receive body elements through url so that we can use it with postman
    extended:true
}))
//adding routes
//location and we pass in a callback which takes request and response object.
// Request is anything that we get back from the user such as when they type something into input field and if ewe want to get that. 
//Response is what we give to the user.
app.get('/', (req,res) => {
    res.send('happy to be here');
})

app.get('/books',(req,res)=>{
    console.log("getting all books");
    Book.find({})
    .exec((err, books)=>{
        if(err){
            res.send('error has occured');
        } else {
            console.log(books);
            res.json(books);
        }
    })

})

app.get('/books/:id',(req,res) => {
    console.log('getting one book');
    Book.findOne({ //findOne method from mongoose
        _id:req.params.id
    })
    .exec((err,book)=>{
        if(err){
            res.send('error occured')
        } else{
            res.json(book);
        }
    })
})

app.post('/book', (req, res) => {
    var newBook = new Book();
    console.log("req", req);
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save((err, book)=>{
        if(err){
            res.send("error saving the book");
        }else{
            console.log(book);
            res.send(book);
        }
    })
})

app.post('/book2', (req,res)=>{
    Book.create(req.body, (err,book) => {
        if(err){
            console.log("error saving the book");
        }else{
            console.log("saved the book to db");
            res.send(book);
        }
    })
})

app.put('/book/:id',(req,res)=>{
    Book.findOneAndUpdate({
        _id:req.params.id
    },{
        $set:{title:req.body.title}
    },{
        upsert:true
    },
    function(err, newBook){
            if(err) {
                console.log("error updating book info")
            } else {
                console.log("updated book info");
                res.status(204)
            }
            })
})

app.delete('/book/:id',(req,res)=>{
    Book.findByIdAndRemove({
        _id:req.params.id
    },(err, book) => {
        if(err){
            console.log("error deleting the book")
        }else{
            res.send(204)
        }
    })
})

var port = 8080;

//to start server
app.listen(port, function(){
    console.log('app listening on port'+port);
})