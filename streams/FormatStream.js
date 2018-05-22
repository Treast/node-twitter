const { Transform } = require('stream')

/**
 * Format tweets by removing all unused informations 
 */
class FormatStream extends Transform {
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
        // If the tweet is valid or not
        if (chunk.user) {
            const data = {
                name: chunk.user.screen_name,
                username: chunk.user.name,
                profile_picture: chunk.user.profile_image_url_https,
                created_at: chunk.created_at,
                text: chunk.text,
                place: chunk.place,
                query: chunk.query
            }
            // If the tweet got any place, go next
            if (chunk.place) this.push(data)
        }
        callback()
    }
}

module.exports = FormatStream