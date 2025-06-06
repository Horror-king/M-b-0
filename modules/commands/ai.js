const axios = require('axios'); // Required for making HTTP requests

module.exports = {
  config: {
    name: "ai", // Command name
    version: "1.0.0",
    hasPermssion: 0, // 0 = all users, 1 = admin bot, 2 = group admin
    credits: "Hassan", // Or the name of the AI integration source
    description: "Interacts with a specific AI model without or with a prefix.",
    commandCategory: "AI", // Category for the command
    usages: "ai [your prompt]", // How to use it
    cooldowns: 5, // Cooldown in seconds to prevent spam
    usePrefix: "both" // CHANGED: Set to "both" for dual functionality
  },

  run: async function ({ api, event, args, global, prompt }) {
    // 'prompt' here receives the text directly after "ai " or "?ai "
    if (!prompt) {
      return api.sendMessage("Please provide a prompt after 'ai'. Example: ai What is the capital of France?", event.threadID, event.messageID);
    }

    api.sendMessage("Getting AI response, please wait...", event.threadID, event.messageID);

    try {
      // The API endpoint provided by you
      const AI_API_URL = "https://over-ai-yau-5001-center-hassan.vercel.app/ai";

      // Make a GET request, passing the user's prompt as a query parameter
      const response = await axios.get(AI_API_URL, {
        params: {
          prompt: prompt
        }
      });

      // We assume the API returns a JSON object like {"response": "AI's answer here"}
      const aiResponse = response.data.response;

      if (aiResponse) {
        await api.sendMessage(aiResponse, event.threadID, event.messageID);
      } else {
        await api.sendMessage("AI response was empty or in an unexpected format. Please check the API status.", event.threadID, event.messageID);
        console.error("AI API unexpected response data:", response.data);
      }

    } catch (error) {
      console.error("AI API Error:", error);
      let errorMessage = "An error occurred while trying to get a response from the AI.";
      if (error.response) {
        console.error("AI API Response Error Data:", error.response.data);
        console.error("AI API Response Error Status:", error.response.status);
        errorMessage += `\nError Status: ${error.response.status}. Message: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage += `\nNo response received from AI service. Check network or API endpoint.`;
      } else {
        errorMessage += `\nError setting up API request: ${error.message}.`;
      }
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
