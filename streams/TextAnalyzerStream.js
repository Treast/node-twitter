const { Transform } = require('stream')
const moment = require('moment')
const AYLIENTextAPI = require('aylien_textapi')

class TextAnalyzer extends Transform {
    constructor(options) {
        super(options)
        this.textapi = new AYLIENTextAPI({
            application_id: "5463ca4d",
            application_key: "5fe560e036a3b843157ceb0c309a3cc0"
        })
    }

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