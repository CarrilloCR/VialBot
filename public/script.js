async function sendMessage() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");

  if (!input.trim()) {
    responseBox.innerHTML = "Escribí una pregunta primero.";
    return;
  }

  responseBox.innerHTML = "Cargando...";

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    responseBox.innerHTML = data.reply || data.error || "Sin respuesta.";
  } catch (error) {
    responseBox.innerHTML = "Error: " + error.message;
  }
}

document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
