import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import nookies from "nookies";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../../src/lib/AlurakutCommons";

import MainGrid from "../../src/components/MainGrid";
import Box from "../../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../../src/components/ProfileRelations";
import InfoBox from "../../src/components/InfoBox";

import jwt from "jsonwebtoken";
import { checkUserAuth } from "../../src/hooks/checkUserAuth";

export default function Profile() {
  const router = useRouter();
  const { user } = router.query;
  const githubUser = user;

  const [userInfo, setUserInfo] = React.useState({});
  const [isShowingMoreFollowers, setIsShowingMoreFollowers] =
    React.useState(false);
  const [isShowingMoreCommunities, setIsShowingMoreCommunities] =
    React.useState(false);

  const [followers, setFollowers] = React.useState([]);
  const [communities, setCommunities] = React.useState([]);

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

  function getGithubFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setFollowers(data))
      .catch((error) => console.error(error));
  }

  React.useEffect(() => {
    getGithubUserInfo();
    getGithubFollowers();
  }, [githubUser]);

  function handleShowMoreFollowers(e) {
    e.preventDefault();
    setIsShowingMoreFollowers(!isShowingMoreFollowers);
  }

  function handleShowMoreCommunities(e) {
    e.preventDefault();
    setIsShowingMoreCommunities(!isShowingMoreCommunities);
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

            <OrkutNostalgicIconSet />

            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnRight">localização:</td>
                  <td>{userInfo.location}</td>
                </tr>
                <tr>
                  <td className="textOnRight">membro desde:</td>
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
            isShowingMoreItems={isShowingMoreFollowers}
          >
            <h2 className="smallTitle">Amigos ({followers.length})</h2>
            <ul>
              {followers.map((item) => {
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
            {followers.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => handleShowMoreFollowers(e)}
                >
                  {isShowingMoreFollowers ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreCommunities}
          >
            <h2 className="smallTitle">
              Minhas comunidades ({communities.length})
            </h2>
            <ul>
              {communities.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/communities/${item.id}`} passHref>
                      <a>
                        <img src={item.imageUrl} />
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {communities.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => handleShowMoreCommunities(e)}
                >
                  {isShowingMoreCommunities ? "Ver menos" : "Ver mais"}
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
