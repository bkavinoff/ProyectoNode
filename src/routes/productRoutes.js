const { Router } = require('express')
const routerProductos = Router()

//Middleware de autorización
const { checkAuth } = require('../middlewares/checkAuth.js');

//declaro mi clase contenedor
const ProductsContainer = require('../controllers/productos')

//inicializo el contenedor con el archivo de productos
const productContainer = new ProductsContainer('../productos.txt');

routerProductos.get('/productos', (req, res) =>{

    const p = async () => {
        const result = await productContainer.getAll();
        if (typeof result === 'string'){
            res.status(500).send(result)
        }
        else{
            res.status(200).send(result);
        }
    }

    p();
})

routerProductos.get('/productos/:id', (req, res) =>{
    
    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    const p = async () => {
        result = await productContainer.getById(id)
        if (typeof result === 'string'){
            res.status(500).send(result)
        }
        else{
            res.status(200).send(result);
        }
    }
    p();
})

routerProductos.post('/productos', checkAuth, (req,res) =>{

    const {nombre, precio, thumbnail, timestamp, descripcion, codigo, stock} = req.body //se levantan los parametros del req.body
    const p = async()=>{
        try{
            const result = await productContainer.add({nombre:nombre, precio:precio, thumbnail:thumbnail, timestamp:timestamp, descripcion:descripcion, codigo:codigo, stock:stock})

            if (typeof result === 'number'){
                res.status(201).redirect('/api/productos') //status 201 es OK
            }else{
                res.sendStatus(500) //status 500 es Server Error
            }
            
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

routerProductos.put('/productos/:id', checkAuth, (req,res) =>{

    const {nombre, precio, thumbnail, timestamp, descripcion, codigo, stock} = req.body //se levantan los parametros del req.body

    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    //transformo a Number el precio
    const precioFinal = Number(precio) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(precioFinal)) //NaN = Not a Number
    {
        res.status(400).json({error:`${precioFinal} no es un número válido`})
        return
    }

    //transformo a Number el precio
    const stockFinal = Number(stock) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(stockFinal)) //NaN = Not a Number
    {
        console.log('error')
        res.status(400).json({error:`${stockFinal} no es un número válido`})
        return
    }
    
    const p = async()=>{
        try{
            const result = await productContainer.updateById(id,{nombre, precioFinal, thumbnail, timestamp, descripcion, codigo, stockFinal})
            if (result.includes('OK')){
                res.status(201).redirect('/api/productos') //status 201 es OK
            }else{
                res.status(500).send(result) //status 500 es Server Error
            }
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
    //res.sendStatus(202) //status 202 es OK

})

routerProductos.delete('/productos/:id', checkAuth, (req,res) =>{

    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        console.log('error')
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    const p = async()=>{
        try{
            const result = await productContainer.deleteById(id)
            if (result.includes('OK')){
                res.status(200).send(result) //status 201 es OK
            }else{
                console.log('ERR: ', result)
                res.status(500).send(result) //status 500 es Server Error
            }
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

module.exports = routerProductos