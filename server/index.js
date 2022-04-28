const express = require('express')
const path = require('path')

const app = express()

// include and initialize the rollbar library with your access token
const Rollbar = require('rollbar')
let rollbar = new Rollbar({
    accessToken: 'c2958f4214244812b4b465c101a49ee2',
    captureUncaught: true,
    captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
    rollbar.info('html file served successfully.')
})


let students = []

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)

    rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})

    res.status(200).send(students)
})

// Let's also add some top-level middleware that will track any errors that occur in our server:
app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))