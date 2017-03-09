var http = require("http");
var fs = require("fs");
var url = require("url");

http.createServer(start).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');

function start(request, response) {
	var pathname = url.parse(request.url).pathname.substr(1);
	console.log("pathname: " + pathname);
	if (pathname == "") {
		load("index.html", response);
	} else if (pathname == "css/style.css") {
		load(pathname, response);
	} else if (pathname.search(/js/i) > -1) {
		load(pathname, response);
	} else if (pathname.search(/images/i) > -1) {
		load(pathname, response);
	}
}

function load(pathname, response) {
	fs.readFile(pathname, function (err, data) {
		if (err) {
			console.log(err.stack);
		} else {
			response.write(data);
			response.end();
		}
	});
}
