const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv").config();
const app = express();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const cors = require("cors");

app.use(express.json());
app.use(cors());
const openai = new OpenAIApi(configuration);

app.post("/askMagicDonut", async function (req, res) {
  try {
    console.log(req.body.question);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Act like a magic 8 ball every answer i give you from now on, give me a random magic 8 ball answer, however, the answer should be specific/related to the question, do you understand?
      Also, instead of saying magic 8 ball says, say The magic donut has decided your fate: . Your first question is - ${req.body.question}?
      `,
      temperature: 1,
      max_tokens: 200,
    });

    console.log(response.data.choices[0].text);
    res.status(200).send({ message: response.data.choices[0].text });
  } catch (err) {
    res
      .status(400)
      .send({ message: "The Magic Donut has decided to take a break" });
    console.log(err);
  }
});

app.listen(8080);
