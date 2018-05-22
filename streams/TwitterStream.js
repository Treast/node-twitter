const { Readable } = require('stream')
const Twitter = require('twitter')

class TwitterStream extends Readable {

    constructor(options, config, track) {
        super(options)
        this.config = config
        this.client = new Twitter(config)
        this.track = track
        this.connect()
    }

    _read() { }

    changeFilter(filter) {
        this.track = filter
        this.stream.destroy()
        setTimeout(() => {
            this.stream = this.client.stream('statuses/filter', { track: this.track })
            this.stream.on('data', (tweet) => {
                let data = Object.assign({
                    query: this.track
                }, tweet)
                this.push(data)
            })
        }, 3000)
    }

    connect() {
        this.stream = this.client.stream('statuses/filter', { track: this.track })
        this.stream.on('data', (tweet) => {
            let data = Object.assign({
                query: this.track
            }, tweet)
            this.push(data)
        })
    }
}

module.exports = TwitterStream