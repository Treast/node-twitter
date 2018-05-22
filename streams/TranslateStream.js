const { Transform } = require('stream')
const axios = require('axios')

class TranslateStream extends Transform {
    constructor(options) {
        super(options)
        this.language = 'fr'
    }

    _transform(chunk, encoding, callback) {
        const data = chunk
        let encodedText = encodeURIComponent(chunk.text)
        axios.post('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20180522T085217Z.523bcb19c30c40a8.29ba87260e2887decb793c0d6c7111bd6e97817f&lang=' + this.language + '&text=' + encodedText)
            .then(response => {
                data.text = response.data.text[0]
                this.push(data)
                callback()
            })
            .catch(error => {
                console.log(error)
                callback()
            })
    }

    changeLanguage(language) {
        this.language = language
    }
}

module.exports = TranslateStream