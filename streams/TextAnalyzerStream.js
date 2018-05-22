const { Transform } = require('stream')
const moment = require('moment')
const AYLIENTextAPI = require('aylien_textapi')

/**
 * Analyze the tweet text to determine the sentiment of it (positive, neutral or negative)
 */
class TextAnalyzer extends Transform {
    /**
     * @param {Object} options Options for the stream
     */
    constructor(options) {
        super(options)
        this.textapi = new AYLIENTextAPI({
            application_id: "5463ca4d",
            application_key: "5fe560e036a3b843157ceb0c309a3cc0"
        })
    }

    /**
     * @param {String} chunk Chunk
     * @param {String} encoding Encoding
     * @param {Function} callback Callback
     */
    _transform(chunk, encoding, callback) {
        this.textapi.sentiment({
            'mode': 'tweet',
            'text': chunk.text
        }, (error, response) => {
            if (error === null) {
                let data = Object.assign({
                    polarity: response.polarity
                }, chunk)

                this.push(data)
                callback()
            }
        })
    }
}

module.exports = TextAnalyzer