"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memoryCache = _interopRequireDefault(require("memory-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  /**
   * Get from cache or add to cache and then return
   * @param {string} keyName - Unique name of cache entry
   * @param {function} creator - Function to generate data to be cached
   * @param {number} expiryMins - Time in mins to keep entry in the cache
   */
  get: function get(keyName, creator, expiryMins) {
    var data = _memoryCache.default.get(keyName);

    if (data != null) {
      return data;
    }

    data = creator();

    if (data) {
      _memoryCache.default.put(keyName, data, expiryMins, function () {// error alert, cache fail
      });
    }

    return data;
  },

  /**
   * Remove item from cache by unique name
   * @param {string} keyName - Unique name of cache entry   
   */
  delete: function _delete(keyName) {
    _memoryCache.default.del(keyName);
  },

  /**
   * Remove all items from cache   
   */
  clear: function clear() {
    _memoryCache.default.clear();
  }
};
exports.default = _default;