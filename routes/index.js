const express = require('express')
const { Router } = require('express')
const router = Router()

const productos = [
    {id:1, nombre:'mesa', precio:4000, thumbnail:'https://www.espacity.com/w/wp-content/uploads/01476001000020_1-768x624.jpg'},
    {id:2, nombre:'silla', precio: 1500, thumbnail:'https://www.torca.com.ar/thumb/00000000000484199462148419_800x800.png'},
    {id:3, nombre:'mantel', precio: 500, thumbnail:'https://arredo.vteximg.com.br/arquivos/ids/246157-800-800/51011G03329-B_0.jpg'}]

router.get('/', express.static('public'))

router.get('/productos', (req, res) =>{

    const {nombre} = req.query
    if (nombre){
        const product = productos.filter(producto => {
            return product.nombre.toLowerCase() === nombre.toLowerCase()
        })
        if (product){
            res.statusCode(200).json(product)
            return
        }else{
            res.statusCode(400).json({error:'no existe el producto'})
            return
        }
    }
    
    res.json(productos)
})

router.get('/productos/:id', (req, res) =>{

    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    const product = productos.filter(producto => {
        return producto.id === Number(id) 
    })

    if(!product.id){
        res.status(404).json({error:`No existe un producto con id: ${id}`})
        return
    }

    res.status(200).json(product) //con el status envio manualmente el estado de la peticion con la respuesta
})

router.post('/productos', (req,res) =>{
    const {nombre, precio, thumbnail} = req.body //se levantan los parametros del req.body
    
    let idNuevo = 0;
    const numProductos = productos.length;

    if (numProductos > 0){
        //obtengo el ultimo producto ingresado
        const lastProductID = (productos[numProductos - 1]).id

        //seteo el ID correspondiente al nuevo producto
        idNuevo = lastProductID + 1
    }   

    productos.push({id:idNuevo, nombre:nombre, precio:precio, thumbnail:thumbnail})
    res.sendStatus(201) //status 201 es OK
})

router.put('/productos/:id', (req,res) =>{
    const {nombre, precio, thumbnail} = req.body //se levantan los parametros del req.body

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

    //obtengo la posición del producto dentro del array
    const index = productos.findIndex(p => {
        return p.id === id;
    });

    //si no existe, devuelvo el error correspondiente
    if (index == -1){
        res.status(400).json({error:`No existe producto con el id: ${id}`})
        return
    }

    //actualizo el producto
    productos[index].nombre = nombre;
    productos[index].precio = precio;
    productos[index].thumbnail = thumbnail;

    res.sendStatus(202) //status 201 es OK
})

router.delete('/productos/:id', (req,res) =>{

    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        console.log('error')
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    //obtengo la posición del producto dentro del array
    const index = productos.findIndex(p => {
        return p.id === id;
    });

    //si no existe, devuelvo el error correspondiente
    if (index == -1){
        res.status(400).json({error:`No existe producto con el id: ${id}`})
        return
    }

    //elimino el producto
    productos.splice(index,1)

    res.sendStatus(200) //status 200 es OK
})

module.exports = router; //exporto para poder usarlo en otro file