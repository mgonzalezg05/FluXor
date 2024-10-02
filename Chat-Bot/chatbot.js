// chatbot.js
document.addEventListener('DOMContentLoaded', function () {
    var chatbotModal = document.getElementById('chatbotModal');
    var chatbotClose = document.getElementsByClassName('chatbot-close')[0];
    var chatbotSendBtn = document.getElementById('chatbot-send');
    var chatbotInput = document.getElementById('chatbot-input');
    var chatbotMessages = document.getElementById('chatbot-messages');

    // Función para abrir el modal
    function openChatbot() {
        chatbotModal.style.display = 'block';
    }

    // Función para cerrar el modal
    function closeChatbot() {
        chatbotModal.style.display = 'none';
    }

    // Lógica para enviar el mensaje (como antes)
    function sendMessage() {
        var userMessage = chatbotInput.value.trim();
        if (userMessage !== '') {
            addMessageToChat('Usuario', userMessage);
            chatbotInput.value = ''; // Limpiar el input después de enviar

            // Respuesta simple del bot
            setTimeout(function () {
                addMessageToChat('Fluxor', 'Gracias por tu mensaje, pronto te responderemos.');
            }, 500); // Simulación de respuesta con retardo
        }
    }

    // Añadir mensajes al chat
    function addMessageToChat(sender, message) {
        var messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll automático
    }

    // Listeners para abrir/cerrar el modal
    document.getElementById('openChatbotBtn').onclick = openChatbot;
    chatbotClose.onclick = closeChatbot;

    // Enviar mensaje cuando se presiona Enter
    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
