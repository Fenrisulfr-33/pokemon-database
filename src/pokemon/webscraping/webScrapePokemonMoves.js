import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import cheerio from "cheerio";
import readJson from "../../genericFunctions/files/readJson.js";
import { gamesToScrape } from './gamesToScrape.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pokemonNames = readJson("./pokemonDatabaseURLNames.json", import.meta.url);

const REQUEST_DELAY_MS = 1000;
const RETRY_DELAY_MS = 15000;
const MAX_RETRIES = 3;
const retriesByIndex = {};

const main = (games) => {
  games.forEach((game) => {
    const errors = {};
    const pokemonMoves = [];
    scrapePokemonMoves(game.tabName, game.gameName, game.generation, game.startingPoint, errors, pokemonMoves, game.pokedexLength);
  })
}

const scrapePokemonMoves = async (
  tab,
  gameName,
  generation,
  i,
  errors,
  pokemonMovesJSON,
  pokedexLength
) => {
  // 
  if (i > pokedexLength - 1) {
    console.log("Errors", errors);
    const saveData = JSON.stringify(pokemonMovesJSON, null, 2);
    fs.writeFile(path.join(__dirname, `${gameName}-moves.json`), saveData, (error) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("JSON data is saved.");
    });
  } else {
    let returnMovesObject = {};
    const pokemon = pokemonNames[i];
    let hasMoves = true;

    axios(`https://pokemondb.net/pokedex/${pokemon}/moves/${generation}`)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const moves = $(tab).find("h3");

        if (moves.length > 0) {
          moves.each((index, element) => {
            const moveType = $(element).text();

            const firstTab = $(element)
              .next()
              .next()
              .children("div")
              .next()
              .children("div")
              .children("div")
              .children("table:first")
              .children("tbody")
              .children("tr");

            const moves = $(element)
              .next()
              .next()
              .children("table")
              .children("tbody")
              .children("tr");

            if (moveType === "Moves learnt by level up") {
              returnMovesObject["level-up"] = [];
              // If the pokemon does not have data do not save the arrays
              const hasMovesCheck = $(element).next();
              if (hasMovesCheck.text().includes("does not")) {
                hasMoves = false;
              }
              if (getTabCheck($, element)) {
                returnMovesObject = getData(
                  $,
                  firstTab,
                  "lvl",
                  returnMovesObject
                );
              } else {
                returnMovesObject = getData($, moves, "lvl", returnMovesObject);
              }
            } else if (moveType === "Move Tutor moves") {
              if (
                tab === "#tab-moves-17" &&
                (pokemon === "pikachu" || pokemon === "eevee")
              ) {
                if (pokemon === "pikachu") {
                  returnMovesObject["tutor"] = [
                    "Floaty Fall",
                    "Splishy Splash",
                    "Zippy Zap",
                  ];
                } else {
                  returnMovesObject["tutor"] = [
                    "Baddy Bad",
                    "Bouncy Bubble",
                    "Buzzy Buzz",
                    "Freezy Frost",
                    "Glitzy Glow",
                    "Sappy Seed",
                    "Sizzly Slide",
                    "Sparkly Swirl",
                  ];
                }
              } else {
                returnMovesObject["tutor"] = [];
                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "basic",
                    returnMovesObject,
                    "tutor"
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "basic",
                    returnMovesObject,
                    "tutor"
                  );
                }
              }
            } else if (moveType === "Moves learnt on evolution") {
              returnMovesObject["evolution"] = [];
              if (getTabCheck($, element)) {
                returnMovesObject = getData(
                  $,
                  firstTab,
                  "basic",
                  returnMovesObject,
                  "evolution"
                );
              } else {
                returnMovesObject = getData(
                  $,
                  moves,
                  "basic",
                  returnMovesObject,
                  "evolution"
                );
              }
            } else if (moveType === "Egg moves") {
              const canLearnEggsCheck = $(element).next();
              if (canLearnEggsCheck.text().includes("does not")) {
                null;
              } else {
                returnMovesObject["egg"] = [];

                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "basic",
                    returnMovesObject,
                    "egg"
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "basic",
                    returnMovesObject,
                    "egg"
                  );
                }
              }
            } else if (moveType === "Moves learnt by TM") {
              const canLearnTmsCheck = $(element).next();
              if (canLearnTmsCheck.text().includes("cannot")) {
                null;
              } else {
                returnMovesObject["technical-machine"] = [];
                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "tm",
                    returnMovesObject
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "tm",
                    returnMovesObject
                  );
                }
              }
            } else if (moveType === "Moves learnt by HM") {
              const canLearnTmsCheck = $(element).next();
              if (canLearnTmsCheck.text().includes("does not")) {
                null;
              } else {
                returnMovesObject["hidden-machine"] = [];
                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "hm",
                    returnMovesObject
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "hm",
                    returnMovesObject
                  );
                }
              }
            } else if (moveType === "Moves learnt by TR") {
              const canLearnRecordsCheck = $(element).next();
              if (canLearnRecordsCheck.text().includes("cannot")) {
                null;
              } else {
                returnMovesObject["technical-record"] = [];
                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "record",
                    returnMovesObject
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "record",
                    returnMovesObject
                  );
                }
              }
            } else if (moveType === "Special moves") {
              // Let's Go Pikachu & Eevee
              if (
                tab === "#tab-moves-17" &&
                (pokemon === "pikachu" || pokemon === "eevee")
              ) {
                if (pokemon === "pikachu") {
                  returnMovesObject["special-moves"] = ["Pika Papow"];
                } else {
                  returnMovesObject["special-moves"] = ["Veevee Volley"];
                }
              } else {
                returnMovesObject["special"] = [];

                if (getTabCheck($, element)) {
                  returnMovesObject = getData(
                    $,
                    firstTab,
                    "method",
                    returnMovesObject,
                    "special"
                  );
                } else {
                  returnMovesObject = getData(
                    $,
                    moves,
                    "method",
                    returnMovesObject,
                    "special"
                  );
                }
              }
            } else if (moveType === "Pre-evolution moves") {
              returnMovesObject["pre-evolution"] = [];
              if (getTabCheck($, element)) {
                returnMovesObject = getData(
                  $,
                  firstTab,
                  "method",
                  returnMovesObject,
                  "pre-evolution"
                );
              } else {
                returnMovesObject = getData(
                  $,
                  moves,
                  "method",
                  returnMovesObject,
                  "pre-evolution"
                );
              }
            } else if (moveType === "Transfer-only moves") {
              returnMovesObject["transfer-only"] = [];
              if (getTabCheck($, element)) {
                returnMovesObject = getData(
                  $,
                  firstTab,
                  "method",
                  returnMovesObject,
                  "transfer-only"
                );
              } else {
                returnMovesObject = getData(
                  $,
                  moves,
                  "method",
                  returnMovesObject,
                  "transfer-only"
                );
              }
            } else if (moveType === "Moves learnt by reminder") {
              returnMovesObject["reminder"] = [];
              if (getTabCheck($, element)) {
                returnMovesObject = getData(
                  $,
                  firstTab,
                  "basic",
                  returnMovesObject,
                  "reminder"
                );
              } else {
                returnMovesObject = getData(
                  $,
                  moves,
                  "basic",
                  returnMovesObject,
                  "reminder"
                );
              }
            } else {
              errors[moveType] = "Move type not found.";
            }
          });
        }

        if (hasMoves) {
          pokemonMovesJSON.push({
            id: i + 1,
            name: pokemon,
            [gameName]: returnMovesObject,
          });
          // Pretty conosole.logs
          const pokemonNatDexNo = i + 1;
          if (pokemonNatDexNo.toString().length === 1) {
            console.log(`---Done: ${pokemonNatDexNo} ---- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 2) {
            console.log(`---Done: ${pokemonNatDexNo} --- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 3) {
            console.log(`---Done: ${pokemonNatDexNo} -- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 4) {
            console.log(`---Done: ${pokemonNatDexNo} - ${pokemon}`);
          }
        } else {
          const pokemonNatDexNo = i + 1;
          if (pokemonNatDexNo.toString().length === 1) {
            console.log(`Skipped: ${pokemonNatDexNo} ---- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 2) {
            console.log(`Skipped: ${pokemonNatDexNo} --- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 3) {
            console.log(`Skipped: ${pokemonNatDexNo} -- ${pokemon}`);
          } else if (pokemonNatDexNo.toString().length === 4) {
            console.log(`Skipped: ${pokemonNatDexNo} - ${pokemon}`);
          }
        }

        i++;
        setTimeout(() => scrapePokemonMoves(
          tab,
          gameName,
          generation,
          i,
          errors,
          pokemonMovesJSON,
          pokedexLength
        ), REQUEST_DELAY_MS);
      })
      .catch((error) => {
        const status = error.response?.status;
        console.log(`Error: ${i + 1} ${pokemon} - ${status ?? error.message}`);
        retriesByIndex[i] = (retriesByIndex[i] ?? 0) + 1;
        if (status !== 404 && retriesByIndex[i] <= MAX_RETRIES) {
          console.log(`Retry ${retriesByIndex[i]}/${MAX_RETRIES} in 15s`);
          setTimeout(() => scrapePokemonMoves(
            tab,
            gameName,
            generation,
            i,
            errors,
            pokemonMovesJSON,
            pokedexLength
          ), RETRY_DELAY_MS);
          return;
        }
        errors[`${i + 1}-${pokemon}`] = `Failed: ${status ?? error.message}`;
        const pokemonNatDexNo = i + 1;
        if (pokemonNatDexNo.toString().length === 1) {
          console.log(
            `-------- ${pokemonNatDexNo} ---- ${pokemon} - Does not have page data.`
          );
        } else if (pokemonNatDexNo.toString().length === 2) {
          console.log(
            `-------- ${pokemonNatDexNo} --- ${pokemon} - Does not have page data.`
          );
        } else if (pokemonNatDexNo.toString().length === 3) {
          console.log(
            `-------- ${pokemonNatDexNo} -- ${pokemon} - Does not have page data.`
          );
        } else if (pokemonNatDexNo.toString().length === 4) {
          console.log(
            `-------- ${pokemonNatDexNo} - ${pokemon} - Does not have page data.`
          );
        }
        i++;
        setTimeout(() => scrapePokemonMoves(
          tab,
          gameName,
          generation,
          i,
          errors,
          pokemonMovesJSON,
          pokedexLength
        ), REQUEST_DELAY_MS);
      });
  }
};

const getTabCheck = ($, element) => {
  const tabCheck = $(element)
    .next()
    .next()
    .children("table")
    .children("tbody")
    .children("tr").length;
  const returnBoolean = tabCheck === 0 ? true : false;
  // console.log('isTabs ? ', returnBoolean);
  return returnBoolean;
};

const getData = ($, list, tableType, returnObj, objKey) => {
  list.each((index, element) => {
    const rowData = $(element).children("td");

    if (tableType === "lvl") {
      const lvlUpMove = {};
      rowData.each((index, element) => {
        if (index === 0) {
          lvlUpMove.lvl = $(element).text();
        } else if (index === 1) {
          lvlUpMove.name = $(element).text();
        }
      });
      returnObj["level-up"].push(lvlUpMove);
    } else if (tableType === "tm") {
      const tmMove = {};
      rowData.each((index, element) => {
        if (index === 0) {
          tmMove.tm = parseInt($(element).text());
        } else if (index === 1) {
          tmMove.name = $(element).text();
        }
      });
      returnObj["technical-machine"].push(tmMove);
    } else if (tableType === "hm") {
      const hmMove = {};
      rowData.each((index, element) => {
        if (index === 0) {
          hmMove.hm = parseInt($(element).text());
        } else if (index === 1) {
          hmMove.name = $(element).text();
        }
      });
      returnObj["hidden-machine"].push(hmMove);
    } else if (tableType === "record") {
      const trMove = {};
      rowData.each((index, element) => {
        if (index === 0) {
          trMove.tr = parseInt($(element).text());
        } else if (index === 1) {
          trMove.name = $(element).text();
        }
      });
      returnObj["technical-record"].push(trMove);
    } else if (tableType === "method") {
      const methodMove = {};
      rowData.each((index, element) => {
        if (index === 0) {
          methodMove.name = $(element).text();
        } else if (index === 5) {
          methodMove.method = $(element).text();
        }
      });
      returnObj[objKey].push(methodMove);
    } else if (tableType === "basic") {
      rowData.each((index, element) => {
        if (index === 0) {
          returnObj[objKey].push($(element).text());
        }
      });
    }
  });
  return returnObj;
};

main(gamesToScrape);
// scrapePokemonMoves('#tab-moves-21', 'scarlet-violet', 9, 0, {}, [], 1025);