let io;
module.exports = {
    init: function (server) {
        // start socket.io server and cache io value
        io = require('socket.io')(server);
        return io;
    },
    getio: function () {
        // return previously cached value
        if (!io) {
            throw new Error("must call .init(server) before you can call .getio()");
        }
        return io;
    }
};
//# sourceMappingURL=socket.js.map