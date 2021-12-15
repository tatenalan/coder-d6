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

// cuando se conecte un usuario verá la lista de mensajes actual
socket.on("messages", messages => {
    console.log(messages);
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

// cuando se envíe un mensaje nuevo se agregará a la lista de mensajes actual
socket.on("newMessage", message => {
    // $("#myForm").submit(e => {
    //     e.preventDefault();
        $("#messages").append(
            `<span id="email">${message.email}</span>
            <span id="date">${message.date}</span>
            <span id="data">: ${message.data}</span>
            <br>`)
    // })
})

$("#msg").change(sendMessage)
// $("#submit-chat").click(sendMessage)

function sendMessage() {
    const message = {
        email: $("#email")[0].value,
        date: `[${new Date().toLocaleString()}]`,
        data: $("#msg")[0].value
    }

   $("#msg")[0].value = "";

    socket.emit("newMessage", message);
}