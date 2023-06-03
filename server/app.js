const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const cors = require("cors");

app.use(express.json());
app.use(cors());
const openai = new OpenAIApi(configuration);

app.post("/askMagicDonut", async function (req, res) {
  try {
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: "Say this is a test",
      temperature: 0,
      max_tokens: 7,
    });
    res.send("Testing");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(8080);
