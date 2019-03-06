"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cacheHelper = _interopRequireDefault(require("../utils/cacheHelper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = _express.default.Router(); // api example


api.route('/test').get(function (req, res) {
  var data = _cacheHelper.default.get('test', function () {
    return {
      test: 123
    };
  }, 1);

  res.json(data);
}).post(function (req, res) {
  res.json({
    response: 'post'
  });
});
var _default = api;
exports.default = _default;