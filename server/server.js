import compression from 'compression';
import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import history from 'connect-history-api-fallback';
import cookieParser from 'cookie-parser';
import routes from './routes/main';
import api from './routes/api';

// set up app
var app = express();

// gzip compression
app.use(compression());

// handle cookies
app.use(cookieParser());

// Middle ware to handle spa requests to /
const middleware = history({
    index: '/',
    rewrites: [
        { from: /\/other/, to: '/other'},
        { from: /\/api\/test/, to: '/api/test'}
      ]
});
app.use(middleware);

// in production redirect locally hosted files to cdn
app.use(function(req, res, next) {
    if(process.env.NODE_ENV === 'production' && req.url.includes("img/portfolio")) {
        var sharedPath = req.url.split('img/');
        var absolutePath = "https://testcontent.azureedge.net/" + sharedPath[1];

        res.redirect(absolutePath);
        return;
    }    

    next();
});

// use ejs templates with layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);

// views folder location
app.set('views', path.join(__dirname, '/views'));

// routes
app.use('/', routes);
app.use('/api', api);

// export as app
export default app;
