import express from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import UserRoute from './routers/UserRoute.js'

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(fileUpload())
app.use(cors())
app.use(express.static('public'))
app.use(UserRoute)

app.listen(5000, () => console.log('server up & running'))