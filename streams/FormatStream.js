const { Transform } = require('stream')

class FormatStream extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        const data = {
            name: chunk.user.screen_name,
            username: chunk.user.name,
            profile_picture: chunk.user.profile_image_url_https,
            created_at: chunk.created_at,
            text: chunk.text,
            place: chunk.place
        }
        if (chunk.place) this.push(data)
        callback()
    }
}

module.exports = FormatStream