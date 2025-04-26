import SendEmailService from "../utils/sendEmail.js";

export const SendEmail = async (req, res, next) => {
    const { email, emailData } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await SendEmailService(email, emailData);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}