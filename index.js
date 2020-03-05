const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', async (req, resp) => {
    const url = req.query.url;
    if (!url) {
        resp.send('Url is required');
        return;
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        // Get the "viewport" of the page, as reported by the page.
        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                deviceScaleFactor: window.devicePixelRatio
            };
        });
        await browser.close();
        resp.send(dimensions);
    } catch (e) {
        resp.send(e.message);
    }
});

app.listen(3000);