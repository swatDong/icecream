const restify = require("restify");

const server = restify.createServer({
    name: 'test-server'
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

server.get("/*", function(req, res, next) {
    res.send(`GET: ${req.url}`);
    return next();
});
server.post("/*", function(req, res, next) {
    res.send({
        "Hello": "World",
        "POST": `${req.url}`
    });
    return next();
});

server.listen(22255, function () {
    console.log('%s listening at %s', server.name, server.url);
});