const request = require('request'); // request library를 가져옴
var parseString = require('xml2js').parseString;
var xml=undefined;
//(url, callback Function(그 이후에 해야하는 일 정의))
// json파일을 파싱하는 경우 (내장 라이브러리 있음)
request('http://newsapi.org/v2/everything?q=sam&from=2021-01-23&sortBy=publishedAt&apiKey=78bc6ddd8cdb48ceac76f5f9b9dfc4c5', function (error, response, body) { 
    var data=JSON.parse(body);
    data.articles.map(article=>{
        console.log(data.articles[0].title); //title만 뽑고 싶은 경우
    })
});
