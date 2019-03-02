import express from 'express';
import cacheHelper from '../utils/cacheHelper';

const api = express.Router();

// api example
api.route('/test')
    .get(function (req, res) {
        let data = cacheHelper.get('test', () => { return { test: 123 } }, 1);
        res.json(data);
    })
    .post(function (req, res) {
        res.json({ response: 'post' });
    });

export default api;
