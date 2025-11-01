const main = require("../config/gemini");

const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log("prompt Inside ai.js controller", prompt);

    const content = await main(
      "Act as a movie recommendation system and suggest some movies for the query: " +
        prompt +
        ". Only give me names of 5 movies, comma separated like the example result given ahead. The result should be in a proper json format lets say example: {result:'Bahubali, RRR, The Conjuring: Last Rites, The Naked Gun, Interstellar'}"
    );
    // console.log("Content inside ai.js controller: ", content);

    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

module.exports = generateContent;
