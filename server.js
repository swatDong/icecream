const restify = require("restify");
const icecream = require("./icecream");

const server = restify.createServer({
    name: 'icecream-server'
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

async function forwardIcecream(req, res, next) {
    if (!req.path().startsWith("/_")) {
        const taste = await icecream.forward(req, res);
        if (taste) {
            Object.entries(taste.headers).forEach(header => res.setHeader(header[0], header[1]));
            res.send(taste.body);
        }
    }
    return next();
}

server.del("/*", forwardIcecream);
server.get("/*", forwardIcecream);
server.head("/*", forwardIcecream);
server.opts("/*", forwardIcecream);
server.post("/*", forwardIcecream);
server.put("/*", forwardIcecream);

server.get("/_icecream", async function (req, res, next) {
    res.send(icecream.shift());
    return next();
});

server.post("/_icecream", async function (req, res, next) {
    icecream.done(req.body);
    res.send("Ok");
    return next();
});

server.listen(22333, function () {
    console.log('%s listening at %s', server.name, server.url);
});