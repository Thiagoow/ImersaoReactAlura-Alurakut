import { SiteClient } from "datocms-client";

export default async function recebeRequests(request, response) {
  if (request.method === "POST") {
    const FullAccessTOKEN = "344e97547b97c9a45954a9aa3970b8";
    const client = new SiteClient(FullAccessTOKEN);

    /* Cria uma nova comunidade, e armazena na var: */
    const registroCriado = await client.items.create({
      /* Cria um item do tipo comunidade,
      pois o id passado aqui, é do modelo
      Comunidade, no Dato CMS: */
      itemType: "990209",
      ...request.body
    });

    response.json({
      dados: "Algum dado qualquer",
      /* Retorna o novo item/registro criado acima:  */
      registroCriado: registroCriado
    });
    /* Caso o POST dê certo, termina o código aqui,
    e não mostra a mensagem de erro abaixo: */
    return;
  }

  /* Se der erro: */
  response.status(404).json({
    message: "Ainda não tem nada no GET, mas no POST sim :D"
  });
}
