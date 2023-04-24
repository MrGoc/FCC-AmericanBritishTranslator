"use strict";

const { json } = require("body-parser");
const Translator = require("../components/translator.js");

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
    if (
      locale !== translator.americanLocale &&
      locale != translator.britishLocale
    ) {
      res.json({ error: "Invalid value for locale field" });
      return;
    }
    //text = text.replaceAll("\n", " ");
    let transText = translator.translate(text, locale, true);
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
