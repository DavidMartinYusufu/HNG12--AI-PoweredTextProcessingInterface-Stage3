import React, { useState } from "react";
import send from "../assets/message.png";
import "./Home.css";

const Home = () => {
  const [text, setText] = useState("");
  const [dispayOutput, setDisplayOutput] = useState("");
  const [langType, setLangType] = useState("");
  const [translated, setTranslated] = useState("");

  async function langDetectorTriger(display) {
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
    // const someUserText = "Hallo und herzlich willkommen!";
    const results = await detector.detect(display);
    const firstObj = results[0];

    console.log(firstObj.detectedLanguage);
    setLangType(firstObj.detectedLanguage);
  }

  langDetectorTriger(dispayOutput);

  // async function translate() {
  //   try {
  //     if (!("ai" in self) || !("translator" in self.ai)) {
  //       console.error("Translator API is not supported in this browser.");
  //       return;
  //     }

  //     if ("ai" in self && "translator" in self.ai) {
  //       // The Translator API is supported.
  //       const translator = await self.ai.translator.create({
  //         sourceLanguage: "en",
  //         targetLanguage: "pl",
  //       });
  //     }

  //     let translation = await translator.translate("bonjour");
  //     console.log(translation);
  //   } catch (error) {
  //     console.error("Translation failed:", error);
  //   }
  // }

  // translate();

  async function tranlation() {
    if ("ai" in self && "translator" in self.ai) {
      // The Translator API is supported.
      console.log("sorpported");
      try {
        const translatorCapabilities = await self.ai.translator.capabilities();
        let availTranslateLanguage =
          translatorCapabilities.languagePairAvailable("en", "fr");
        console.log(availTranslateLanguage);

        let translator;

        if (availTranslateLanguage == "readily") {
          // Create a translator that translates from English to French.
          translator = await self.ai.translator.create({
            sourceLanguage: "en",
            targetLanguage: "fr",
          });

          let check = await translator.translate(
            "Where is the next bus stop, please?"
          );
          console.log(check);
          setTranslated(check);
        } else if (availTranslateLanguage == "no") {
          console.log("lang not avialable");
        } else if (availTranslateLanguage == "after-download") {
          translator = await self.ai.translator.create({
            sourceLanguage: "en",
            targetLanguage: "fr",
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
        // throw error;
      }
    } else {
      console.log("not sopported");
    }
  }

  // tranlation()

  async function checkLanguageSupport() {
    try {
      const capabilities = await self.ai.translator.capabilities();
      const supportStatus = capabilities.languagePairAvailable("en", "fr");
      console.log("Support status:", supportStatus);
    } catch (error) {
      console.error("Error checking language support:", error);
    }
  }
  // checkLanguageSupport();

  function sendToOutput(e) {
    e.preventDefault();

    let output = text;
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
              <p className="lang-detector">Language : ""</p>
            ) : (
              <p className="lang-detector">Language : "{langType}"</p>
            )}
          </section>
          <div className="summary-box">lorem400 lore</div>

          <section className="second-section">
            <form
              action=""
              className="form-input-section"
              onSubmit={sendToOutput}
            >
              <div className="input-section">
                {/* <input type="text" /> */}
                <textarea
                  name=""
                  id=""
                  placeholder="Type here..."
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
            <section>
              <button>Summarize</button>
              <div>
                <button>Language option</button>
                <button onClick={tranlation}>Tranlate</button>
              </div>
            </section>
          </section>
        </section>
      </main>
    </>
  );
};

export default Home;
