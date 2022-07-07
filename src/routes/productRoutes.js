const { Router } = require('express')
const routerProductos = Router()

//declaro mi clase contenedor
const ProductsContainer = require('../controllers/productos')

//inicializo el contenedor con el archivo de productos
const productContainer = new ProductsContainer('../productos.txt');

routerProductos.get('/productos', (req, res) =>{

    const p = async () => {
        const products = await productContainer.getAll();
        res.status(200).send(products)
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
        res.status(200).send(await productContainer.getById(id));
    }
    p();
})

routerProductos.post('/productos', (req,res) =>{

    const {nombre, precio, thumbnail, timestamp, descripcion, codigo, stock} = req.body //se levantan los parametros del req.body
    const p = async()=>{
        try{
            await productContainer.add({nombre:nombre, precio:precio, thumbnail:thumbnail, timestamp:timestamp, descripcion:descripcion, codigo:codigo, stock:stock})
            res.status(201).redirect('/api/productos') //status 201 es OK
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

routerProductos.put('/productos/:id', (req,res) =>{

    const {nombre, precio, thumbnail, timestamp, descripcion, codigo, stock} = req.body //se levantan los parametros del req.body

    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        console.log('error')
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    //transformo a Number el precio
    const precioFinal = Number(precio) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(precioFinal)) //NaN = Not a Number
    {
        console.log('error')
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
            await productContainer.updateById(id,{nombre, precioFinal, thumbnail, timestamp, descripcion, codigo, stockFinal})
            res.sendStatus(200) //status 201 es OK
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
    //res.sendStatus(202) //status 202 es OK

})

routerProductos.delete('/productos/:id', (req,res) =>{

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
            await productContainer.deleteById(id)
            res.sendStatus(200) //status 201 es OK
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

module.exports = routerProductos