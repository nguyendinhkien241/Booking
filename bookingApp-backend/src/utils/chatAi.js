import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  import Hotel from "../models/Hotel.js"; // Import the Hotel model using ES Modules
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation", // Use a stable model (adjust as needed)
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
      "image",
      "text",
    ],
    responseMimeType: "text/plain",
  };
  
  // Function to handle chat requests
  const chatWithAI = async (userMessage) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      // Step 1: Use Gemini AI to determine if the query is a hotel suggestion request and extract the city
      const intentPrompt = `
        The user asked: "${userMessage}"
        Determine if the user is asking for hotel suggestions. If yes, extract the city name from the query.
        Respond in the following JSON format:
        {
          "isHotelQuery": true/false,
          "city": "city name" (or null if not a hotel query or city not found)
        }
        Examples of hotel suggestion queries:
        - "suggest hotels in Đà Nẵng"
        - "gợi ý khách sạn ở Hà Nội"
        - "tìm khách sạn tại Sài Gòn"
        - "where to stay in Ho Chi Minh City"
        - "khách sạn nào đẹp ở Nha Trang"
        Examples of non-hotel queries:
        - "What’s the weather in Hà Nội?"
        - "Tell me a joke"
        - "How are you today?"
      `;
      const intentResult = await chatSession.sendMessage(intentPrompt);
      let intentResponse;
      try {
        intentResponse = JSON.parse(intentResult.response.text());
      } catch (error) {
        console.error("Error parsing intent response:", error);
        intentResponse = { isHotelQuery: false, city: null };
      }
  
      let prompt = userMessage;
      let hotelsData = null;
  
      // Step 2: Handle the query based on intent
      if (intentResponse.isHotelQuery && intentResponse.city) {
        const city = intentResponse.city;
        // Fetch up to 3 hotels from the database for the specified city
        const hotels = await Hotel.find({ city: new RegExp(city, "i") }).limit(3);
  
        if (hotels.length > 0) {
          hotelsData = hotels.map((hotel) => ({
            id: hotel._id,
            name: hotel.name,
            type: hotel.type,
            city: hotel.city,
            cheapestPrice: hotel.cheapestPrice,
          }));
  
          const hotelList = hotelsData
            .map((hotel, index) => {
              return `${index + 1}. ${hotel.name} (${hotel.type}) - ${hotel.city}, Price: $${hotel.cheapestPrice}`;
            })
            .join("\n");
  
          prompt = `The user asked: "${userMessage}". Here is a list of up to 3 hotels in ${city}:\n${hotelList}\nProvide a helpful response in Vietnamese, recommending these hotels in a natural and friendly way. Start your response with "Dưới đây là một số gợi ý khách sạn ở ${city}:" and end with a suggestion to explore more options if needed.`;
        } else {
          prompt = `The user asked: "${userMessage}". I couldn't find any hotels in ${city}. Provide a helpful response in Vietnamese, suggesting alternatives or asking for more details. For example, you might say: "Rất tiếc, tôi không tìm thấy khách sạn nào ở ${city}. Bạn có muốn thử tìm ở một thành phố khác không?"`;
        }
      } else {
        // If it's not a hotel query, let Gemini AI handle the query directly
        prompt = `The user asked: "${userMessage}". Provide a helpful and natural response in Vietnamese. If the query is about weather, format the response naturally with details about the weather (e.g., temperature, conditions) without using Markdown symbols like ** or *. For other queries, respond conversationally.`;
      }
  
      // Step 3: Send the message to Gemini AI to get a natural response
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
  
      // Return both the AI's response and the hotels data (if any)
      return {
        response: responseText,
        hotels: hotelsData,
      };
    } catch (error) {
      console.error("Error in chatWithAI:", error);
      throw new Error("Failed to get a response from the AI.");
    }
  };
  
  export { chatWithAI };