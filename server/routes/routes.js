import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

function resolvePath(relativePath) {
    return path.join(__dirname, relativePath);
}

function getLocals(req, callback) {
    let data = {
        cssCached: !(req.cookies.cssCached === undefined),
        inlineCSS: ''
    };

    if (!data.cssCached) {
        fs.readFile(resolvePath("../../dist/css/styles.css"), "utf8", function (err, result) {
            data.inlineCSS = `<style>${result}</style>`;
            callback(data);
        });
    } else {
        callback(data);
    }
}

router.get('/', function (req, res) {
    getLocals(req, function (result) {
        let locals = Object.assign({
            title: 'Page Title',
            description: 'Page Description',
            header: 'Page Header'
        }, result);

        res.render('pages/index', locals);
    });
});

router.get('/other', function (req, res) {
    getLocals(req, function (result) {
        let locals = Object.assign({
            title: 'Page Title',
            description: 'Page Description',
            header: 'Page Header'
        }, result);

        res.render('pages/other', locals);
    });
});

// serve static files from 'dist'
router.use('/', express.static(resolvePath('../../dist')));

export default router;