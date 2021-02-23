const express = require('express')
const app = express()
//view파일이 있는 디렉토리 설정
app.set('views', __dirname + '/views');
// view엔진으로 ejs사용
app.set('view engine', 'ejs');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost', //나중에 서버 url
    user: 'root',
    password: 'Yejinluz0911!!',
    database: 'fintectlec'
});

connection.connect();

//connection.end();

app.get('/', function (req, res) {
    res.send('Hello World');
})
//routing 주소 추가 
app.get('/user', function (req, res) {
    // 이 주소로 이동하면 db에서 데이터 가져옴
    connection.query('SELECT * FROM user;', function (error, results, fields) {
        console.log(results);
        res.send(results);
    });
})
app.get('/ejs', function (req, res) {
    res.render('ejsTest') // ejsTest.ejs사용해서 렌더링
})

app.listen(3000);