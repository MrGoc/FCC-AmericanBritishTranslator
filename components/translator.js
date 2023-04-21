const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  get americanLocale() {
    return "american-to-british";
  }

  get britishLocale() {
    return "british-to-american";
  }

  translate(text, locale) {
    if (locale === this.americanLocale)
      return this.#translateAmericanToBritish(text);
    else return this.#translateBritishToAmerican(text);
  }

  #translateAmericanToBritish(text) {
    let textArr = text.split(" ");
    let transText = text;
    let translation = "";
    textArr.forEach((el) => {
      translation = "";
      if (el in americanOnly) translation = americanOnly[el];
      else if (el in americanToBritishSpelling)
        translation = americanToBritishSpelling[el];
      else if (el in americanToBritishTitles) {
        translation = americanToBritishTitles[el];
        // capitalize first letter
        translation =
          translation.charAt(0).toUpperCase() + translation.slice(1);
      }

      if (translation !== "") {
        transText = transText.replace(el, translation);
      }
    });

    return transText;
  }

  #translateBritishToAmerican(text) {
    return text;
  }
}

module.exports = Translator;
