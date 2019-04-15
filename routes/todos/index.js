var express = require('express');
var router = express.Router();

var Todo = require('../../models/todos');

/*router.get('/', function(req, res) {
	Todo.find(function(err, todos) {
		if (err) return console.error(err);
		res.render('todos', {title: 'Todos', todos: todos});
	}); 
});*/

router.get('/', function(req, res, next) {
	Todo.findAsync()
	.then(function(todos) {
		res.render('todos', {title: 'Todos', todos: todos});
	})
	.catch(next)
	.error(console.error);
});

module.exports = router;