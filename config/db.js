const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/docker-node-mongo',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));