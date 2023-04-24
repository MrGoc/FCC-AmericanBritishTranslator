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

  translate(text, locale, highlight) {
    if (locale === this.americanLocale)
      return this.#translateAmericanToBritish(text, highlight);
    else return this.#translateBritishToAmerican(text, highlight);
  }

  #translateAmericanToBritish(text, highlight) {
    let transText = text;
    let textArr = transText.split(" ");
    let translation = "";
    let timeArr = [];
    textArr.forEach((el) => {
      translation = "";
      timeArr = el.split(":");
      if (timeArr.length >= 2 && !isNaN(+timeArr[0]) && !isNaN(+timeArr[1])) {
        translation = el.replace(":", ".");
      } else if (el.toLowerCase() in americanOnly)
        translation = americanOnly[el.toLowerCase()];
      else if (el.toLowerCase() in americanToBritishSpelling)
        translation = americanToBritishSpelling[el.toLowerCase()];
      else if (el.toLowerCase() in americanToBritishTitles) {
        translation = americanToBritishTitles[el.toLowerCase()];
        // capitalize first letter
        translation =
          translation.charAt(0).toUpperCase() + translation.slice(1);
      }

      if (translation !== "") {
        if (highlight)
          transText = transText.replace(
            el,
            '<span class="highlight">' + translation + "</span>"
          );
        else transText = transText.replace(el, translation);
      }
    });

    return transText;
  }

  #translateBritishToAmerican(text, highlight) {
    let transText = text;
    let textArr = transText.split(" ");
    let translation = "";
    let timeArr = [];
    textArr.forEach((el) => {
      translation = "";
      timeArr = el.split(".");
      if (timeArr.length >= 2 && !isNaN(+timeArr[0]) && !isNaN(+timeArr[1])) {
        translation = el.replace(".", ":");
      } else if (el in britishOnly) {
        translation = britishOnly[el];
      } else {
        Object.getOwnPropertyNames(americanToBritishSpelling).every(
          (prop, idx, array) => {
            if (americanToBritishSpelling[prop] === el.toLowerCase()) {
              translation = prop;
              return false; // this is break
            }
            return true; // this is continue
          }
        );
        if (translation === "") {
          Object.getOwnPropertyNames(americanToBritishTitles).every(
            (prop, idx, array) => {
              if (americanToBritishTitles[prop] === el.toLowerCase()) {
                translation = prop;
                // capitalize first letter
                translation =
                  translation.charAt(0).toUpperCase() + translation.slice(1);
                return false; // this is break
              }
              return true; // this is continue
            }
          );
        }
      }

      if (translation !== "") {
        if (highlight)
          transText = transText.replace(
            el,
            '<span class="highlight">' + translation + "</span>"
          );
        else transText = transText.replace(el, translation);
      }
    });

    return transText;
  }
}

module.exports = Translator;
