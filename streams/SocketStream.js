const { Writable } = require('stream')

class SocketStream extends Writable {
    constructor(options, socketIo) {
        super(options)
        this.socketIo = socketIo
    }

    _write(chunk, _, callback) {
        this.socketIo.emit('data', { tweet: chunk })
        callback()
    }
}


module.exports = SocketStream