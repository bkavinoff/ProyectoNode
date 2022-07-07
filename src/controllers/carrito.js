const res = require('express/lib/response');
const fs = require('fs');
const path = require('path')

//declaro mi clase contenedor
const ProductsContainer = require('./productos')

//inicializo el contenedor con el archivo de productos
const productContainer = new ProductsContainer('../productos.txt');

class CartContainer {
    constructor (nombreArchivo) {
        this.path = path.join(__dirname, nombreArchivo);
    }

    async addNewCart(obj) {
        try{
            if (fs.existsSync(this.path)){
                
                //el archivo existe, obtengo los productos
                let carts = await fs.promises.readFile(this.path, 'utf-8');

                let arrCarritos = [];

                if (carts.length === 0)
                {
                    obj.id = 1;
                }else
                {
                    //parseo de string a json
                    let prodJSON = JSON.parse(carts);
                    
                    arrCarritos = this.transformJSONtoArray(prodJSON);

                    //seteo el id de mi carrito
                    obj.id = arrCarritos.length + 1;
                }

                //seteo el timestamp
                obj.timestamp = new Date().toLocaleString('en-GB')

                //agrego un array vacío de productos
                obj.productos = []

                //agrego el producto al array
                arrCarritos.push(obj);
                
                //sobreescribo el archivo con el nuevo producto
                await fs.promises.writeFile(this.path, JSON.stringify(arrCarritos));
                console.log("Agregado el carrito a la lista con id: ", obj.id)

            }else{
                //seteo el id 1 a mi obj
                obj.id = 1;

                //seteo el timestamp
                obj.timestamp = new Date().toLocaleString('en-GB')

                //agrego un array vacío de productos
                obj.productos = []

                //no existe el archivo, lo creo
                await fs.promises.writeFile(this.path, JSON.stringify([obj]));
                console.log("Agregado el carrito a la lista con id: ", obj.id)
            }

            return obj.id
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async deleteCartById(id){
        try{
            
            let cart = await this.getCartById(id)

            if (typeof(cart) === 'string') {
                return (`Error: No existe un carrito con el id: ${id}`);
            }

            //obtengo el listado de productos
            let cartList = await this.getAll();

            //paso a Array
            let arr = this.transformJSONtoArray(cartList);

            //obtengo el index del producto
            let index =  arr.findIndex(p => p.id === id);
            
            //elimino del array el producto segun el index
            arr.splice(index,1)

            //escribo el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(arr));
            
            console.log('El carrito se ha eliminado con éxito.')
            return 'OK'
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async getCartById(id){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los productos
                let carts = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let cartList = JSON.parse(carts);
                
                let arrCart = this.transformJSONtoArray(cartList);
                
                //busco el carrito
                let cart = arrCart.find(p => p.id === id);
                
                //retorno
                if (typeof(cart) === 'undefined'){
                    return (`No existe un carrito con el id ${id}`);
                }else{
                    return cart;
                }

            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async getAll(){
        try{
            if (fs.existsSync(this.path)){  
                             
                //el archivo existe, obtengo los productos
                let carts = await fs.promises.readFile(this.path, 'utf-8');

                //parseo de string a jsonObject
                let cartList = JSON.parse(carts);
                
                //retorno
                if (cartList.length > 0){
                    return cartList;
                }else{
                    return ('No hay carritos');
                }
            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async getProductsByCartId(id){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los productos
                let carts = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let cartList = JSON.parse(carts);
                
                let arrCart = this.transformJSONtoArray(cartList);
                
                //busco el carrito
                let cart = arrCart.find(p => p.id === id);
                
                //retorno
                if (typeof(cart) === 'undefined'){
                    return (`No existe un carrito con el id ${id}`);
                }
                else
                {
                    //console.log('cart.productos.length: ', cart.productos.length)
                    if(cart.productos.length == 0)
                    {
                        return (`El carrito con id: ${id} está vacío`);
                    }
                    else 
                    {
                        return cart.productos;
                    }
                }

            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async addProductToCartByCartId(id,id_prod) {
        try{
            if (fs.existsSync(this.path)){
                
                //obtengo los carritos
                let carts = await this.getAll();

                //paso a JSON a array
                let arrCarts = this.transformJSONtoArray(carts);
                
                //busco el index del carrito en el array de carritos
                let cartIndex = arrCarts.findIndex(c => c.id === id);
                
                if (cartIndex === -1){
                    //no existe el carrito
                    return 'Error: No existe el carrito'
                }

                //busco el producto segun el id
                let prod = await productContainer.getById(id_prod)
                
                if (typeof(prod) === 'string'){
                    //no existe el carrito
                    return 'Error: No existe el producto'
                }

                //es un producto válido, lo agrego al carrito
                arrCarts[cartIndex].productos.push(prod)

                //sobreescribo el archivo con el nuevo producto
                await fs.promises.writeFile(this.path, JSON.stringify(arrCarts));
                console.log(`Agregado el producto ${prod.nombre} al carrito con id: ${id}`)
                return 'OK'
            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async deleteProductFromCartByCartId(id,id_prod) {
        try{
            if (fs.existsSync(this.path)){
                
                //obtengo los carritos
                let carts = await this.getAll();

                //paso a JSON a array
                let arrCarts = this.transformJSONtoArray(carts);
                
                //busco el index del carrito en el array de carritos
                let cartIndex = arrCarts.findIndex(c => c.id === id);
                
                if (cartIndex === -1){
                    //no existe el carrito
                    return 'Error: No existe el carrito'
                }

                //busco el index del producto en el array de carritos
                let prodIndex = arrCarts[cartIndex].productos.findIndex(p => p.id === id_prod);
                console.log(prodIndex)

                if (prodIndex === -1){
                    //no existe el carrito
                    return 'Error: No existe el producto'
                }

                //es un producto válido, lo saco del carrito
                arrCarts[cartIndex].productos.splice(prodIndex,1)
                console.log(arrCarts[cartIndex])

                //sobreescribo el archivo con el nuevo producto
                await fs.promises.writeFile(this.path, JSON.stringify(arrCarts));
                console.log(`Se ha eliminado el producto del carrito con id: ${id}`)
                return 'OK'
            }else{
                console.log('No existe el archivo')
            }
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    transformJSONtoArray(json){
        let arrayNuevo = [];
        //paso de jsonObject a Array:
        for (let prod of json){
            arrayNuevo.push(prod);
        }

        //retorno el array
        return arrayNuevo;
    }

}

module.exports = CartContainer // 👈 Export class