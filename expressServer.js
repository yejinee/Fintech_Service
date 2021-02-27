const express = require('express')
const path = require('path');
const app = express();
const request = require('request');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth'); //middleware
//var moment = require('moment');
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
app.get('/main', function (req, res) {
    res.render('main');
})
app.get('/signup', function (req, res) {
    res.render('signup');
})
app.get('/login', function (req, res) {
    res.render('login');
})
app.get('/authTest', auth, function (req, res) {
    res.send("정상적인 로그인");
})
app.get('/balance', function (req, res) {
    res.render('balance');
})
app.get('/transactionList', function (req, res) {
    res.render('transactionList');
})
app.get('/qrcode', function (req, res) {
    res.render('qrcode');
})
app.get('/qrreader', function (req, res) {
    res.render('qrreader');
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
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%" // key가 고유값 가짐으로 사칭불가
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
// 아무나 접근할 수 없게 auth 추가
app.post('/list', auth, function (req, res) {
    var user = req.decoded;
    console.log(user);
    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function (err, result) {
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log("dbuser임")
            console.log(dbUserData);
            console.log(dbUserData.accesstoken);
            var option = {
                method: "GET",
                url: "https://testapi.openbanking.or.kr/v2.0/user/me",
                headers: {
                    Authorization: "Bearer " + dbUserData.accesstoken
                },
                qs: {
                    user_seq_no: dbUserData.userseqno
                }
            }
            request(option, function (err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var listRequestResult = JSON.parse(body);
                    console.log(listRequestResult);
                    res.json(listRequestResult);
                }
            })
        }
    })
})

//사용자 정보 조회
var companyId = "M202111591U";//이용기관 코드 + U
app.post('/balance', auth, function (req, res) {
    var user = req.decoded;
    var finusernum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = companyId + countnum;
    //var transdtime = moment(new Date().format('YYYYMMDDhhmmss'));

    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function (err, result) {
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method: "GET",
                url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers: {
                    Authorization: "Bearer " + dbUserData.accesstoken
                },
                qs: {
                    bank_tran_id: transId,
                    fintech_use_num: finusernum,
                    tran_dtime: "20190910101921"
                }
            }

            request(option, function (err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var balanceRquestResult = JSON.parse(body);
                    console.log(balanceRquestResult);
                    res.json(balanceRquestResult);
                }
            })
        }
    })
})

// 거래 내역 조회 
app.post('/transactionList', auth, function (req, res) {
    var user = req.decoded;
    var finusernum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = companyId + countnum;
    //var transdtime = moment(new Date().format('YYYYMMDDhhmmss'));

    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function (err, result) {
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log("이거 진행 완료")
            console.log(dbUserData);
            // TEST
            var option = {
                method: "GET",
                url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
                headers: {
                    Authorization: "Bearer " + dbUserData.accesstoken
                },
                qs: {
                    bank_tran_id: transId,
                    fintech_use_num: finusernum,
                    inquiry_type: 'A',
                    inquiry_base: 'D',
                    from_date: "20190101",
                    to_date: "20190101",
                    sort_order: "D",
                    tran_dtime: "20200910101921"
                }
            }
            request(option, function (err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var transactionRequestResult = JSON.parse(body);
                    console.log(transactionRequestResult);
                    res.json(transactionRequestResult);
                }
            })

        }
    })

})

// 사용자 출금 이체 api설정
app.post('/withdraw',auth,function(req,res){
    var user = req.decoded;
    var sql = "SELECT * FROM user WHERE id = ?";
    var finusernum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = companyId + countnum;
    connection.query(sql, [user.userId], function (err, result) {
        if (err) throw err;
        else { //request 출금 이체 Api요청하기 
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method: "POST",
                url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
                headers: {
                    Authorization: "Bearer " + dbUserData.accesstoken
                },
                json: {
                    "bank_tran_id" : transId,
                    "cntr_account_type" : "N",
                    "cntr_account_num" : "56426562324644",
                    "dps_print_content": "쇼핑몰환불",
                    "fintech_use_num": req.body.fin_use_num,
                    "wd_print_content": "오픈뱅킹출금",
                    "tran_amt": req.body.amount,
                    "tran_dtime": "20201120105100",
                    "req_client_name": "김예진",
                    "req_client_fintech_use_num" : req.body.fin_use_num,
                    "req_client_num": "HONGGILDONG1234",
                    "transfer_purpose": "ST",
                    "recv_client_name": "김예진",
                    "recv_client_bank_code": "097",
                    "recv_client_account_num": "56426562324644"
                }
            }
            request(option, function (err, response, body) {
                if (err) {

                    console.error(err);
                    throw err;
                }
                else {
                    var transactionListResult = body; // parsing 할 필요 없음
                    
                    //res.json(transactionListResult);
                    // 입금 api 실행 (A000 res_code 입금 이체발생)
                    //transid, countnum 다시 새로 만들어주기 
                    // 2legged의고정값 사용하기
                    if(transactionListResult.rsp_code=="A0000"){
                        var countnum2 = Math.floor(Math.random() * 1000000000) + 1;
                        var transId2 = companyId + countnum2;  
                        //var transdtime2 = moment(new Date()).format('YYYYMMDDhhmmss');                    
                        var option = {
                            method : "POST",
                            url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
                            headers : {
                              Authorization : "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJNMjAyMTExNTkxIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjIyMDg5NTgzLCJqdGkiOiIyNjQ0ZjhlOS0wZWNjLTQ3MzYtYjRhNi01NTE1MWNmNWQwZWEifQ.ciyi_zwtfNfgCqQAvrDFVq0sb7LLGhmgiRnkAd1RPxo"
                            },
                            //get 요청을 보낼때 데이터는 qs, post 에 form, json 입력가능
                            json : {
                              "cntr_account_type": "N",
                              "cntr_account_num": "56426562324644",
                              //"req_client_bank_code" : 97,
                              "wd_pass_phrase": "NONE",
                              "wd_print_content": "환불금액",
                              "name_check_option": "on",
                              "tran_dtime": "20201120105100",
                              "req_cnt": "1",
                              "req_list": [
                                {
                                  "tran_no": "1",
                                  "bank_tran_id": transId2,
                                  "fintech_use_num": req.body.to_fin_use_num,
                                  "print_content": "쇼핑몰환불",
                                  "tran_amt": req.body.amount,
                                  "req_client_name": "김예진",
                                  "req_client_num": "HONGGILDONG1234",
                                  "req_client_fintech_use_num": req.body.fin_use_num,
                                  "transfer_purpose": "ST"
                                }
                              ]
                            }
                        }
                        request(option, function (error, response, body) {
                            console.log(body);
                            console.log("이거염");
                            res.json(body);
                        });

                    }
                    //입금 api 실행 A0000 res_code 입급이체 발생
                    

                }
            })

        }
    })
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




app.post('/rest', auth, function(req, res){
    var user = req.decoded;
    console.log(user);
    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql,[user.userId], function(err, result){
        if(err) throw err;
        else {
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_nume",
                headers : {
                    Authorization : "Bearer " + dbUserData.accesstoken
                },
                qs : {
                    bank_tran_id : dbUserData.userseqno
                    fintech_use_num :
                    tran_dtime :
                }
            }
            request(option, function(err, response, body){
                if(err){
                    console.error(err);
                    throw err;
                }
                else {
                    var listRequestResult = JSON.parse(body);
                    res.json(listRequestResult)

                }
            })
        }
    })
})

*/

