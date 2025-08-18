const Responde = require('../services/responde');
const Verificador = require('../services/verificador');
const Provocador= require('../services/provocador');
const { createChat } = require("../data/chatData");
const Filtro = require('../services/filtro');

const conversations = {};

const chat = async (req, res) => {
  try {
    const { mensaje_usuario, conversationId, usuario_id, currentExercise } = req.body;

    let conversation = [];
    let exerciseChanged = false;
    let userMessageCount = 0;
    let collaborationPassed = false;
    let PHASE_REACHED = false;
 // <-- Inicializamos el contador

    if (conversationId && conversations[conversationId]) {
      const stored = conversations[conversationId];
      if (stored.exerciseId !== currentExercise) {
        exerciseChanged = true;
      } else {
        conversation = stored.messages;
        userMessageCount = stored.userMessageCount || 0; // <-- Recuperamos contador anterior si existe
      }
    }

    if (exerciseChanged) {
      conversation = [];
      userMessageCount = 0; // <-- Reiniciamos el contador si cambió de ejercicio
    }

    conversation.push({
      sender: 'user',
      text: mensaje_usuario,
      timestamp: new Date()
    });

console.log("Mensaje del usuario:", mensaje_usuario);

    // Normaliza el mensaje (quita tildes y pasa a minúsculas)
const mensajeLimpio = mensaje_usuario
  .trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

// Lista de palabras interrogativas sin tildes
const interrogativas = [
  "que", "quien", "quienes", "cuando", "donde", "por que",
  "como", "cual", "cuales", "para que", "es", "hay", "tengo"
];

// Comprobación 1: ¿termina con signo de interrogación?
const terminaConInterrogacion = mensajeLimpio.endsWith("?");

// Comprobación 2: ¿empieza con una palabra interrogativa?
const empiezaConInterrogativa = interrogativas.some(palabra =>
  mensajeLimpio.startsWith(palabra)
);

// Resultado final
const esUnaPregunta = terminaConInterrogacion || empiezaConInterrogativa;

console.log("Es una pregunta? : ",esUnaPregunta);

    const botResponseFiltro = await Filtro.filtrar(mensaje_usuario);

    console.log("respuesta filtro: ", botResponseFiltro);

    if (botResponseFiltro.includes("true")) {
      userMessageCount++; // <-- Incrementamos el contador solo si pasa el filtro
      console.log("contador de mensajes del usuario:", userMessageCount);
      if(userMessageCount%4==0 && esUnaPregunta!=true) {

        console.log("Se ha activado el provocador");
        const botResponseProvocador = await Provocador.generateResponse(conversation, currentExercise);
        conversation.push({
        sender: 'bot',
        text: botResponseProvocador,
        timestamp: new Date()
      });
      const timestamp = new Date();

      await createChat(usuario_id, mensaje_usuario, botResponseProvocador, timestamp, currentExercise);

      const newConversationId = conversationId || `conv_${Date.now()}`;
      conversations[newConversationId] = {
        exerciseId: currentExercise,
        messages: conversation,
        userMessageCount // <-- Guardamos el contador actualizado
      };

      res.status(200).json({
        conversationId: conversationId,
        response: botResponseProvocador,
        usuario_id,
        timestamp: new Date(),
        currentExercise,
        collaborationPassed: false,
        PHASE_REACHED: false,
        userMessageCount 
      });

      }
      else{
      const botResponseOriginal = await Responde.generateResponse(conversation, currentExercise);
      console.log("Respuesta generada originalmente:", botResponseOriginal);
      
      conversation.push({
        sender: 'bot',
        text: botResponseOriginal,
        timestamp: new Date()
      });

      const timestamp = new Date();
      await createChat(usuario_id, mensaje_usuario, botResponseOriginal, timestamp, currentExercise);
      console.log("Conversacion creado:", mensaje_usuario, botResponseOriginal, timestamp, currentExercise);
     
      const newConversationId = conversationId || `conv_${Date.now()}`;
      conversations[newConversationId] = {
        exerciseId: currentExercise,
        messages: conversation,
        userMessageCount // <-- Guardamos el contador actualizado
      };
      if(userMessageCount==5||userMessageCount==10||userMessageCount>=14) {
        PHASE_REACHED = true;
      }
      let verificadorResponse="";
      if(userMessageCount >= 20){
        verificadorResponse = await Verificador.generateResponse(conversation, currentExercise);
        console.log("Respuesta del verificador:", verificadorResponse);
      }
      if(verificadorResponse.includes("ACUERDO_CLARO")||userMessageCount>=30) {
        collaborationPassed = true;
      }
      res.status(200).json({
        conversationId: newConversationId,
        response: botResponseOriginal,
        usuario_id,
        timestamp,
        currentExercise,
        collaborationPassed,
        PHASE_REACHED,
        userMessageCount // <-- Puedes retornarlo si lo necesitas en el frontend
      });
    }
    } else {
      const botResponse = "Lo siento, no puedo ayudar con eso.";
      
      conversation.push({
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      });

      const timestamp = new Date();
      await createChat(usuario_id, mensaje_usuario, botResponse, timestamp, currentExercise);

      res.status(200).json({
        conversationId: conversationId,
        response: botResponse,
        usuario_id,
        timestamp: new Date(),
        currentExercise,
        collaborationPassed: false,
        PHASE_REACHED: false,
        userMessageCount // <-- No se incrementa en este caso
      });
    }
  } catch (error) {
    console.error('Error en el chatbot:', error);
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  }
};

module.exports = { chat };


