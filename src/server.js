require('dotenv').config()
const express = require('express')
const app = express()
//const puerto = 8080
const puerto = process.env.PORT

//para poder acceder al body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//router:
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

app.use('/', express.static('public'))
app.use('/api', productRoutes)
app.use('/api', cartRoutes)

//en caso de colocar cualquier otra ruta diferente a las creadas, muestro el error:
app.use('/*', (req, res) => {
    res.status(404).send({ error: -2, mensaje: `No existe la ruta ${req.url}/${req.method}`});
});


//middleware de error:
app.use((error, req, res, next)=>{    
    console.log(error.statusMessage)
    res.status(error.statusCode).send(error.message)
    //res.error(error)
})

app.listen(puerto, (err) => {
    if (err){
        console.log(`Hubo un error al iniciar el servidor: ${err}`)
    }else{
        console.log(`Servidor iniciado, escuchando en puerto: ${puerto}`)
    }
})