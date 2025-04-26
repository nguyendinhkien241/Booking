import { chatWithAI } from "../utils/chatAi.js";

export const sendChat = async (req, res, next) => {
    const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const { response, hotels } = await chatWithAI(message);
    res.status(200).json({ response, hotels });
  } catch (error) {
    next(error);
  }
}