require('dotenv').config();
const express = require('express');
let bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const cors = require('cors');
const app = express();
let mongoose = require("mongoose");


mongoose.connect("MONGO_URI", { useNewUrlParser: true, useUnifiedTopology: true });

//mongosetup
const linkSchema = new mongoose.Schema({
  original_url: String
});

var Link = mongoose.model("Link", linkSchema);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));


app.use(function middleware(req, res, next) {
       //console.log(req.method + " " + req.path +" - "+ req.ip );
    next();
}
       );

app.post("/api/shorturl", function (req, res) {
  //console.log(Object.keys(req));
   ourl = req.body.url;
 const lookup = dns.lookup(urlParser.parse(ourl).hostname,(err,address)=>{
    if(err) return console.log(err)
    if(!address){
      return res.json({ error: 'invalid url' })
    }else{
  
  //console.log(req.body);
  //console.log(req.res);
  //console.log(req.route);
  const url = new Link({original_url:ourl})
      url.save((err,data)=>{
        console.log(data);
        res.json({
          original_url: data.original_url,
          short_url: data.id
        })
      })
    }});
    
  //var obj = {original_url: ourl, short_url:"1"};
  //console.log(obj);
  //res.json(obj);
});

app.get('/api/shorturl/:id',(req,res)=>{
  const id = req.params.id
  Link.findById(id,(err,data)=>{
    if(!data){
      res.json({error:"Invalid URL"})
    }else{
      res.redirect(data.original_url)
    }
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
