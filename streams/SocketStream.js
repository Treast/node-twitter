const { Writable } = require('stream')

/**
 * Submit the tweet to the client
 */
class SocketStream extends Writable {
    /**
     * @param {Object} options Options for the stream
     * @param {SocketIO} socketIo SocketIO
     */
    constructor(options, socketIo) {
        super(options)
        this.socketIo = socketIo
    }

    /**
     * @param {String} chunk Chunk
     * @param {null} _ null
     * @param {Function} callback Callback
     */
    _write(chunk, _, callback) {
        this.socketIo.emit('data', { tweet: chunk })
        callback()
    }
}


module.exports = SocketStream