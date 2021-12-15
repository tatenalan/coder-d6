// Inicializamos una constante para poder utilizar los sockets desde el cliente
const socket = io();

// Emite mensaje al servidor con la hora y el mensaje enviado recibido por el atributo value del input
function createProduct() {
    const productData =
    {
        title: $("#title")[0].value,
        price: $("#price")[0].value,
        thumbnail: $("#thumbnail")[0].value
    }
    console.log('nuevo producto', productData);
    socket.emit('newProduct', productData)
}


// cuando el valor del input cambia, emitimos
$("#submit").click(createProduct);


socket.on("updatedList", productList => {
    console.log('lista de productos', productList);
})


/////////////// chat /////////////////

socket.on("newMessage", message => {
    $("#messages").append(
        `<span id="email">${message.email}</span>
        <span id="date">${message.date}</span>
        <span id="data">: ${message.data}</span>
        <br>`)
})

$("#submit-chat").click(sendMessage)

function sendMessage() {
    let message = {
        email: $("#emailInput")[0].value,
        date: `[${new Date().toLocaleString()}]`,
        data: $("#msgInput")[0].value
    }

   $("#msgInput")[0].value = "";

    socket.emit("newMessage", message);
}