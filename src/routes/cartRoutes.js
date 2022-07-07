const { Router } = require('express')
const routerCarritos = Router()

//declaro mi clase contenedor
const CartContainer = require('../controllers/carrito')

//inicializo el contenedor con el archivo de productos
const cartContainer = new CartContainer('../carritos.txt');

routerCarritos.post('/carrito', (req,res) =>{

    const p = async()=>{
        try{
            const id = await cartContainer.addNewCart({})
            res.status(200).send(`Se ha creado el carrito y se le asignó el id ${id}`)
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

routerCarritos.delete('/carrito/:id', (req,res) =>{

    const p = async()=>{
        //transformo a Number el contenido de id que era string
        const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
        if (isNaN(id)) //NaN = Not a Number
        {
            console.log('error')
            res.status(400).json({error:`${req.params.id} no es un número válido`})
            return
        }
        try{
            const result = await cartContainer.deleteCartById(id)

            if (result.includes('OK'))
                res.status(200).send(`Se ha eliminado el carrito con id: ${id}`)
            else {
                res.status(500).send(`Se produjo un error: ${result}`)
            }
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

routerCarritos.get('/carrito/:id/productos', (req, res) =>{
    
    //transformo a Number el contenido de id que era string
    const id = Number(req.params.id) //en caso de no contener un numero, la funciona devuelve un NaN
    if (isNaN(id)) //NaN = Not a Number
    {
        res.status(400).json({error:`${req.params.id} no es un número válido`})
        return
    }

    const p = async () => {
        res.status(200).send(await cartContainer.getProductsByCartId(id));
    }
    p();
})

routerCarritos.post('/carrito/:id/productos/:id_prod', (req,res) =>{

    const id = Number(req.params.id)
    if (isInvalidNmber(id)){
        res.status(400).json({error:`${req.params.id} no es un número válido`})
    }

    const id_prod = Number(req.params.id_prod)
    if (isInvalidNmber(id_prod)){
        res.status(400).json({error:`${req.params.id_prod} no es un número válido`})
    }

    const p = async()=>{
        try{
            const result = await cartContainer.addProductToCartByCartId(id,id_prod)
            if (result.includes('OK'))
                res.status(200).send(`Se ha agregado el producto al carrito con id: ${id}`)
            else {
                res.status(500).send(`Se produjo un error: ${result}`)
            }
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

routerCarritos.delete('/carrito/:id/productos/:id_prod', (req,res) =>{

    const id = Number(req.params.id)
    if (isInvalidNmber(id)){
        res.status(400).json({error:`${req.params.id} no es un número válido`})
    }

    const id_prod = Number(req.params.id_prod)
    if (isInvalidNmber(id_prod)){
        res.status(400).json({error:`${req.params.id_prod} no es un número válido`})
    }

    const p = async()=>{
        try{
            const result = await cartContainer.deleteProductFromCartByCartId(id,id_prod)

            if (result.includes('OK'))
                res.status(200).send(`Se ha eliminado el producto con id: ${id_prod} del carrito con id: ${id}`)
            else {
                res.status(500).send(`Se produjo un error: ${result}`)
            }
        }catch(e){
            res.sendStatus(500) //status 500 es Server Error
        }
    }
    p();
})

const isInvalidNmber = (receivedId) =>{
    //transformo a Number el contenido de id que era string
    const id = Number(receivedId) //en caso de no contener un numero, la funciona devuelve un NaN

    return isNaN(id)
}


module.exports = routerCarritos