import axios from "axios";
import chalk from "chalk";
import fs from "fs";
import { getDetalhes, getListados } from "./fetch.js";
import { ensureJsonDirectoryExists, saveData } from "./file.js";

async function login(email, senha) {
  try {
    console.log(chalk.blue("Iniciando o login..."));

    const { data } = await axios.post(
      "https://farmacia-escola.com.br/v1/login",
      { email, senha }
    );

    const { token } = data;
    fs.writeFileSync("./token.txt", token);

    console.log(chalk.green("Login bem-sucedido e token salvo no arquivo!\n"));
  } catch (error) {
    console.error(chalk.red("Erro ao realizar o login:"), error.message);
  }
}

async function fetchData() {
  ensureJsonDirectoryExists();
  const token = fs.readFileSync("./token.txt", "utf-8").trim();

  const [materiasPrimasListadas, embalagensListadas, formulasListadas] =
    await Promise.all([
      getListados(
        `https://farmacia-escola.com.br/v1/materiasPrimas?estado=&medida=&termoDeBusca=`,
        token
      ),
      getListados(`https://farmacia-escola.com.br/v1/embalagens?nome=`, token),
      getListados(
        `https://farmacia-escola.com.br/v1/formulas?termoDeBusca=&termoDeBuscaMateriaPrima=`,
        token
      ),
    ]);

  const [materiasPrimasDetalhadas, embalagensDetalhadas, formulasDetalhadas] =
    await Promise.all([
      getDetalhes(
        "https://farmacia-escola.com.br/v1/materiasPrimas",
        token,
        materiasPrimasListadas
      ),
      getDetalhes(
        "https://farmacia-escola.com.br/v1/embalagens",
        token,
        embalagensListadas
      ),
      getDetalhes(
        "https://farmacia-escola.com.br/v1/formulas",
        token,
        formulasListadas
      ),
    ]);

  saveData(materiasPrimasDetalhadas, embalagensDetalhadas, formulasDetalhadas);
  console.log(chalk.green("Arquivos JSON salvos com sucesso!\n"));
}

if (process.argv[2] === "login") {
  const email = process.argv[3];
  const senha = process.argv[4];

  if (email && senha) {
    login(email, senha);
  } else {
    console.error(chalk.red("Por favor, forneça o email e a senha."));
  }
} else {
  fetchData();
}
