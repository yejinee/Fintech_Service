const request = require('request'); // request library를 가져옴
var parseString = require('xml2js').parseString;
var xml=undefined;
//(url, callback Function(그 이후에 해야하는 일 정의))
request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) { 
    // xml형식으로 작성된 파일을 라이브러리 이용해서 바꾸기 
    //console.log('body:', body); // Print the HTML for the Google homepage.
    var xml = body;
    parseString(xml, function (err, result) {
        //console.dir(result.rss.channel);
        // work3) wf 데이터 조회후 출력
        console.dir(result.rss.channel[0].item[0].description[0].header[0].wf);

    });

});

/* 이렇게 되는 경우 request하기 전에 pareString이먼저 실행 그래서 콜백함수 안에 이 parseString을 넣어줘야함 
var parseString = require('xml2js').parseString;
var xml=undefined;
request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) { 
    xml = body;
});
parseString(xml, function (err, result) {
        console.dir(result);
    });
*/
