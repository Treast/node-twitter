const { Transform } = require('stream')
const moment = require('moment')

class MomentStream extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        let data = chunk
        let date = moment(data.created_at).fromNow()
        data.created_at = date

        this.push(data)
        callback()
    }
}

module.exports = MomentStream