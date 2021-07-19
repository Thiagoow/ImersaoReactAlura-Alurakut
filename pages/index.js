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
  OrkutNostalgicIconSet
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propsGitHub) {
  /* Usando o próprio GitHub como API, podemos
  receber e exibir algumas props públicas do user!
  Que podem ser vistas pelo console do browser, com o comando:

  console.log(propsGitHub);*/
  return (
    <Box>
      {/* Como por exemplo, a foto do usuário, a partir do @ dele: */}
      <img
        src={`https://github.com/${propsGitHub.userGitHub}.png`}
        style={{ borderRadius: "8px" }}
      />
    </Box>
    /* Você pode ver os dados públicos dos seus seguidores 
    por exemplo, na API do GitHub, utilizando a URL:
      https://api.github.com/users/seunomedeusuário/followers */
  );
}

export default function Home() {
  /* Essa é a var que representa você 😁 =
  O user da rede social Alurakut. Sendo o seu nome,
  o mesmo nome do seu usuário do GitHub, pois assim,
  pesquisamos seu nome na API do GitHub, e exibimos
  a foto definida no seu perfil do GitHub! :D */
  const usuário = "thiagoow";
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
    "maykbrito",
    "diego3g",
    "yungsilva"
  ];

  return (
    <>
      {/* Importa o Header/Menu existente lá em "src\lib\AlurakutCommons.js": */}
      <AlurakutMenu />
      <MainGrid>
        {/* Todos esses classNames já estavam prontos, e foram definidos
        pela alura nos componentes da pasta "../src" */}
        {/* Coluna 1 - Área do perfil: */}
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          {/*  */}
          <ProfileSidebar userGitHub={usuário} />
        </div>
        {/* Coluna 2 - Coluna central com infos do perfil e mensagem de "boas vindas, usuário!": */}
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a) {usuário}</h1>
            {/* Componente tbm já existente lá em "src\lib\AlurakutCommons.js": */}
            <OrkutNostalgicIconSet />
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
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
                    <a href={`/users/${itemArray}`} key={itemArray}>
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
