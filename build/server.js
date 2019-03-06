"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compression = _interopRequireDefault(require("compression"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _expressEjsLayouts = _interopRequireDefault(require("express-ejs-layouts"));

var _connectHistoryApiFallback = _interopRequireDefault(require("connect-history-api-fallback"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _routes = _interopRequireDefault(require("./routes/routes"));

var _api = _interopRequireDefault(require("./routes/api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set up app
var app = (0, _express.default)(); // gzip compression

app.use((0, _compression.default)()); // handle cookies

app.use((0, _cookieParser.default)()); // Middle ware to handle spa requests to /

var middleware = (0, _connectHistoryApiFallback.default)({
  index: '/',
  rewrites: [{
    from: /\/other/,
    to: '/other'
  }, {
    from: /\/api\/test/,
    to: '/api/test'
  }]
});
app.use(middleware); // in production redirect locally hosted files to cdn

app.use(function (req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.url.includes("img/portfolio")) {
    var sharedPath = req.url.split('img/');
    var absolutePath = "https://testcontent.azureedge.net/" + sharedPath[1];
    res.redirect(absolutePath);
    return;
  }

  next();
}); // use ejs templates with layouts

app.set('view engine', 'ejs');
app.use(_expressEjsLayouts.default); // views folder location

app.set('views', _path.default.join(__dirname, '/views')); // routes

app.use('/', _routes.default);
app.use('/api', _api.default); // export as app

var _default = app;
exports.default = _default;