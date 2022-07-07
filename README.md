# ProyectoNode

To run the project, first you need to run "npm i" to install all the dependancies, and then run "npm start"

## CONFIGURATION
Edit the ".env" file present in this projet to set the specific global variables


## ENDPOINTS

The API uses the following endpoints:

### PRODUCTOS

GET:
/api/productos  <-- returns all the loaded products 

/api/productos/:id  <-- change the ":id" with the product id to get that specific product

POST:
/api/productos   <-- to add a new product, must receive the following fields in the req body:
            {nombre, precio, thumbnail, descripcion, codigo, stock}

PUT:
/api/productos/:id  <-- to update a product by id, change the number with the desired product id. Must receive the following fields in the req body:
             {nombre, precio, thumbnail, descripcion, codigo, stock}

DELETE:
/api/productos/:id  <-- to delete a product by id, change ":id" with the desired product id.


### CARRITO

GET:
/api/carrito/:id/productos  <-- To get all products from a cart by cart id (change the ":id" to the desired cart id)

POST:
/api/carrito  <-- to add a new cart

/api/carrito/:id/productos/:prod_id  <-- to add a product to a cart. Change ":id" with the desired cart id and ":id_prod" with the id of the desired product.

DELETE:
/api/carrito/:id  <-- to delete a cart. Change ":id" with the desired cart id

/api/carrito/:id/productos/:prod_id  <-- to delete a product from a cart. Change ":id" with the desired cart id and ":id_prod" with the id of the desired product.



