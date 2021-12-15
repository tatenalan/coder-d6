// Importaciones
const express = require('express')
const Product = require('./libs/Product')
const { Router } = express;
const handlebars = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

// Inicializaciones
const app = express();
const router = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// con __dirname traemos la ruta absoluta
// instanciamos el objeto y le pasamos un filename segun indica el constructor de la clase
const product = new Product(__dirname + "/data/products.json")

// Arrancamos el servidor con http.listen() en lugar de app.listen()
httpServer.listen(3000, () => console.log('SERVER ON'))
// no olvidarse de esto si vamos a responder con json. Sino lo muestra vacío
app.use(express.json()) 
 // Reconoce lo que le pasemos en el request como objeto
app.use(express.urlencoded({extended: true}))

// para que todas las rutas de abajo empiecen con /api/productos
app.use("/api/products", router)
// configura nuestro directorio estático
app.use(express.static(__dirname + '/public'));
// escuchamos el puerto

// defino el motor de plantillas (habdlebars)
app.engine('handlebars',handlebars.engine())

// especifica la carpeta de plantillas (handlebars)
app.set('views', './public')
app.set('view engine', 'handlebars')
        

/////////////// RUTAS desafío 4 ///////////////////////

// trae toda la lista
router.get("/", (req, res) => {
    return res.json(product.list)
})

// trae un objeto de la lista
router.get("/:id", (req, res) => {
    const id = req.params.id
    return res.json(product.find(id))
})

// inserta un objeto en la lista
router.post("/", (req, res) => {
    req.body.price = +req.body.price;
    const newProduct = req.body
    return res.json(product.insert(newProduct))
})

// actualiza un objeto de la lista
router.put("/:id", (req, res) => {
    const updateProduct = req.body
    const id = req.params.id
    return res.json(product.update(id, updateProduct))
})

// elimina un objeto de la lista
router.delete("/:id", (req, res) => {
    const id = req.params.id
    return res.json(product.delete(id))
})


// rutas desafío 6



app.get("/", (req, res) => {
    const products = product.list
    res.render('index', {products})
})

io.on('connection', (socket) => {

     // 'connection' se ejecuta la primera vez que se abre una nueva conexión
    console.log('Usuario conectado!')

    socket.on('newProduct', data => {
       console.log('nuevo producto', data);
       product.insert(data)
       fetch(__dirname + "/")
       io.sockets.emit('updatedList', product.list);
    })


    // chat

    socket.on("newMessage", message => {
        io.sockets.emit("newMessage", message)       
    })
})