const express = require('express')
const path = require('path');
const app = express();
const request = require('request');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth'); //middleware

// json타입에 데이터 전송 허용
app.use(express.json());
// form타입에 데이터 전송 허용
app.use(express.urlencoded({ extended: false }));
// 다운받은 디자인을 사용받기 위함
app.use(express.static(path.join(__dirname, 'public')));//to use static asset

//view파일이 있는 디렉토리 설정
app.set('views', __dirname + '/views');
// view엔진으로 ejs사용
app.set('view engine', 'ejs');

// DB연결
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost', //나중에 서버 url
    user: 'root',
    password: 'Yejinluz0911!!',
    database: 'fintectlec'
});

connection.connect();

//connection.end();

// Routing
app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/signup', function (req, res) {
    res.render('signup');
})
app.get('/login', function (req, res) {
    res.render('login');
})
// login부분 처리
app.post('/login', function (req, res) {
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    console.log(userEmail, userPassword)
    // sql query 실행
    var sql = "SELECT * FROM user WHERE email = ?";
    connection.query(sql, [userEmail], function (err, result) {
        if (err) {
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            console.log(result);
            if (result.length == 0) {// 사용자가 없는 경우 
                res.json(3)
            }
            else { // 있는 경우 
                var dbPassword = result[0].password;
                if (dbPassword == userPassword) {
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                    // jwt lib사용
                    jwt.sign(
                        {
                            userId: result[0].id,
                            userEmail: result[0].email
                        },
                        tokenKey, // data 암호화 시킴 
                        {
                            expiresIn: '10d',
                            issuer: 'fintech.admin',
                            subject: 'user.login.info'
                        },
                        function (err, token) {
                            console.log('로그인 성공', token)
                            res.json(token)
                        }
                    )
                }
                else {
                    res.json(2);
                }
            }
        }
    })

})

// signup 이후에 나오는 인증 페이지
app.get('/authResult', function (req, res) {
    var authCode = req.query.code; /// auth코드 받아옴
    // request 모듈의 option전달할 수 있게 만들어줌 (POSTMAN참고)
    var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            code: authCode,
            client_id: "96995a3b-3559-4421-86e5-1d32af753c87",
            client_secret: "bb245e85-9bf5-4037-b9b1-a6a857efcf62",
            redirect_uri: "http://localhost:3000/authResult",
            grant_type: "authorization_code"
        }
    }
    request(option, function (err, response, body) { // 위의 수행결과가 body에 담김 
        if (err) {
            console.error(err);
            throw err;
        }
        else {
            var accessRequestResult = JSON.parse(body); //json파일로 오기때문에 파싱해서 오브젝트화 시킴
            console.log(accessRequestResult);
            res.render('resultChild', { data: accessRequestResult });

        }
    })
})
// 회원가입시 회원정보 저장 
app.post('/signup', function (req, res) {
    // signup의 data의 key값 가져오기
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;

    console.log(userName, userEmail, userPassword, userAccessToken);

    var sql = "INSERT INTO user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?,?,?,?,?,?)";
    // 동적인 값 넣고 싶을 때는 배열을 넣어줄 것 
    connection.query(sql, [userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo], function (err, result) {
        if (err) { //에러처리 해주기 , err프로세스 종료 
            console.error(err);
            throw err;
        }
        else {
            res.json(1);  // json으로 응답
        }
    });

})
app.get('/authTest', auth, function (req, res) {
    res.send("정상적인 로그인");
})
app.listen(3000);

/*
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
// post방식 이용해서 요청
app.post('/userData', function (req, res) {
    console.log("사용자 요청 발생");
    console.log(req.body); //undefined나옴(왜? 선언을 제대로 안해서 )
    res.send(true); //요청에 대한 응답 (페이지의 개발자 도구 들어가보면 true가 된거 볼 수 있음 )
})
app.get('/designTest', function(req, res){
    res.render("designSample");
})
*/