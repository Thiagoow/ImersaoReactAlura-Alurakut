import React from "react";
//Hook do Next.js:
import { useRouter } from "next/router";

export default function LoginScreen() {
  const router = useRouter();
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
              router.push("/");
            }}
          >
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input placeholder="Usuário" />
            <button type="submit">Login</button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>ENTRAR JÁ</strong>
              </a>
            </p>
          </footer>
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
