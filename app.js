const express  = require('express');
const mongoose = require('./db')
var cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app  = express();
mongoose();
const port = process.env.PORT || 3000; 

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{

    res.send('shami HMS').statusCode(200)
}); 


app.use('/api/books/', require('./routes/books'))
app.use('/api/auth/', require('./routes/authentication'))

app.listen(port, ()=>{

    console.log(`App listening at the port http://localhost:${port}`)
})