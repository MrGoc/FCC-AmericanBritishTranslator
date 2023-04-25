const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
  test("Translation with text and locale fields: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "Lunch is at 12:15 today.",
        locale: "american-to-british",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "Lunch is at 12:15 today.");
        assert.equal(
          res.body.translation,
          'Lunch is at <span class="highlight">12.15</span> today.'
        );
        done();
      });
  });
  test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "Lunch is at 12:15 today.",
        locale: "american-to-britis",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });
  test("Translation with missing text field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        locale: "american-to-british",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Translation with missing locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "Lunch is at 12:15 today.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Translation with empty text: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "",
        locale: "american-to-british",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "No text to translate");
        done();
      });
  });
  test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .type("form")
      .send({
        text: "It is good.",
        locale: "american-to-british",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "It is good.");
        assert.equal(res.body.translation, "Everything looks good to me!");
        done();
      });
  });
});
