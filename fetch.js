import axios from "axios";
import chalk from "chalk";

export async function getListados(url, token) {
  try {
    console.log(chalk.blue(`Buscando dados de ${url}...`));

    let totalElements = 0;
    let size = 20;
    let page = 0;

    const items = [];

    do {
      console.log(chalk.blue(`Buscando página ${page}...`));

      const { data } = await axios.get(`${url}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      totalElements = data.totalElements;
      size = data.size;

      items.push(...data.content);

      page++;
    } while (page * size < totalElements);

    console.log(chalk.green("Busca concluída com sucesso! \n"));
    return items;
  } catch (error) {
    console.error(chalk.red(`Erro ao buscar dados de ${url}:`), error.message);
  }
}

export async function getDetalhes(urlBase, token, itensListados) {
  const itensDetalhados = [];

  for (const item of itensListados) {
    console.log(chalk.blue(`Buscando detalhes de ${item.nome}...`));

    const { data } = await axios.get(`${urlBase}/${item.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(chalk.blue(`${item.nome} adicionado com sucesso!\n`));

    itensDetalhados.push(data);
  }

  console.log(chalk.green("Sucesso ao buscar detalhes dos itens!\n"));

  return itensDetalhados;
}
