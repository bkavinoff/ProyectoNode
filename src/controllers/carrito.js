const res = require('express/lib/response');
const fs = require('fs');
const path = require('path')

class CartContainer {
    constructor (nombreArchivo) {
        this.path = path.join(__dirname, nombreArchivo);
    }

    async add(obj) {
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

            //retorno
            res.status(200).send(`Se ha creado el carrito y se le asignó el id ${obj.id}`)
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async getById(id){
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

    async getCartCount(){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los productos
                let carts = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let cartList = JSON.parse(carts);
                
                //retorno
                return cartList.length
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

    async deleteById(id){
        try{
            let cart = await this.getById(id)
            if (typeof(prod) === 'string') {
                return (`No existe un carrito con el id ${id}`);
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
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async deleteAll(){
        try{
            if (fs.existsSync(this.path)){  
                await fs.promises.writeFile(this.path, '');
                console.log('Se han eliminado con éxito todos los carritos.')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de carritos');
        }
    }

    async updateById(id, carritoActualizado){
        try{
            let prod = await this.getById(id)
            if (typeof(prod) === 'string') {
                return (`No existe un carrito con el id ${id}`);
            }

            //obtengo el listado de carritos
            let cartList = await this.getAll();

            //paso a Array
            let arr = this.transformJSONtoArray(cartList);

            //obtengo el index del carrito
            let index =  arr.findIndex(p => p.id === id);
            
            //actualizo los datos del carrito
            // arr[index].nombre = productoActualizado.nombre
            // arr[index].precio = productoActualizado.precio
            // arr[index].thumbnail = productoActualizado.thumbnail

            //escribo el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(arr));
            
            console.log('El producto se ha actualizado con éxito.')
            return
            
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
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