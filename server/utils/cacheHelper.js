import memoryCache from 'memory-cache';

export default {

    /**
     * Get from cache or add to cache and then return
     * @param {string} keyName - Unique name of cache entry
     * @param {function} creator - Function to generate data to be cached
     * @param {number} expiryMins - Time in mins to keep entry in the cache
     */
    get: function (keyName, creator, expiryMins) {
        let data = memoryCache.get(keyName);

        if (data != null) {
            return data;
        }

        data = creator();

        if (data) {
            memoryCache.put(keyName, data, expiryMins, () => {
                // error alert, cache fail
            });
        }

        return data;
    },

    /**
     * Remove item from cache by unique name
     * @param {string} keyName - Unique name of cache entry   
     */
    delete: function (keyName) {
        memoryCache.del(keyName);
    },

    /**
     * Remove all items from cache   
     */
    clear: function () {
        memoryCache.clear();
    }
}