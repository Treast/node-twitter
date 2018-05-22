const { Transform } = require('stream')

/**
 * Not used
 */
class StringifyStream extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        this.push(chunk.text + "\n")
        callback()
    }
}

module.exports = StringifyStream