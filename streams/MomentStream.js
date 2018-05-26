const { Transform } = require('stream')
const moment = require('moment')

/**
 * Format the date of the tweet in a 'ago' time (like 5 seconds ago) // Useless
 */
class MomentStream extends Transform {
    /**
     * @param {Object} options Options for the stream
     */
    constructor(options) {
        super(options)
    }

    /**
     * @param {String} chunk Chunk
     * @param {String} encoding Encoding
     * @param {Function} callback Callback
     */
    _transform(chunk, encoding, callback) {
        let data = chunk
        let date = moment(data.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow()
        data.created_at = date

        this.push(data)
        callback()
    }
}

module.exports = MomentStream