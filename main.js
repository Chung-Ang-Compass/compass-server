var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.argv[2] || 3000;
var mysql = require('mysql');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function () {
	console.log('서버 실행중...');
});


var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	database: "compass",
	password: "asdf1234!",
	port: 3306,
	insecureAuth:true	
});

app.post('/user/join', function(req,res) {
	console.log(req.body);
	var userEmail = req.body.userEmail;
	var userPwd = req.body.userPwd;
	var userName = req.body.userName;
	var userNick = req.body.userNick;

	var sql = 'INSERT INTO users (email, pwd, nickname, name) VALUES (?, ?, ?, ?)';
	var params = [userEmail, userPwd, userNick, userName];


	connection.query(sql, params, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';
		
		if (err) {
			console.log(err);
		} else {
			resultCode = 200;
			message = '회원가입에 성공했습니다';
		}


		res.json({
			'code': resultCode,
			'message': message
		});
	});
});

app.post('/user/login', function(req, res) {
	console.log(req.body);
	var userEmail = req.body.userEmail;
	var userPwd = req.body.userPwd;
	var sql = 'select * from users where email = ?';

	connection.query(sql, userEmail, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';

		if (err) {
			console.log(err);
		} else {
			if (result.length === 0) {
				resultCode = 204;
				message = 'ID 또는 비밀번호가 틀렸습니다';
			} else if (userPwd !== result[0].pwd) {
				resultCode = 204;
				message = 'ID 또는 비밀번호가 틀렸습니다';
			} else {
				resultCode = 200;
				message = result[0].name + '님 환영합니다';
			}
		}

		res.json({
			'code': resultCode,
			'message': message,
			'userEmail' : result[0].email,
			'userPwd' : result[0].pwd,
			'userNick' : result[0].nickname,
			'userName' : result[0].name,
		});
	});
});


app.post('/guide/join', function(req,res) {
	console.log(req.body);
	var userEmail = req.body.userEmail;
	var userPwd = req.body.userPwd;
	var userName = req.body.userName;
	var userNick = req.body.userNick;

	var sql = 'INSERT INTO guides (email, pwd, nickname, name) VALUES (?, ?, ?, ?)';
	var params = [userEmail, userPwd, userNick, userName];


	connection.query(sql, params, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';
		
		if (err) {
			console.log(err);
		} else {
			resultCode = 200;
			message = '회원가입에 성공했습니다';
		}


		res.json({
			'code': resultCode,
			'message': message
		});
	});
});

app.post('/guide/login', function(req, res) {
	console.log(req.body);
	var userEmail = req.body.userEmail;
	var userPwd = req.body.userPwd;
	var sql = 'select * from guides where email = ?';

	connection.query(sql, userEmail, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';

		if (err) {
			console.log(err);
		} else {
			if (result.length === 0) {
				resultCode = 204;
				message = 'ID 또는 비밀번호가 틀렸습니다';
			} else if (userPwd !== result[0].pwd) {
				resultCode = 204;
				message = 'ID 또는 비밀번호가 틀렸습니다';
			} else {
				resultCode = 200;
				message = result[0].name + '님 환영합니다';
			}
		}

		res.json({
			'code': resultCode,
			'message': message,
			'userEmail' : result[0].email,
			'userPwd' : result[0].pwd,
			'userNick' : result[0].nickname,
			'userName' : result[0].name,
		});
	});
});
		

app.post('/guide/register', function(req, res) {
	console.log(req.body);
	var userEmail = req.body.userEmail;
	var country = req.body.country;
	var city = req.body.city;
	var theme = req.body.theme;

	var sql = 'update guides set charge_country = ?, charge_city = ?, charge_theme = ? where guides.email = ?';
	var params = [country, city, theme, userEmail];
	console.log("userEmail : " + userEmail);

	connection.query(sql, params, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';

		if (err) {
			console.log(err);
		} else {
			console.log("가이드 등록 성공");
			resultCode = 200;
			message = '가이드 등록에 성공했습니다';
		}

		res.json({
			'code': resultCode,
			'message': message,
		});
	});
});

app.post('/guide', function(req, res){
	console.log(req.body)
	var requestNumber = req.body.requestNumber;
	
	var sql = 'select * from guides'

	if(requestNumber == 1){
		connection.query(sql, function(err, result){
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if(err){
				console.log(err);
			}else{
				console.log('가이드 검색 완료');
				resultCode = 200;
				message = '가이드 검색 완료했습니다';
			}
			
			var aJsonArray = new Array();
			
			for(var i = 0; i <result.length; i++){

				var aJson = new Object();

				aJson.code = resultCode;
				aJson.message = message;
				aJson.guideName = result[i].name;
				aJson.country = result[i].charge_country;
				aJson.city = result[i].charge_city;
				aJson.theme = result[i].charge_theme;

				aJsonArray.push(aJson);
			}

			res.json(aJsonArray);
		});

	}
});
