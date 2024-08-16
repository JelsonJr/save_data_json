import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function saveData(materiasPrimas, embalagens, formulas) {
  fs.writeFileSync(
    "./json/materias-primas.json",
    JSON.stringify(materiasPrimas)
  );
  fs.writeFileSync("./json/embalagens.json", JSON.stringify(embalagens));
  fs.writeFileSync("./json/formulas.json", JSON.stringify(formulas));
}

export function ensureJsonDirectoryExists() {
  const jsonDir = path.join(__dirname, "json");

  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir);
  }
}
