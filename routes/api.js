"use strict";

const { json } = require("body-parser");
const Translator = require("../components/translator.js");

const amToBr = "american-to-british";
const brToAm = "british-to-american";

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    let text = req.body.text;
    let locale = req.body.locale;
    if (!text || !locale) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    if (text === "") {
      res.json({ error: "No text to translate" });
      return;
    }
    if (locale !== amToBr || locale != brToAm) {
      res.json({ error: "Invalid value for locale field" });
      return;
    }
    let transText = translator.translate(text);
    if (transText === text)
      res.json({
        text: text,
        translation: "Everything looks good to me!",
      });
    else
      res.json({
        text: text,
        translation: transText,
      });
  });
};
