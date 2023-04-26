const mongoose = require('mongoose')

mongoose.connect(process.env.DB, {
    "auth": {"authSource": process.env.DB_COLLECTION},"user": process.env.DB_USER,"pass": process.env.DB_PASSWORD,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(db => console.log("DB connected"))
    .catch(err => console.error(err));