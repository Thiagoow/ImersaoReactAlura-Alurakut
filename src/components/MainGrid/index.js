import styled from "styled-components";

/* Componente MainGrid, que contém 
apenas a estilização: */
const MainGrid = styled.main`
  width: 100%;
  max-width: 500px;
  /* display: grid; */
  grid-gap: 10px;
  padding: 16px;
  margin-left: auto;
  margin-right: auto;
  .profileArea {
    display: none;
    @media (min-width: 860px) {
      display: block;
    }
  }
  @media (min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: "profileArea welcomeArea profileRelationsArea";
    grid-template-columns: ${(props) =>
      props.grid === 2 ? "160px 1fr 0px" : "160px 1fr 312px"};
  }
`;

export default MainGrid;
