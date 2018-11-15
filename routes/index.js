var express = require('express');
var router = express.Router();

router.get('/basic', function(req, res, next) {
  res.send("testing string response")
});

module.exports = router;
