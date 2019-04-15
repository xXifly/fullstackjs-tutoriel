var createError    = require('http-errors');
var express        = require('express');
var exphbs         = require('express-handlebars');
var mongoose       = require('mongoose');
var sassMiddleware = require('node-sass-middleware');
var browserify     = require('browserify-middleware');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var logger         = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos/index');
var todosAPIRouter = require('./routes/todos/api');

var app = express();

// view engine setup
app.engine('hbs', exphbs({extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

// Sass Middleware setup
app.use (
	sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		debug: true,
	})
);

// Browserify setup
app.get('/javascripts/bundle.js', browserify('./client/script.js'));

// Mongoose setup
var dbConnectionString = process.env.MONGODB_URI || 'mongodb://localhost';
mongoose.connect(dbConnectionString + '/todos');

// Browser Sync setup
if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/api/todos', todosAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handlerF
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
