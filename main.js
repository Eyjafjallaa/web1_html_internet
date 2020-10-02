var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
  return `
<!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  <a href="/create">create</a>
  ${body}
</body>
</html>    
`;
}

function templatelist(filelist) {
  var list = '<ul>';
  var i = 0;
  for (i = 0; i < filelist.length; i++) {
    list += `<li><a 
        href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }
  list += '</ul>';
  return list;
}





console.log("server_activated");


var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = "Hello, Node.js";

        var list = templatelist(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
      })
    }
    else {

      fs.readdir('./data', function (error, filelist) {

        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list = templatelist(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);

        });
      });
    }
  }
  else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      var title = 'Web-create';
      var list = templatelist(filelist);
      var template = templateHTML(title, list, `
      <form action= http://localhost:80/process_create" method = "post">
      <p><input type="text" name= "title" placeholder = "title"></p>
      <p>
          <textarea name="description" placeholder = "description"></textarea>
      </p>
      <p>
          <input type="submit">
      </p>
      </form>
      `);
      response.writeHead(200);
      response.end(template);
    })
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }


});
app.listen(80);