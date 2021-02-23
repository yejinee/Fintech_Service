var http = require("http"); //http서버 만드는 라이브러리 

console.log('server started')
http.createServer(function (req, res) { //서버 만들고 해야하는 일 callback함수로 받아옴
	var body = "hello Server";
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end("<html> <h1> 안녕</h1></html>"); // 서버 실생시키면 html파일 실행
}).listen(3000); //3000번 포트를 사용(일반적인 경우 80)
// 서버 업데이트 시 다시 실행 시켜줘야함