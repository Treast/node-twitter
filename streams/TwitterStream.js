const { Readable } = require('stream')
const Twitter = require('twitter')

/**
 * Read the Twitter stream about a tracking subject
 */
class TwitterStream extends Readable {

    /**
     * @param {Object} options Options for the stream
     * @param {Object} config TwitterConfig
     * @param {String} track Tracking subject
     */
    constructor(options, config, track) {
        super(options)
        this.config = config
        this.client = new Twitter(config)
        this.track = track
        this.connect()
    }

    _read() { }

    /**
     * Called when the user wants to change the tracking subject.
     * @param {String} filter 
     */
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
            this.stream.on('error', (error) => { console.log(error) })
        }, 3000)
    }

    /**
     * First connection to the Twitter stream.
     */
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