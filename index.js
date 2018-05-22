const Twitter = require('twitter')
const { Readable, Transform, Writable } = require('stream')
const http = require('http')
const fs = require('fs')
const path = require('path')
const io = require('socket.io')
require('dotenv').config()
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

const cfg = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
}

const server = http.createServer()

server.on('request', (req, res) => {
    if (req.url === '/') {
        const file = fs.createReadStream(path.resolve(__dirname, 'public', 'index.html'))
        res.writeHead(200, { 'Content-Type': 'text/html' })
        file.pipe(res)
    } else if (req.url === '/twitter.mp3') {
        const file = fs.createReadStream(path.resolve(__dirname, 'twitter.mp3'))
        res.writeHead(200, { 'Content-Type': 'audio/mpeg' })
        file.pipe(res)
    }
})

const socketIo = io(server)
track = 'trump'

const twitterStream = new TwitterStream({ objectMode: true }, cfg, track)
const formatStream = new FormatStream({ objectMode: true })
const locationStream = new LocationStream({ objectMode: true })
const htmlBuilderStream = new HTMLBuilderStream({ objectMode: true })
const momentStream = new MomentStream({ objectMode: true })
const statsStream = new StatsStream({ objectMode: true })
const translateStream = new TranslateStream({ objectMode: true })
const textAnalyzerStream = new TextAnalyzerStream({ objectMode: true })
const socketStream = new SocketStream({ objectMode: true }, socketIo)

socketIo.on('connection', (socket) => {
    socket.emit('connected', { filter: track })
    socket.on('changeFilter', (data) => {
        console.log('Change filter', data.filter)
        twitterStream.changeFilter(data.filter)
        statsStream.reset()
    })
    socket.on('changeLanguage', (data) => {
        console.log('Change language', data.filter)
        translateStream.changeLanguage(data.filter)
        statsStream.reset()
    })
})

twitterStream
    .pipe(formatStream)
    .pipe(locationStream)
    .pipe(momentStream)
    .pipe(statsStream)
    .pipe(textAnalyzerStream)
    .pipe(translateStream)
    .pipe(htmlBuilderStream)
    .pipe(socketStream)

server.listen(8000, () => {
    console.log('Server listening on port 8000')
})