const fs = require('fs');
const requestHeader = (req,res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/')
    {
       // res.setHeader('content-type','text/html');
        res.write('<html>');
        res.write('<head><title>Enter message</title></head>');
        res.write('<body><form action="/message" method="POST"> <input type="text" name="message"> <button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end();      
    }
    if(url === "/message" && method === "POST")
    {
      const body = [];
      req.on('data',(chunk) =>{
        console.log(chunk);
        body.push(chunk);
      });
      req.on('end',() =>{
        const parsedbody = Buffer.concat(body).toString();
        const message = parsedbody.split('=')[1];
        fs.writeFileSync('message.txt',message);
      });
        res.statusCode = 302;
        res.setHeader('location','/');
        return res.end();
    }
  res.setHeader('content-type','text/html');
  res.write('<html>');
  res.write('<head><title>first page</title></head>');
  res.write('<body><h1> Hello from node.js </h1></body>')
  res.write('</html>');
  res.end();

};

module.exports.handler = requestHeader;
module.exports.sometext = 'some hard code';
