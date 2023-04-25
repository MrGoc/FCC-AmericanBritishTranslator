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

  #convertTime(text, charFrom, charTo) {
    let newText = "";
    let timeArr = text.split(charFrom);
    if (timeArr.length >= 2 && !isNaN(+timeArr[0]) && !isNaN(+timeArr[1])) {
      newText = text.replace(charFrom, charTo);
    }
    return newText;
  }

  #translateAmericanToBritish(text, highlight) {
    let transText = text;
    let textArr = transText.split(/[\s.]+/);
    let translation = "";
    textArr.forEach((el) => {
      translation = this.#convertTime(el, ":", ".");
      if (translation === "") {
        /*
        if (el.toLowerCase() in americanToBritishTitles) {
          translation = americanToBritishTitles[myEl.toLowerCase()];
          // capitalize first letter
          translation =
            translation.charAt(0).toUpperCase() + translation.slice(1);
        } else */
        if (el.toLowerCase() in americanToBritishSpelling)
          translation = americanToBritishSpelling[el.toLowerCase()];
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
    Object.getOwnPropertyNames(americanToBritishTitles).forEach((prop) => {
      let regex = new RegExp(prop, "ig");
      let val = americanToBritishTitles[prop];
      // capitalize first letter
      val = val.charAt(0).toUpperCase() + val.slice(1);
      if (highlight)
        transText = transText.replace(
          regex,
          '<span class="highlight">' + val + "</span>"
        );
      else transText = transText.replace(regex, val);
    });
    Object.getOwnPropertyNames(americanOnly).forEach((prop) => {
      let regex = new RegExp("\\b" + prop + "\\b", "ig");
      if (highlight)
        transText = transText.replace(
          regex,
          '<span class="highlight">' + americanOnly[prop] + "</span>"
        );
      else transText = transText.replace(regex, americanOnly[prop]);
    });

    return transText;
  }

  #translateBritishToAmerican(text, highlight) {
    let transText = text;
    let textArr = transText.split(/[\s.]+/);
    let translation = "";
    textArr.forEach((el) => {
      translation = this.#convertTime(el, ".", ":");
      if (translation === "") {
        /*
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
        */
        if (translation === "") {
          Object.getOwnPropertyNames(americanToBritishSpelling).every(
            (prop) => {
              if (americanToBritishSpelling[prop] === el.toLowerCase()) {
                translation = prop;
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

    Object.getOwnPropertyNames(americanToBritishTitles).forEach((prop) => {
      let regex = new RegExp(americanToBritishTitles[prop], "ig");
      let val = prop;
      // capitalize first letter
      val = val.charAt(0).toUpperCase() + val.slice(1);
      if (highlight)
        transText = transText.replace(
          regex,
          '<span class="highlight">' + val + "</span>"
        );
      else transText = transText.replace(regex, val);
    });

    Object.getOwnPropertyNames(britishOnly).forEach((prop) => {
      let regex = new RegExp("\\b" + prop + "\\b", "ig");
      if (highlight)
        transText = transText.replace(
          regex,
          '<span class="highlight">' + britishOnly[prop] + "</span>"
        );
      else transText = transText.replace(regex, britishOnly[prop]);
    });

    return transText;
  }
}

module.exports = Translator;
