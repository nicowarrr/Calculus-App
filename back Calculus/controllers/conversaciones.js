const {getConversaciones} = require("../data/conversacionesData");
const {getAnalisis,createAnalisis} = require("../data/analisisData");
const OpenAIService = require('../services/openaiService2');
const { analyzeChatbotLog } = require('../services/analisis');
const Conversaciones = async (req, res) => {
    const { usuario_id } = req.body;
    try {
        console.log("ID de usuario:", usuario_id);
        const conversaciones = await getConversaciones(usuario_id);
        console.log("Conversaciones obtenidas:", conversaciones);
        res.status(200).json(conversaciones);
    } catch (error) {
        console.error("Error al obtener las conversaciones:", error);
        res.status(500).json({ error: "Error al obtener las conversaciones" });
    }
}
const Analisis = async (req, res) => {
    const { usuario_id } = req.body;
    try {
        const AnalisisData = await getAnalisis(usuario_id);
        console.log("Analisis Data:", AnalisisData);
        if(AnalisisData!=undefined){
            console.log("Análisis ya existe para el usuario:", usuario_id);
            const analisis=AnalisisData.analisis;
            return res.status(200).json({analisis:analisis});
        }else{
        console.log("Obteniendo conversaciones para el usuario:", usuario_id);
         // Obtener las conversaciones del usuario
        const conversaciones = await getConversaciones(usuario_id);

        console.log("Conversaciones obtenidas:", conversaciones);

        const botResponse = await analyzeChatbotLog(conversaciones, usuario_id);
        if(botResponse.feedback==undefined){
        const timestamp= new Date();
        await createAnalisis(usuario_id,botResponse,botResponse.scores,timestamp);
        res.status(200).json({analisis:botResponse});
        }else{
        const timestamp= new Date();
        await createAnalisis(usuario_id,botResponse.feedback,botResponse.scores,timestamp);
        res.status(200).json({analisis:botResponse.feedback});
        }
    }
    } catch (error) {
        console.log("Error al obtener el análisis:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}
const Analisis2 = async (req, res) => {
    const { usuario_id } = req.body;
    try {
        const AnalisisData = await getAnalisis(usuario_id);
        console.log("Analisis Data:", AnalisisData);
        const analisis=AnalisisData.analisis;
        return res.status(200).json({analisis:analisis});

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

module.exports = {
    Conversaciones,
    Analisis,
    Analisis2,
};