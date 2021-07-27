import React from "react";
//Hook do Next.js:
import { useRouter } from "next/router";
/* Importa os nookies -> Biblioteca do Next.js pra
salvar infos com os cookies do browser. Nesse nosso
caso, o Token gerado pela API. */
import nookies from "nookies";

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState("");
  const [userExist, setUserExist] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <main
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p>
            <strong>Conecte-se</strong> aos seus amigos e familiares usando
            recados e mensagens instantâneas
          </p>
          <p>
            <strong>Conheça</strong> novas pessoas através de amigos de seus
            amigos e comunidades
          </p>
          <p>
            <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
            lugar
          </p>
        </section>

        <section className="formArea">
          <form
            className="box"
            onSubmit={(event) => {
              event.preventDefault();
              console.log("Usuário: ", githubUser);
              /* Verifica se o usuário existe ou não, na api já
                existente da Alura:*/
              fetch("https://alurakut.vercel.app/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                //Transforma em string pelo padrão Json, a var de usuário:
                body: JSON.stringify({ githubUser: "Thiagoow" })
              }).then(async (serverResponse) => {
                //Transforma a resposta do server em json:
                const serverData = await serverResponse.json();
                const token = serverData.token;
                /*Cria um novo cookie com o token recebido do server: 
                com a sintaxe:
                "nookies.set(ctx/Contexto(Se Não tiver é nulo), NomeInfo, valorInfo)"*/
                nookies.set(null, "USER_TOKEN", token, {
                  path: "/",
                  /*Data de expiração/auto destruição
                  do Cookie (em seg):*/
                  maxAge: 86400 * 7 //<- 1 semana (1 dia em seg * 7)
                });
                /* Manda pra const "router", criada lá em cima do código,
                e que recebe o useRouter do Next, a "/" que é o path para o index.js: */
                router.push("/");
              });
            }}
          >
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            {/* A prop "value={}" é o que integra o estado da var do React
            com oq é digitado no input. Sendo ela, o estado inicial imutável
            do input. E o onChange o valor/estado alterável: */}
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={(event) => {
                //Seta o estado da var githubUser para oq foi digitado no input:
                setGithubUser(event.target.value);
              }}
            />
            {/* Tratamento de erro: */}
            {githubUser.length === 0 ? "Preencha o campo" : ""}
            {!userExist && (
              <span
                style={{ fontSize: "13px", color: "red", marginBottom: "12px" }}
              >
                Este usuário é inválido! Tente novamente
              </span>
            )}

            <button type="submit" disabled={isLoading ? true : false}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>CADASTRE-SE JÁ</strong>
              </a>
            </p>
          </footer> */}
        </section>

        <footer className="footerArea">
          <p>
            Thiago da Silva Lopes © - 2021 Imersão React{" "}
            <a href="https://www.alura.com.br/" target="_blank">
              Alura{" "}
            </a>{" "}
            #03 -{" "}
            <a href="https://github.com/Thiagoow" target="_blank">
              Meu GitHub
            </a>{" "}
            -{" "}
            <a
              href="https://www.linkedin.com/in/thiagosilvaloopes/"
              target="_blank"
            >
              Meu LinkedIn
            </a>{" "}
            - <a href="mailto:thiagodrive08@hotmail.com">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
