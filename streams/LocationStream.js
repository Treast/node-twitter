const { Transform } = require('stream')

class LocationStream extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        const data = {
            name: chunk.name,
            username: chunk.username,
            profile_picture: chunk.profile_picture,
            created_at: chunk.created_at,
            text: chunk.text,
            location: {
                long: 0,
                lat: 0
            },
            place: chunk.place,
            query: chunk.query
        }
        let coordinates = chunk.place.bounding_box.coordinates[0]

        for (let coordinate of coordinates) {
            data.location.long += coordinate[0]
            data.location.lat += coordinate[1]
        }

        console.log(chunk.text)

        data.location.long /= coordinates.length
        data.location.lat /= coordinates.length
        this.push(data)
        callback()
    }
}

module.exports = LocationStream