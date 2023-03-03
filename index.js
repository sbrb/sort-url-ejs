import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import route from './route/route.js'
import path from 'path'
const __dirname = path.resolve();

const app = express()
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDb is connected'))
  .catch(err => console.log(err))

app.set('view engine', 'ejs')

app.get('/', async (req, res, next) => {
  res.render('index.ejs')
})

app.use('/', route);

app.get("*", (req, res) => {
  res.redirect(`${req.protocol}://${req.get('host')}`);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('index', { error: err.message })
})

app.listen(process.env.PORT, () => console.log(`Express app is connected on port ${process.env.PORT}`))
