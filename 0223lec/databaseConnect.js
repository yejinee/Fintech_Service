var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost', //나중에 서버 url
  user     : 'root',
  password : 'Yejinluz0911!!',
  database : 'fintectlec'
});
 
connection.connect();
 
connection.query('SELECT * FROM user;', function (error, results, fields) {
  console.log(results);
});
 
connection.end();