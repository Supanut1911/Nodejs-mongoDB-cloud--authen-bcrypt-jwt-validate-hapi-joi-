const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authen = require('./routes/auth')
const postRoute = require('./routes/posts')

//connect db
mongoose.connect('mongodb+srv://nutX:nut11740@cluster0-f6pck.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true},
    ()=> console.log('connected to db')
)

//middleware
app.use(express.json())



app.use('/api/user/', authen)
app.use('/api/posts', postRoute)

app.listen(3000, ()=>{console.log('server online')})