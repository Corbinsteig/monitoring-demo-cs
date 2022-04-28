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
// rollbar.log("Hello world!");

app.use(express.json());

// student data
const students = [ 'jimmy', 'timothy', 'jimothy']

// endpoints
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('Someone got the list of students on page load')
    res.status(200).send(students)
})

app.post('/api/students', function(req, res) {
    let { name } = req.body;
    
    const index = students.findIndex((student) => {
        return student === name
    })

    try {
        if (index === -1 && name !== "") {
          students.push(name);
          rollbar.info('Someone added a student')
          res.status(200).send(students);
        } else if (name === "") {
            rollbar.error('Someone tried to enter a blank student')

            res.status(400).send("must provide a name");
        } else {
            rollbar.error('Someone tried to enter a duplicate student name')
          res.status(400).send("that student already exists");
        }
      } catch (err) {
        console.log(err)
        rollbar.error(err)
      }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index

    students.splice(targetIndex, 1);

    rollbar.info('Someone deleted a student')
    res.status(200).send(students)
})

const port = process.env.PORT || 4545;

app.listen(port, function() {
    console.log(`Server rocking out on ${port}`)
})
