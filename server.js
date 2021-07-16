require("dotenv").config()
const express = require("express")
const dns = require("dns")
const model = require("./database/index.js")
const cors = require("cors")

const app = express()
// Basic Configuration
const port = process.env.PORT || 3000


app.use(express.urlencoded({extended: false}))
app.use(cors())

app.use("/public", express.static(`${process.cwd()}/public`))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})


app.post("/api/shorturl", (req, res) => {
  const { url } =  req.body
  const getHostname = /https:\/\/(.*)\//.exec(url)

  if (!getHostname) return res.status(400).json({ error: "invalid url" })

  dns.lookup(getHostname[1], async (err, _address, _family) => {
    if (err) return res.status(400).json({ error: "invalid url" })

    const findUrl = await model.findOne({ original_url: url })

    if (findUrl)
      return res.json({
        original_url: findUrl.original_url,
        short_url: findUrl.short_url,
      })

    const { short_url, original_url } = await model.create({
      original_url: url,
    })
    res.status(201).json({
      original_url,
      short_url,
    })
  })
})

app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params
  const getURL = await model.findOne({ short_url })

  if(getURL)
    return res.redirect(getURL.original_url)
  
  res.status(400).send("Not found")
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
