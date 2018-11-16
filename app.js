
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require("body-parser");


var AWS = require('aws-sdk');
AWS.config.update({
    region:'eu-west-1',
    credentials: new AWS.SharedIniFileCredentials()
});
var dynamodb = new AWS.DynamoDB();

/* This example creates a table named Music. */
//Rating,Category,Test type ,Count

var params = {
    TableName: "SERVEME",
    AttributeDefinitions: [
        {
            AttributeName: "pKey",
            AttributeType: "S"
        },
        {
            AttributeName: "toolName",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "toolName",
            KeyType: "HASH"
        },
        {
            AttributeName: "pKey",
            KeyType: "Range"
        }

    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

// dynamodb.createTable(params, function(err, data) {
//     console.log(params.KeySchema);
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
// });


var app = express();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
app.use('/SERVEME', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
