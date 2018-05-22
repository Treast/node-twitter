const Twitter = require('twitter')
const { Readable, Transform, Writable } = require('stream')
const http = require('http')
const fs = require('fs')
const path = require('path')
const io = require('socket.io')
require('dotenv').config()

// Custom streams
const TwitterStream = require('./streams/TwitterStream')
const StringifyStream = require('./streams/StringifyStream')
const SocketStream = require('./streams/SocketStream')
const FormatStream = require('./streams/FormatStream')
const LocationStream = require('./streams/LocationStream')
const HTMLBuilderStream = require('./streams/HTMLBuilderStream')
const MomentStream = require('./streams/MomentStream')
const StatsStream = require('./streams/StatsStream')
const TextAnalyzerStream = require('./streams/TextAnalyzerStream')
const TranslateStream = require('./streams/TranslateStream')

// Twitter configuration from the .env file
const cfg = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
}

// Throws error if the .env file doesn't exists or is empty
if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
    throw new Error('Rename the \'.env.dist\' file on root folder to \'.env\' and fill it with your Twitter App credentials')
}

// Create a HTTP server
const server = http.createServer()

// Listen to requests
server.on('request', (req, res) => {
    // If the request is the root, then return the index.html file
    if (req.url === '/') {
        const file = fs.createReadStream(path.resolve(__dirname, 'public', 'index.html'))
        res.writeHead(200, { 'Content-Type': 'text/html', 'Connection': 'keep-alive' })
        file.pipe(res)
        // Else if the request is the sound, then return the twitter.mp3 file
    } else if (req.url === '/twitter.mp3') {
        const file = fs.createReadStream(path.resolve(__dirname, 'twitter.mp3'))
        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Connection': 'keep-alive' })
        file.pipe(res)
    }
})

// Creates the SocketIo server
const socketIo = io(server)

// Default tracking subject on Twitter
track = 'trump'

// Instanciations of all the streams used
const twitterStream = new TwitterStream({ objectMode: true }, cfg, track)
const formatStream = new FormatStream({ objectMode: true })
const locationStream = new LocationStream({ objectMode: true })
const htmlBuilderStream = new HTMLBuilderStream({ objectMode: true })
const momentStream = new MomentStream({ objectMode: true })
const statsStream = new StatsStream({ objectMode: true })
const translateStream = new TranslateStream({ objectMode: true })
const textAnalyzerStream = new TextAnalyzerStream({ objectMode: true })
const socketStream = new SocketStream({ objectMode: true }, socketIo)

// SocketIo
socketIo.on('connection', (socket) => {
    // Pass the current filter to the user
    socket.emit('connected', { filter: track })

    // Emit when the user change the filter
    socket.on('changeFilter', (data) => {
        console.log('Change filter', data.filter)
        // Change filter
        twitterStream.changeFilter(data.filter)
        // Reset current stats
        statsStream.reset()
    })

    // Emit when the user change the translation language
    socket.on('changeLanguage', (data) => {
        console.log('Change language', data.filter)
        // Change language
        translateStream.changeLanguage(data.filter)
        // Reset current stats
        statsStream.reset()
    })
})
// Pipes
twitterStream
    .pipe(formatStream)
    .pipe(locationStream)
    .pipe(momentStream)
    .pipe(statsStream)
    .pipe(textAnalyzerStream)
    .pipe(translateStream)
    .pipe(htmlBuilderStream)
    .pipe(socketStream)

// Server listening
server.listen(8000, () => {
    console.log('Server listening on port 8000')
})