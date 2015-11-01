var express = require('express');
var app = express();

app.use('/', express.static('../client/build/'));

var server = app.listen(3000, function () {
  console.log('Express server listening');
});
