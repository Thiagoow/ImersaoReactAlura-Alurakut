import React from "react";
import Link from "next/link";
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
import InfoBox from "../src/components/InfoBox";
/* Importando a biblioteca de Cookies para o SSR de página: */
import nookies from "nookies";
/* Importando a biblioteca pra decodificar 
as infos do token, que está dentro do cookie: */
import jwt from "jsonwebtoken";
import { checkUserAuth } from "../src/hooks/checkUserAuth";

//Componente principal DENTRO desse componente Master:
export default function Home(props) {
  const [formOption, setFormOption] = React.useState(0);

  const [recadoTxt, setRecadoTxt] = React.useState("");

  /* Essa é a var que representa você 😁 =
  O user da rede social Alurakut. Sendo o seu nome,
  o mesmo nome do seu usuário do GitHub, pois assim,
  pesquisamos seu nome na API do GitHub, e exibimos
  a foto definida no seu perfil do GitHub! :D */
  const user = props.githubUser; /* Definido lá embaixo
  nesse arquivo, utilizando o SSR */

  /* Pega a bio do User no GitHub: */
  const [userInfo, setUserInfo] = React.useState({});
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${user}`)
      .then((res) => res.json())
      .then((data) =>
        setUserInfo({
          name: data.name,
          bio: data.bio,
          location: data.location,
          createdAt: data.created_at
        })
      )
      .catch((error) => console.error(error));
  }, []);

  /* Essa é a array com os outros usuários exibidos
  na sua comunidade ;D Podendo ser eles, seus seguidores,
  amigos, etc: */
  const [seguindo, setSeguindo] = React.useState([]);
  /* Pega as pessoas que você segue no GitHub*/
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${user}/following`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguindo(respostaJSON);
      });
  }, []);
  //Var pra mostrar mais ou menos "seguindo":
  const [isShowingMoreSeguindo, setIsShowingMoreSeguindo] =
    React.useState(false);

  /* Cria a var de seguidores, com o estado inicial já sendo uma array vazia,
  e a var pra alterar o estado da array de seguidores: */
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
  //Var pra mostrar mais ou menos "seguidores":
  const [isShowingMoreSeguidores, setIsShowingMoreSeguidores] =
    React.useState(false);

  /* Cria a var de comunidades, com o estado inicial sendo uma array vazia,
  e a var pra alterar o estado da array de comunidades: */
  const [comunidades, setComunidades] = React.useState([]);

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
        const comunidadesDatoCMS = respostaCompleta.data.allComunidades;
        /* console.log(comunidadesDatoCMS); */
        setComunidades(comunidadesDatoCMS);
      });
  }, []);
  //Var pra mostrar mais ou menos "comunidades":
  const [isShowingMoreComunidades, setIsShowingMoreComunidades] =
    React.useState(false);

  /* Função que dá o toggle 
  nas vars pra mostrar mais ou não: */
  function toggleShowMoreSeguidores(e) {
    e.preventDefault();
    setIsShowingMoreSeguidores(!isShowingMoreSeguidores);
  }
  function toggleShowMoreSeguindo(e) {
    e.preventDefault();
    setIsShowingMoreSeguindo(!isShowingMoreSeguindo);
  }
  function toggleShowMoreComunidades(e) {
    e.preventDefault();
    setIsShowingMoreComunidades(!isShowingMoreComunidades);
  }

  //Função de criar comunidades:
  function criaComunidade(event) {
    /* Previne o refresh da página, E nesse caso, como
    estamos sem SSR: a falha no salvamento da comunidade: */
    event.preventDefault();

    /* Retorna os dados do form na var "dadosForm" */
    const dadosForm = new FormData(event.target);

    console.log("Nome Comunidade: ", dadosForm.get("title"));
    console.log("URL da imagem: ", dadosForm.get("image"));

    /* Armazena num objeto, os dados digitados no
    formulário: */
    const newComunidade = {
      title: dadosForm.get("title"),
      imageurl: dadosForm.get("image"),
      creatorSlug: user
    };

    /* */
    fetch("/api/comunidades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newComunidade)
    }).then(async (response) => {
      const dados = await response.json();
      console.log(dados.registroCriado);
      const newComunidade = dados.registroCriado;
      /* Usando o operador spread (...), 
    envia o novo item pra array de comunidades: */
      const comunidadesAtualizadas = [...comunidades, newComunidade];
      /* Altera o estado da array, 
    inserindo um novo item, como se fosse o: 
      comunidades.push("item"); */
      setComunidades(comunidadesAtualizadas);
    });
  }

  return (
    <>
      {/* Importa o Header/Menu existente lá em "src\lib\AlurakutCommons.js": */}
      <AlurakutMenu githubUser={user} />{" "}
      {/* Define a foto e nome do
      usuário no menu hambúrguer */}
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <Box as="aside">
            <img
              src={`https://github.com/${user}.png`}
              style={{ borderRadius: "8px" }}
            />

            <hr />

            <p>
              <a
                className="boxLink"
                href={`https://github.com/${user}`}
                target="_blank"
              >
                @{user}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault githubUser={user} />
          </Box>
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title subPageTitle">
              Bem-vindo(a), {userInfo.name === null ? user : userInfo.name}
            </h1>
            <p className="bio">{userInfo.bio}</p>

            <OrkutNostalgicIconSet confiável={3} legal={3} sexy={3} />

            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnCenter">Região:</td>
                  <td>{userInfo.location}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Membro desde:</td>
                  <td>{new Date(userInfo.createdAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </InfoBox>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <div className="optionButtons">
              <button onClick={() => setFormOption(0)}>Criar comunidade</button>
              <button onClick={() => setFormOption(1)}>Deixar um recado</button>
            </div>

            <br />

            {formOption === 0 ? (
              <form onSubmit={(event) => criaComunidade(event)}>
                <div>
                  <input
                    placeholder="📝 Qual o nome da sua comunidade?"
                    type="text"
                    name="title"
                    aria-label="📝 Qual o nome da sua comunidade?"
                    value={comunidades.title}
                  />
                </div>

                <div>
                  <input
                    placeholder="🖼️ Qual a URL de imagem da capa da sua comunidade?"
                    name="image"
                    aria-label="🖼️ Qual a URL de imagem da capa da sua comunidade?"
                    value={comunidades.imageurl}
                  />
                </div>

                <button>Criar comunidade</button>
              </form>
            ) : (
              <form onSubmit={(event) => criaRecado(event)}>
                <div>
                  <textarea
                    placeholder="✏ Digite seu recado aqui 😁"
                    value={recadoTxt}
                    onChange={(e) => setRecadoTxt(e.target.value)}
                    aria-label="✏ Digite seu recado aqui 😁"
                    type="text"
                    autoComplete="off"
                    // required
                  />
                </div>

                <button type="submit">Enviar</button>
              </form>
            )}
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          {/* Seção de seguidores: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguidores}
          >
            <h2 className="smallTitle">Seguidores ({seguidores.length}):</h2>
            <ul>
              {seguidores.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/profile/${item.login}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.login}.png`} />
                        <span>{item.login}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {seguidores.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreSeguidores(e)}
                >
                  {isShowingMoreSeguidores ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>

          {/* Seção de comunidades: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreComunidades}
          >
            <h2 className="smallTitle">Comunidades ({comunidades.length}):</h2>

            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/comunidades/${item.id}`} passHref>
                      <a>
                        <img src={item.imageurl} />
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {comunidades.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreComunidades(e)}
                >
                  {isShowingMoreComunidades ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
          {comunidades.length < 1 && (
            <Box style={{ backgroundColor: "#fcfdde" }}>
              <div>
                <p>
                  <b>Dica:</b> Para participar de uma comunidade acesse a página
                  de comunidades clicando em "Comunidades" na parte superior da
                  página.
                </p>
              </div>
            </Box>
          )}

          {/* Seção de seguindo: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguindo}
          >
            <h2 className="smallTitle">Você segue ({seguindo.length}):</h2>
            <ul>
              {seguindo.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/profile/${item.login}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.login}.png`} />
                        <span>{item.login}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {seguindo.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreSeguindo(e)}
                >
                  {isShowingMoreSeguindo ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
/*A partir daqui, parte do SSR -> Server Side Rendering 
= Não é exibe no navegador,e muitas vezes nem no console, 
apenas no terminal onde seu projeta está sendo compilado*/

/* Só deixa o usuário acessar essa página Home, SE ele
estiver autenticado, com um usuário existente do GitHub: */
export async function getServerSideProps(context) {
  /* Pega o githubUser digitado pelo usuário na 
  tela de login a partir do cookie de TOKEN: */
  const cookies = nookies.get(context);
  const userToken = cookies.USER_TOKEN;

  /* Verifica a autorização do usuário com o hook custom, 
  a partir do Token dele (Se ele existe ou não, no GitHub): */
  const isAuthenticated = await checkUserAuth(userToken);

  //Caso o usuário não esteja autenticado:
  if (!isAuthenticated) {
    return {
      //Manda ele pra página de login:
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  //Decodifica o token com a biblioteca jsonwebtoken:
  const { githubUser } = jwt.decode(userToken);
  //console.log("Token decodificado do Cookie:", token);

  /* Se o usuário estiver autenticado, 
  retorna ele como prop pro componente Home: */
  return {
    props: {
      githubUser
    } // Will be passed to the page component as props
  };
}
