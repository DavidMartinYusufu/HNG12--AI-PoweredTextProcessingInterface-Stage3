import React, { useState } from "react";
import send from "../assets/message.png";
import "./Home.css";

const Home = () => {
  const [text, setText] = useState("");
  const [dispayOutput, setDisplayOutput] = useState("");
  const [langType, setLangType] = useState("");
  const [translated, setTranslated] = useState("");
  const [selectLang, setSelectLang] = useState("");
  const [summ, setSumm] = useState("");
  const [outputNum, setOutputNum] = useState();

  async function langDetectorTriger(display) {
    try {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;
      let detector;
      if (canDetect === "no") {
        // The language detector isn't usable.
        return;
      }
      if (canDetect === "readily") {
        // The language detector can immediately be used.
        detector = await self.ai.languageDetector.create();
        console.log(detector);
      } else {
        // The language detector can be used after model download.
        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }

      console.log(display);
      const results = await detector.detect(display);
      const firstObj = results[0];

      console.log(firstObj.detectedLanguage);
      setLangType(firstObj.detectedLanguage);
    } catch (error) {
      console.log(error);
    }
  }

  langDetectorTriger(dispayOutput);

  function numberOfLetters(output) {
    let numLetters = `hello nad: ${
      output.split("").filter((char) => char !== " ").length
    }`;
    setOutputNum(numLetters);
    console.log(outputNum);
  }

  // numberOfLetters(dispayOutput)

  async function summary() {
    if ("ai" in self && "summarizer" in self.ai) {
      // The Summarizer API is supported.
      try {
        const options = {
          sharedContext: "This is a scientific article",
          type: "key-points",
          format: "markdown",
          length: "medium",
        };

        const available = (await self.ai.summarizer.capabilities()).available;
        let summarizer;
        if (available === "no") {
          // The Summarizer API isn't usable.
          alert("summarizer not available");

          const summarizer = await ai.summarizer.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
          return;
        }
        if (available === "readily") {
          // The Summarizer API can be used immediately .
          summarizer = await self.ai.summarizer.create(options);
          const summary = await summarizer.summarize(dispayOutput, {
            context: "This content is intended to be a short summary.",
          });

          setSumm(summary);
        } else {
          // The Summarizer API can be used after the model is downloaded.
          summarizer = await self.ai.summarizer.create(options);
          summarizer.addEventListener("downloadprogress", (e) => {
            console.log(e.loaded, e.total);
          });
          await summarizer.ready;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function tranlation() {
    if ("ai" in self && "translator" in self.ai) {
      // The Translator API is supported.
      console.log("sorpported");
      try {
        const translatorCapabilities = await self.ai.translator.capabilities();
        let availTranslateLanguage =
          translatorCapabilities.languagePairAvailable(
            `${langType}`,
            `${selectLang}`
          );
        console.log(availTranslateLanguage);
        console.log(langType, selectLang);

        let translator;

        if (availTranslateLanguage == "readily") {
          // Create a translator that translates from English to French.
          translator = await self.ai.translator.create({
            sourceLanguage: `${langType}`,
            targetLanguage: `${selectLang}`,
          });

          let check = await translator.translate(dispayOutput);
          console.log(check);
          setTranslated(check);
        } else if (availTranslateLanguage == "no") {
          alert("Language translation not avialable, choose another language");
        } else if (availTranslateLanguage == "after-download") {
          translator = await self.ai.translator.create({
            sourceLanguage: `en`,
            targetLanguage: `es`,
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
        }
        console.log(translator);
        return await translator.translate("here is the ball");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("not sopported");
      alert("AI not sopported in this browser");
    }
  }

  async function checkLanguageSupport() {
    try {
      const capabilities = await self.ai.translator.capabilities();
      const supportStatus = capabilities.languagePairAvailable("en", "fr");
      console.log("Support status:", supportStatus);
    } catch (error) {
      console.error("Error checking language support:", error);
    }
  }

  function sendToOutput(e) {
    e.preventDefault();

    let output = text;

    if (output == "" || null) {
      return;
    }

    setDisplayOutput(output);
    setText("");

    langDetectorTriger(dispayOutput);
  }

  return (
    <>
      <main>
        <h1>EchoBot</h1>
        <section>
          <section>
            <div className="output-section">
              <div className="output-box">{dispayOutput}</div>
            </div>

            {langType == "und" ? (
              <p className="lang-detector">Language : </p>
            ) : (
              <p className="lang-detector">Language : {langType}</p>
            )}
          </section>

          <div className="summary-box">{translated}</div>

          <div className="summary-box">{summ}</div>

          <section className="second-section">
            <form
              action=""
              className="form-input-section"
              onSubmit={sendToOutput}
            >
              <div className="input-section">
                <textarea
                  name=""
                  id=""
                  placeholder="Type here..."
                  required
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                ></textarea>
                <button className="send-btn" type="submit">
                  Send <img src={send} alt="" />
                </button>
              </div>
            </form>
            <section className="language-section">
              <div className="language-ctn">
                <label>
                  Select language :{" "}
                  <select
                    name="selectlanguage"
                    id=""
                    value={selectLang}
                    className="select"
                    onChange={(e) => setSelectLang(e.target.value)}
                  >
                    <option value="the select btn">select</option>
                    <option value="en">English</option>
                    <option value="pt">Portuguese</option>
                    <option value="es">Spanish </option>
                    <option value="ru">Russian</option>
                    <option value="tr">Turkish</option>
                    <option value="fr ">French </option>
                  </select>
                </label>

                <button className="translate-btn" onClick={tranlation}>
                  Translate
                </button>

                {/* <button className="translate-btn" onClick={summary}>
                  summary
                </button> */}
              </div>
            </section>
          </section>
        </section>
      </main>
    </>
  );
};

export default Home;
