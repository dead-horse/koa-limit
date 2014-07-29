var koa = require('koa');
var favicon = require('koa-favicon');
var couchbaseClient = require('couchbase-co'),
var limit = require('./');
var store = require('./lib/couchbase-store');

var app = koa();
app.use(favicon());

var couchbase = new couchbaseClient(
    ['host'], 'user', 'password'
).on('connected', function(){
    console.log('Connected and authenticated is ok');
}).on('error', function(p_Error){
    console.error('An error occured:', p_Error);
});

app.use(limit({
  limit: 3,
  interval: 100000,
  message: '(429)Too Many Requests.',
  store: new store(couchbase)
}));

app.use(function *() {
  this.body = 'hello';
});

app.listen(7001);
