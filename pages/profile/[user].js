import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
/* Ao invés de definir a estilização via Next nesse componente, igual
todos os outros importados aqui, esse é o componente Master/Pai de todos,
o qual não contém estilização própria, apenas a que já está definida nos outros
componentes, aqui importados 😉😁: */
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../../src/lib/AlurakutCommons";
import MainGrid from "../../src/components/MainGrid";
import Box from "../../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations";
import InfoBox from "../../src/components/InfoBox";
// Importando a biblioteca de Cookies para o SSR de página:
import nookies from "nookies";
//Importando o hook que checa se o user está ou não autenticado:
import { checkUserAuth } from "../../src/hooks/checkUserAuth";

export default function Profile() {
  const router = useRouter();
  const { user } = router.query;
  const githubUser = user;

  const [userInfo, setUserInfo] = React.useState({});
  const [isShowingMoreSeguidores, setIsShowingMoreSeguidores] =
    React.useState(false);
  const [isShowingMoreSeguindo, setIsShowingMoreSeguindo] =
    React.useState(false);

  const [seguidores, setSeguidores] = React.useState([]);
  const [seguindo, setSeguindo] = React.useState([]);

  function getGithubUserInfo() {
    fetch(`https://api.github.com/users/${githubUser}`)
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
  }

  function getGithubSeguidores() {
    fetch(`https://api.github.com/users/${user}/followers`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguidores(respostaJSON);
      });
  }

  function getGithubSeguindo() {
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguindo(respostaJSON);
      });
  }

  React.useEffect(() => {
    getGithubUserInfo();
    getGithubSeguidores();
    getGithubSeguindo();
  }, [githubUser]);

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

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <Box as="aside">
            <img
              src={`https://github.com/${githubUser}.png`}
              style={{ borderRadius: "8px" }}
            />

            <hr />
            <p>
              <a
                className="boxLink"
                href={`https://github.com/${githubUser}`}
                target="_blank"
              >
                @{githubUser}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault
              githubUser={githubUser}
              isFriendInfo
            />
          </Box>
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title subPageTitle">
              {userInfo.name === null ? githubUser : userInfo.name}
            </h1>
            <span className="bio">{userInfo.bio}</span>

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

          {/* Seção de seguindo: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguindo}
          >
            <h2 className="smallTitle">Seguindo ({seguindo.length}):</h2>
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

  /* Se o usuário estiver autenticado, 
  retorna ele como prop pro componente Home: */
  return {
    props: {} // will be passed to the page component as props
  };
}
