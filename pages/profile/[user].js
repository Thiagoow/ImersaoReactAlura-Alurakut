import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../../src/lib/AlurakutCommons";

import MainGrid from "../../src/components/MainGrid";
import Box from "../../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations";
import InfoBox from "../../src/components/InfoBox";

import nookies from "nookies";
import jwt from "jsonwebtoken";
import { checkUserAuth } from "../../src/hooks/checkUserAuth";

export default function Profile() {
  const router = useRouter();
  const { user } = router.query;
  const githubUser = user;

  const [userInfo, setUserInfo] = React.useState({});
  const [isShowingMoreSeguidores, setIsShowingMoreSeguidores] =
    React.useState(false);
  const [isShowingMoreComunidades, setIsShowingMoreComunidades] =
    React.useState(false);

  const [seguidores, setSeguidores] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);

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
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setSeguidores(data))
      .catch((error) => console.error(error));
  }

  React.useEffect(() => {
    getGithubUserInfo();
    getGithubSeguidores();
  }, [githubUser]);

  /* Função que dá o toggle 
  nas vars pra mostrar mais ou não: */
  function toggleShowMoreSeguidores(e) {
    e.preventDefault();
    setIsShowingMoreSeguidores(!isShowingMoreSeguidores);
  }
  function toggleShowMoreComunidades(e) {
    e.preventDefault();
    setIsShowingMoreComunidades(!isShowingMoreComunidades);
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
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguidores}
          >
            <h2 className="smallTitle">Amigos ({seguidores.length})</h2>
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
            <h2 className="smallTitle">
              Minhas comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/comunidades/${item.id}`} passHref>
                      <a>
                        <img src={item.imageUrl} />
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

  //Decodifica o token com a biblioteca jsonwebtoken:
  const { githubUser } = jwt.decode(userToken);
  //console.log("Token decodificado do Cookie:", token);

  /* Verifica a autorização do usuário com o hook custom, 
    a partir do Token dele (Se ele existe ou não, no GitHub): 
    */
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
