const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const axios = require('axios')

dotenv.config()

const app = express()
app.use(helmet())

const NYT_API_KEY = process.env.NYT_API_KEY

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (req, res) => {
  res.send("VYT API is running.")
})

app.get('/popular', (req, res) => {
  console.log("received request at /popular")
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostemailed/all-sections/1?api-key=' + NYT_API_KEY
  axios.get(url).then((response) => {
    console.log("Received response from NYT.")
    res.send(response.data)
  })
  .catch((error) => {
    console.log(error)
    res.status(502)
    res.send("Error: unable to retrieve data from the Times.")
  })
})

app.get('/top', (req, res) => {
  console.log("received request at /top")
  const url = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=" + NYT_API_KEY
  axios.get(url).then((response) => {
    console.log("Received response from NYT.")
    res.send(response.data)
  })
  .catch((error) => {
    console.log(error)
    res.status(502)
    res.send("Error: unable to retrieve data from the Times.")
  })
})

app.get('/search/:searchTerms', (req, res) => {
  console.log("received request at /search")
  const url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + req.params['searchTerms'] + "&api-key=" + NYT_API_KEY + "&sort=newest"
  axios.get(url).then((response) => {
    console.log("Received response from NYT")
    res.send(response.data)
  })
})

app.get('/summary', (req, res) => {
  console.log("received request at /summary for article: " + req.query.article)
  const article = req.query.article
  if (article === undefined) {
    res.send("Error: invalid article provided.")
  } else {
    const url = `http://api.smmry.com/?SM_API_KEY=${process.env.SMMRY_API_KEY}&SM_LENGTH=6&SM_URL=${req.query.article}`
    axios({
        method: 'post',
        headers: {
            'Expect': '100-continue'
        },
        url: url
    }).then((response) => {
        console.log()
        res.send(response.data.sm_api_content)
    })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('App listening on port ' + port)
})