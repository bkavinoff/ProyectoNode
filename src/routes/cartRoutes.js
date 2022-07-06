const { Router } = require('express')
const routerCarritos = Router()

//declaro mi clase contenedor
const CartContainer = require('../controllers/carrito')

//inicializo el contenedor con el archivo de productos
const cartContainer = new CartContainer('../carritos.txt');








module.exports = routerCarritos