const res = require('express/lib/response');
const fs = require('fs');
const path = require('path')

class ProductsContainer {
    constructor (nombreArchivo) {
        this.path = path.join(__dirname, nombreArchivo);
    }

    async add(obj) {
        try{
            if (fs.existsSync(this.path)){
                
                //el archivo existe, obtengo los productos
                let products = await fs.promises.readFile(this.path, 'utf-8');

                let arrProductos = [];

                if (products.length === 0)
                {
                    obj.id = 1;
                }else
                {
                    //parseo de string a json
                    let prodJSON = JSON.parse(products);
                    
                    arrProductos = this.transformJSONtoArray(prodJSON);

                    //seteo el id de mi producto
                    obj.id = arrProductos.length + 1;
                }

                //paso el precio a valor numérico
                obj.precio = Number(obj.precio)

                //paso el stock a valor numérico
                obj.stock = Number(obj.stock)

                //seteo el timestamp
                obj.timestamp = new Date().toLocaleString('en-GB')

                //agrego el producto al array
                arrProductos.push(obj);
                
                //sobreescribo el archivo con el nuevo producto
                await fs.promises.writeFile(this.path, JSON.stringify(arrProductos));
                console.log("Agregado el producto a la lista con id: ", obj.id)
            }else{
                //seteo el id 1 a mi obj
                obj.id = 1;

                //paso el precio a valor numérico
                obj.precio = Number(obj.precio)

                //paso el stock a valor numérico
                obj.stock = Number(obj.stock)

                //seteo el timestamp
                obj.timestamp = new Date().toLocaleString('en-GB')

                //no existe el archivo, lo creo
                await fs.promises.writeFile(this.path, JSON.stringify([obj]));
                console.log("Agregado el producto a la lista con id: ", obj.id)
            }

            //retorno
            res.status(200).send(`Se ha creado el producto ${obj.nombre}, y se le asignó el id ${obj.id}`)
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async getById(id){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los productos
                let products = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let productList = JSON.parse(products);
                
                let arrProductos = this.transformJSONtoArray(productList);
                
                //busco el producto
                let product = arrProductos.find(p => p.id === id);
                
                //retorno
                if (typeof(product) === 'undefined'){
                    return (`No existe un producto con el id ${id}`);
                }else{
                    return product;
                }

            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async getProductsCount(){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los productos
                let products = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let productList = JSON.parse(products);
                
                //retorno
                return productList.length
            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async getAll(){
        try{
            if (fs.existsSync(this.path)){  
                             
                //el archivo existe, obtengo los productos
                let products = await fs.promises.readFile(this.path, 'utf-8');

                //parseo de string a jsonObject
                let productList = JSON.parse(products);
                
                //retorno
                if (productList.length > 0){
                    return productList;
                }else{
                    return ('No hay productos');
                }
            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async deleteById(id){
        try{
            let prod = await this.getById(id)
            if (typeof(prod) === 'string') {
                return (`No existe un producto con el id ${id}`);
            }

            //obtengo el listado de productos
            let productList = await this.getAll();

            //paso a Array
            let arr = this.transformJSONtoArray(productList);

            //obtengo el index del producto
            let index =  arr.findIndex(p => p.id === id);
            
            //elimino del array el producto segun el index
            arr.splice(index,1)

            //escribo el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(arr));
            
            console.log('El producto se ha eliminado con éxito.')
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async deleteAll(){
        try{
            if (fs.existsSync(this.path)){  
                await fs.promises.writeFile(this.path, '');
                console.log('Se han eliminado con éxito todos los productos.')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async updateById(id, productoActualizado){
        try{
            let prod = await this.getById(id)
            if (typeof(prod) === 'string') {
                return (`No existe un producto con el id ${id}`);
            }

            //obtengo el listado de productos
            let productList = await this.getAll();

            //paso a Array
            let arr = this.transformJSONtoArray(productList);

            //obtengo el index del producto
            let index =  arr.findIndex(p => p.id === id);
            
            //actualizo los datos del producto
            arr[index].nombre = productoActualizado.nombre
            arr[index].precio = productoActualizado.precio
            arr[index].thumbnail = productoActualizado.thumbnail
            arr[index].timestamp = new Date().toLocaleString('en-GB')
            arr[index].descripcion = productoActualizado.descripcion
            arr[index].codigo = productoActualizado.codigo
            arr[index].stock = productoActualizado.stock

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




module.exports = ProductsContainer // 👈 Export class