const express = require('express')
const app = express()
const rutas = require('./routes/index.js')
const puerto = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api', rutas)

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