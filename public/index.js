// Client web socket

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("INIT", (msg, allMessages) => {
  document.getElementById("messages").innerHTML = "";
  for (let msg of allMessages) {
    appendMessage(msg);
  }
});

socket.on("NEW_MESSAGE", (msg) => {
  appendMessage(msg);
});

function enviarMensaje() {
  const useremail = document.getElementById("email").value;
  const type="cliente"
  const message = document.getElementById("mensaje").value;

  socket.emit("POST_MESSAGE", { useremail, type, message });
}

function appendMessage(msg) {
  document.getElementById("messages").innerHTML += `
    <div>
        <div>
        ${msg.email} [${msg.date}]:${msg.mensaje}
        </div>
    </div> 
    `;
}

