/******************************** DEPENDENCIES ********************************/

const engine = require('fastify')()
const compress = require('fastify-compress')
const cors = require('fastify-cors')
const lru = require('lru-cache')
const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const { port, shortLength } = require('./config.json')
const urlSchema = require('./schemas/url')

// env
require('dotenv').config()
const env = process.env

// fastify
engine.register(compress)
engine.register(cors)

// cache
const maxAge = { maxAge: 24 * 60 * 60 * 1000 } // 1d
const cache = new lru(maxAge)

// mongoose
mongoose.connect(env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(console.log('Mongoose was launched.'))

/******************************** API ********************************/

function isNotValidURL(url) {
  const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
  if (res == true) return false
  if (res == false) return true 
}

// get short url
engine.get('/short', async (req, reply) => {
  const url = encodeURI(req.query.url)

  // check if url is valid
  if (isNotValidURL(url)) return { error: 'Invalid URL' }

  // check if url exists
  const urlExists = await urlSchema.findOne({ original: url })
  if (urlExists) return { short: urlExists._id }

  // generate code
  let uniqueId = nanoid(shortLength)

  // check if code exists
  const idExists = await urlSchema.findOne({ _id: uniqueId })
  if (idExists) {
    uniqueId = uniqueId + nanoid(2)
  }

  const newURL = new urlSchema({
    _id: uniqueId,
    original: url.substring(4, url.length)
  })

  newURL.save(function (err) {
    if (err) return { error: 'Failed To Save URL' }
  })

  cache.set(uniqueId, url.substring(4, url.length))

  return { short: uniqueId }
})

// redirect to long url
engine.get('/:short', async (req, reply) => {
  const short = encodeURIComponent(req.params.short)

  const cachedShort = cache.get(short)
  if (cachedShort) {
    reply.status(301).redirect(`http${cachedShort}`)
  } else {
    const url = await urlSchema.findOne({ _id: short })

    if (url) {
      reply.status(301).redirect(`http${url.original}`)
      cache.set(short, url.original.substring(4, url.original.length))
    } else {
      return { error: 'Failed To Find URL' }
    }
  }
})

// start fastify
const start = async () => {
  try {
    await engine.listen(port)
    console.log('Fastify was launched.')
  } catch (err) {
    engine.log.error(err)
    process.exit(1)
  }
}
start()

