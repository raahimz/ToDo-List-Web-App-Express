const express = require('express');
const bodyParser = require('body-parser');
const { send, redirect } = require('express/lib/response');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs'); // need this for ejs
app.use(express.urlencoded({extended: true})); // need this for body-parser
app.use(express.static(__dirname + '/public')); // need this for public folder

// DB
mongoose.connect('mongodb://localhost:27017/todolistDB');

const todoItemsSchema = {
    text: String,
};

const TodoItem = mongoose.model('TodoItem', todoItemsSchema);

app.get('/', function(req, res){
    const today = new Date();
    const options = {weekday:"long", day:"numeric", month:"long"};
    var day = today.toLocaleDateString("en-us", options);

    TodoItem.find({}, function(err, todoItems) {
        res.render('list', {day: day, items: todoItems});
    });
});

app.post('/', function(req, res) {
    const newItem = req.body.newItem;

    const newTodo = new TodoItem({
        text: newItem
    });
    newTodo.save();
    
    res.redirect('/');
});

app.post('/delete', function(req, res) {
    const checkbox_id = req.body.checkbox_id;

    TodoItem.find({ id:checkbox_id }).remove(function(err) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
});


app.listen(3000, function() {
    console.log('Server started on port 3000!');
});