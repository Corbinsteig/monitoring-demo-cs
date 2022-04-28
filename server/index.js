const express = require("express")
const path = require("path")

const app = express()
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '362e4820b005415c83bae49768e34e50',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"))
})
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully.')
})
app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)
    rollbar.log('Student added successfully', {author: 'Corbin', type: 'manual entry'})
    res.status(200).send(students)
})
const port = process.env.PORT || 4545
app.use(rollbar.errorHandler())

app.use(express.json())

app.listen(port, () => console.log (`Take us to warp ${port}!`))