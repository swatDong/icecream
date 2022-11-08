const fetch = require("node-fetch");

const args = process.argv.slice(2);
const FROM = process.env.ICECREAM_FROM ?? args[0];
const TO = process.env.ICECREAM_TO ?? args[1];

function sleep(ms) {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function pipe() {
    const pack = await fetch(`${FROM}/_icecream`, { method: "GET" });
    const icecream = await pack.json();
    console.log(icecream);
    if (icecream.id) {
        const taste = await fetch(`${TO}${icecream.url}`, {
            method: icecream.method,
            headers: icecream.headers,
            body: icecream.body
        });
        await fetch(`${FROM}/_icecream`,{
            method: "POST",
            body: JSON.stringify({
                id: icecream.id,
                headers: taste.headers,
                body: await taste.text()
            }),
            headers: {'Content-Type': 'application/json'}
        });
    }
}

async function start() {
    while(1) {
        pipe();
        await sleep(500);
    }
}

start().then(console.log("Started")).catch(error => console.error(error));