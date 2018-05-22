const { Readable } = require('stream')
const Twitter = require('twitter')

class TwitterStream extends Readable {
    constructor(options, config) {
        super(options)
        this.config = config
        this.client = new Twitter(config)
        this.connect()
    }

    _read() { }

    connect() {
        this.stream = this.client.stream('statuses/filter', { track: 'trump' })
        this.stream.on('data', (tweet) => { this.push(tweet) })
    }
}

module.exports = TwitterStream