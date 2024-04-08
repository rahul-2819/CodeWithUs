const path = require('path');

module.exports = {
    // Other webpack configurations...

    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
            "url": require.resolve("url/")
        }
    },

    // Other webpack configurations...
};
