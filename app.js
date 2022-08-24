/*carregando os Importes */
import express from 'express'
import serverless from 'serverless-http'
import bodyparser from 'body-parser'
import { engine } from 'express-handlebars'
import moment from 'moment'
import adm from './routes/adm.js'
import path from 'path'
import mongoose from 'mongoose'
import session from 'express-session'
import flash from 'connect-flash'
import metodo from 'method-override'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
dotenv.config()


module.exports.handler = serverless(app)



/* configuraçoes*/

/* session */
app.use(session({
    secret: "segredo",
    resave: true,
    saveUninitialized: true
}))
/* session */

app.use(flash())

app.use(metodo('_metodo'))

/* Middleware */
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg') /* variavel para apresenter mensagem sucesso */
    res.locals.erro_msg = req.flash('erro_msg') /* variavel para apresentar mensagem de  error */
    res.locals.aviso_msg = req.flash('aviso_msg')/* variavel para apresentar mensagem de aviso */
    next();

})
/* Middleware */


/* bodyparser */
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
/* bodyparser */

/* handlebars */
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    },
    layoutsDir: __dirname + '/views/layouts',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }

}))
app.set('view engine', 'hbs')
/* handlebars */


/* mongoose */
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_BANK).then(() => {
    console.log('Sucesso ao conenctar com o banco mongo')
}).catch((erro) => {
    console.log(`Erro ao tentar conenctar no banco mongo: ${erro}`)
})
/* mongoose */




/* public */
app.use(express.static(path.join(__dirname, "public")))
/* public */

/* rotas */
app.use('/', adm)
/* rotas */

/* outros */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App rodando na porta: ${port}`)
})
/* outros */

/* configuraçoes*/
