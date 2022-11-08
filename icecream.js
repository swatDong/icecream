var ID = 9;
const QUEUE = [];
const MAP = new Map();

function forward(req, res) {
    const current = ID++;
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const body = req.body;
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => {
            // reject("TimeOut"); // TODO: error handling
            resolve(undefined);
        }, 31000);
        MAP.set(current, {
            method: method,
            url: url,
            headers: headers,
            body: body,
            timeout: t,
            resolve: resolve,
            reject: reject
        });
        QUEUE.push(current);
    });
}

function shift() {
    const id = QUEUE.shift();
    if (id) {
        const icecream = MAP.get(id);
        if (icecream) {
            return {
                id: id,
                method: icecream.method,
                url: icecream.url,
                headers: icecream.headers,
                body: icecream.body
            };
        }
    }

    return {};
}

function done(taste) {
    const id = taste.id;
    const icecream = MAP.get(id);
    MAP.delete(id);
    if (icecream) {
        clearTimeout(icecream.timeout);
        icecream.resolve(taste);
    }
}

module.exports = {
    forward,
    shift,
    done
}