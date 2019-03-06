"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

function resolvePath(relativePath) {
  return _path.default.join(__dirname, relativePath);
}

function getLocals(req, callback) {
  var data = {
    cssCached: !(req.cookies.cssCached === undefined),
    inlineCSS: ''
  };

  if (!data.cssCached) {
    _fs.default.readFile(resolvePath("../../dist/css/styles.css"), "utf8", function (err, result) {
      data.inlineCSS = "<style>".concat(result, "</style>");
      callback(data);
    });
  } else {
    callback(data);
  }
}

router.get('/', function (req, res) {
  getLocals(req, function (result) {
    var locals = Object.assign({
      title: 'Page Title',
      description: 'Page Description',
      header: 'Page Header'
    }, result);
    res.render('pages/index', locals);
  });
});
router.get('/other', function (req, res) {
  getLocals(req, function (result) {
    var locals = Object.assign({
      title: 'Page Title',
      description: 'Page Description',
      header: 'Page Header'
    }, result);
    res.render('pages/other', locals);
  });
}); // serve static files from 'dist'

router.use('/', _express.default.static(resolvePath('../../dist')));
var _default = router;
exports.default = _default;