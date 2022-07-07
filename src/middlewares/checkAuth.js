require('dotenv').config()

// Verifica que el usuario tenga autorización
const checkAuth = (req, res, next) => {
    // const isAdmin = process.env.ISADMIN
    // console.log('typeof: ', typeof isAdmin)
    // console.log('isAdmin: ', isAdmin)

    if ( process.env.ISADMIN === "true" ) {
        next();
    } else {
        res.status(403).send({ error: -1, mensaje: `No tenés permisos para acceder a la Ruta ${req.url} usando el método ${req.method}`});
    }
}

module.exports = { checkAuth };