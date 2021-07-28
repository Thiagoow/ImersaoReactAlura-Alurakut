export async function checkUserAuth(userToken) {
  const { isAuthenticated } = await fetch(
    "https://alurakut-vinixiii.vercel.app/api/auth",
    {
      headers: {
        Authorization: userToken
      }
    }
  )
    /*Retorna a resposta se o
      usuário está ou não autenticado:*/
    .then((response) => response.json())
    .catch((err) => console.error(err));
  console.log("Usuário existe/autenticado? ->", isAuthenticated);

  return isAuthenticated;
}
