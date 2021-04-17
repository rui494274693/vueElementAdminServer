// app.js
"use strict"

var express = require('express');
var app = express();
var bodyParse = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require("fs");

var path = require("path");

//获取文件夹下的所有文件
const getAllFile = function(dir) {
	let res = []

	function traverse(dir) {
		fs.readdirSync(dir).forEach((file) => {
			const pathname = path.join(dir, file)
			// console.log(file)
			if (fs.statSync(pathname).isDirectory()) {
				traverse(pathname)
			} else {
				res.push(pathname)
			}
		})
	}
	traverse(dir)
	return res;
}

app.use(cookieParser());
app.use(bodyParse.urlencoded({
	extended: false
}));
app.use(express.static('public'));

// 解决跨域问题
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers',
		'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	res.header('Content-Type', 'text/html;charset=utf8');
	if (req.method == 'OPTIONS') {
		res.send(200);
		/*让options请求快速返回*/
	} else {
		next();
	}
});

//获取所有的模拟的接口js
const allFile = getAllFile('./mock');

allFile.forEach(file => {
	// 是json文件的
	if (file.indexOf('.json') >= 0) {

		let mockUrl = '/' + file.replace(/.json/, "").replace(/\\/g, '/').replace(/mock\//, ""); //接口路径
		
		let data = require('./' + file); //接口数据
		console.log(' http://127.0.0.1:3000'+mockUrl)
		//模拟接口 
		app.all(mockUrl, function(req, res) {
			res.end(JSON.stringify(data));
		})

	}
})


// 监听3000端口
var server = app.listen(3000, function() {
	console.log('listening at =====> http://127.0.0.1:3000');
});
