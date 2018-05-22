const { Transform } = require('stream')

/**
 * Locate the user based on a tweet
 */
class LocationStream extends Transform {
    /**
     * @param {Object} options Options for the stream
     */
    constructor(options) {
        super(options)
    }

    /**
     * @param {String} chunk Chunk
     * @param {String} encoding Encoding
     * @param {Function} callback Callback
     */
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
        // Get the bounding coordinates
        let coordinates = chunk.place.bounding_box.coordinates[0]

        // Evaluate the mean center of the location
        for (let coordinate of coordinates) {
            data.location.long += coordinate[0]
            data.location.lat += coordinate[1]
        }

        data.location.long /= coordinates.length
        data.location.lat /= coordinates.length

        this.push(data)
        callback()
    }
}

module.exports = LocationStream