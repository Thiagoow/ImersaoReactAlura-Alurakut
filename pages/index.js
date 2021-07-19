import styled from "styled-components";

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Box = styled.div`
  background: #fff;
  font-size: 2rem;
  border-radius: 8px;
`;

export default function Home() {
  return (
    <main align="center">
      <Box>Title</Box>
      <Box>Bem vindo</Box>
      <Box>Bem vindo</Box>
      <Box>Yey :D</Box>
    </main>
  );
}
