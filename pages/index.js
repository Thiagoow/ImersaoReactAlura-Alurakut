import React from "react";
/* Ao invés de definir a estilização via Next nesse componente, igual
todos os outros importados aqui, esse é o componente Master/Pai de todos,
o qual não contém estilização própria, apenas a que já está definida nos outros
componentes, aqui importados 😉😁: 

Ou seja, trazendo isso pro Atomic Design, esse seria uma
*/
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propsGitHub) {
  /* Usando o próprio GitHub como API, podemos
  receber e exibir algumas props públicas do user!
  Que podem ser vistas pelo console do browser, com o comando:

  console.log(propsGitHub);*/
  return (
    /* Muda a tag da box de div pra "aside", lá embaixo no return: */
    <Box as="aside">
      {/* Como por exemplo, a foto do usuário, a partir do @ dele: */}
      <img
        src={`https://github.com/${propsGitHub.userGitHub}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />

      <a
        className="boxLink"
        href={`https://github.com/${propsGitHub.userGitHub}`}
      >
        {propsGitHub.userGitHub}
      </a>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
    /* Você pode ver os dados públicos dos seus seguidores 
    por exemplo, na API do GitHub, utilizando a URL:
      https://api.github.com/users/seunomedeusuário/followers */
  );
}

/* Componente ProfileRelations: */
function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {/* Mostra a quantidade de items na array: */}
        {props.title} ({props.items.length}):
      </h2>

      {/*  */}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  /* Essa é a var que representa você 😁 =
  O user da rede social Alurakut. Sendo o seu nome,
  o mesmo nome do seu usuário do GitHub, pois assim,
  pesquisamos seu nome na API do GitHub, e exibimos
  a foto definida no seu perfil do GitHub! :D */
  const user = "Thiagoow";

  /* Essa é a array com os outros usuários exibidos
  na sua comunidade ;D Podendo ser eles, seus seguidores,
  amigos, etc: */
  const outrosUsers = [
    /* Lembre-se: o nome do usuário, é o que
    será pesquisado na API do GitHub para listar
    a foto :D. Sendo assim, digite o nome de um user
    existente do GitHub: */
    "bedimcode",
    "origamid",
    "cataline4learning",
    "maykbrito",
    "diego3g",
    "yungsilva"
  ];

  /* Cria a var de seguidores, com o estado inicial já sendo uma array vazia,
  e a var pra alterar o estado da array de comunidades: */
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    //Pega os dados dos seguidores do usuário
    fetch(`https://api.github.com/users/${user}/followers`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguidores(respostaJSON);
      });
  }, []);

  /* Cria a var de comunidades, com o estado inicial já sendo o objeto de uma comunidade,
  e a var pra alterar o estado da array de comunidades: */
  const [comunidades, setComunidades] = React.useState([
    {
      id: "12802378123789378912789789123896123",
      title: "Eu odeio acordar cedo",
      image: "https://alurakut.vercel.app/capa-comunidade-01.jpg"
    }
  ]);

  /* Pega a array de dados do GitHub: */
  React.useEffect(function () {
    //API GraphQL, no Dato CMS:
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "f498efcb034b6dd6f8a6ac46cdae8e",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      /* Retorna no JSON, as infos: */
      body: JSON.stringify({
        query: `query {
        allComunidades {
          id 
          title
          imageurl
          creatorSlug
        }
      }`
      })
    })
      .then((serverResponse) => serverResponse.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        /* Retorna a resposta do servidor
        já transformada em JSON: */
        console.log(respostaCompleta);
      });
  }, []);

  return (
    <>
      {/* Importa o Header/Menu existente lá em "src\lib\AlurakutCommons.js": */}
      <AlurakutMenu />
      <MainGrid>
        {/* Todos esses classNames já estavam prontos, e foram definidos
        pela alura nos componentes da pasta "../src" */}
        {/* Coluna 1 - Área do perfil: */}
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar userGitHub={user} />
        </div>
        {/* Coluna 2 - Coluna central com infos do perfil e mensagem de "boas vindas, usuário!": */}
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a) {user}</h1>
            {/* Componente tbm já existente lá em "src\lib\AlurakutCommons.js": */}
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form>
              <div
                onSubmit={function criaComunidade(event) {
                  /* Previne o refresh da página, E nesse caso, como
                  estamos sem SSR: a falha no salvamento da comunidade: */
                  event.preventDefault();

                  /* Retorna os dados do form na var "dadosForm" */
                  const dadosForm = new FormData(event.target);

                  console.log("Campo: ", dadosDoForm.get("title"));
                  console.log("Campo: ", dadosDoForm.get("image"));

                  /* Armazena num objeto, os dados digitados no
                  formulário: */
                  const newComunidade = {
                    id: new Date().toISOString(),
                    title: dadosForm.get("title"),
                    image: dadosForm.get("image")
                  };
                  /* Usando o operador spread (...), 
                  envia o novo item pra array de comunidades: */
                  const comunidadesAtualizadas = [
                    ...comunidades,
                    newComunidade
                  ];
                  /* Altera o estado da array, 
                  inserindo um novo item, como se fosse o: 
                    comunidades.push("item"); */
                  setComunidades(comunidadesAtualizadas);
                }}
              >
                <input
                  placeholder="📝 Qual o nome da sua comunidade?"
                  type="text"
                  name="title"
                  aria-label="📝 Qual o nome da sua comunidade?"
                />
              </div>

              <div>
                <input
                  placeholder="🖼️ Qual a URL de imagem da capa da sua comunidade?"
                  type="text"
                  name="title"
                  aria-label="🖼️ Qual a URL de imagem da capa da sua comunidade?"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          {/* Seção de seguidores: */}
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          {/* Seção das comunidades: */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              {/* Mostra a quantidade de items na array: */}
              Comunidades ({comunidades.length}):
            </h2>
            <ul>
              {/* Lista cada item da Array de "comunidades:": */}
              {comunidades.map((comunidade) => {
                return (
                  /*  Mostra a imagem de cada item da Array de users: */
                  <li key={comunidade.id}>
                    <a href={`/users/${comunidade.title}`} key={comunidade.id}>
                      <img src={comunidade.image} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          {/* Seção de outros usuários: */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              {/* Mostra a quantidade de items na array: */}
              Pessoas que você segue ({outrosUsers.length}):
            </h2>

            {/* Lista de outros usuários: */}
            <ul>
              {/* Lista cada item da Array de "outrosUsers": */}
              {outrosUsers.map((itemArray) => {
                return (
                  /*  Mostra a imagem de cada item da Array de users: */
                  <li key={itemArray}>
                    <a href={`/users/${itemArray}`}>
                      <img src={`https://github.com/${itemArray}.png`} />
                      <span>{itemArray}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
