import Head from "next/head";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { AlurakutStyles } from "../src/lib/AlurakutCommons";

/* Componente já criado pelo next automaticamente. O qual 
estiliza globalmente, ou seja estiliza todos os componentes,
em toda a aplicação: */
const GlobalStyle = createGlobalStyle`
/* Reseta CSS: */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

  body {
    font-family: sans-serif;
    /* Estilização do fundo de toda a aplicação: */
    background: linear-gradient(180deg, rgba(69,180,252,1) 10%, rgba(29,60,253,1) 50%, rgba(4,3,106,1) 100%);  }

/* Definindo um pouco do layout padrão */
#__next {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Usa os estilos do componente "AlurakutStyles" 
importado nas primeiras linhas do código: */
${AlurakutStyles}
`;

/* Componente já criado pelo Next, o qual serve para
definição de temas/cores da aplicação: 
(Devendo esse componente, ser usado em TODA a aplicação,
SEMPRE que formos definir tema/cor.)*/
const theme = {
  colors: {
    primary: "#0070f3"
  }
};

/* Exporta a estilização global definida acima +
o tema/cores da aplicação + propriedades da página,
para sea ser usada/ativada em todo a aplicação: */
export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Head>
          <title>Alurakut</title>
          <link rel="icon" href="pageIcon.ico" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
