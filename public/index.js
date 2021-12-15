// Inicializamos una constante para poder utilizar los sockets desde el cliente
const socket = io();


/////////////// productos /////////////////

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

// cuando se conecte un usuario verá la lista de mensajes actual
socket.on("messages", messages => {
    render(messages)
})

function render(messages) {
    messages.forEach(message => {
        $("#messages").append(
            `<span id="email">${message.email}</span>
            <span id="date">${message.date}</span>
            <span id="data">: ${message.data}</span>
            <br>`)
    })
}

$("#myForm").submit(e => {
    e.preventDefault();
    const message = {
        email: $("#email").val(),
        date: `[${new Date().toLocaleString()}]`,
        data: $("#msg").val()
    }
    
    $("#msg")[0].value = "";
    
    socket.emit("newMessage", message);
});