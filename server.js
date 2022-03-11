//Adding library
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require('./app/config/db.config');
const db = require('./app/model');
const authRoute = require('./app/router/auth')
var corsOptions = {
    origin: "http://localhost:8081"
};

//Using library
const app = express();
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Port config
const PORT = process.env.PORT || 8080;

//main

db.mongoose
    .connect(dbConfig.CONNECTIONSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connect successfully to db `)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })

app.use('/api/auth/', authRoute)

app.listen(PORT, () => {
    console.log(`App is listening to PORT ${PORT}`)
})