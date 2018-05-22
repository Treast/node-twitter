const { Transform } = require('stream')

class HTMLBuilderStream extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        const html = `
            <div class="tweet__header">
            <img class="tweet__header__profile-picture" src="${chunk.profile_picture}"></img>
            <div class="tweet__header__screen-name">${chunk.username}</div>
            <div class="tweet__header__username">@${chunk.name}</div>
            <div class="tweet__header__created-at">${chunk.created_at}</div>
            </div>
            <div class="tweet__content">
                <p>${chunk.text}</p>
            </div>
        `
        const data = {
            text: chunk.text,
            location: chunk.location,
            place: chunk.place,
            html: html
        }
        this.push(data)
        callback()
    }
}

module.exports = HTMLBuilderStream