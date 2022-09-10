import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

import styled from "styled-components";

import {
  getUserData,
  deleteSession,
  getClientStatments,
} from "../services/MyWalletAPI";
import TokenContext from "../contexts/TokenContext";
import UserContext from "../contexts/UserContext";
import Header from "../common/Header";

export default function Home() {
  let balance = 0;
  const { token } = useContext(TokenContext);
  const { user, setUser } = useContext(UserContext);
  const [bankStatements, setBankStatements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Sessão expirada, por favor faça login novamente");
      navigate("/");
    } else {
      getUserData(token)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.log(err));

      getClientStatments(token)
        .then((response) => {
          setBankStatements(response.data);
          console.log(bankStatements);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  async function logOut() {
    if (window.confirm("Deseja realmente encerrar sua sessão?")) {
      try {
        const response = await deleteSession(token);

        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Wrapper>
      {user.length === 0 ? (
        <ThreeCircles
          height="150"
          width="150"
          color="rgb(163, 40, 214, 1)"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      ) : (
        <>
          <Header>
            <div>Olá, {user}</div>
            <RiLogoutBoxRLine size="30px" onClick={logOut} />
          </Header>
          <Records>
            {bankStatements.length !== 0 ? (
              <>
                <Statements>
                  {bankStatements.map((statement, index) => {
                    if (statement.type === "deposit") {
                      balance += parseFloat(statement.amount);
                      console.log(balance);
                    } else {
                      balance -= parseFloat(statement.amount);
                      console.log(balance);
                    }

                    return (
                      <Statment key={index}>
                        <Date>{statement.date}</Date>
                        <Description>{statement.description}</Description>
                        <Price type={statement.type}>
                          {statement.amount.replace(".", ",")}
                        </Price>
                      </Statment>
                    );
                  })}
                </Statements>
                <Balance>
                  SALDO
                  <Amount balance={balance}>
                    {balance.toFixed(2).replace(".", ",")}
                  </Amount>
                </Balance>
              </>
            ) : (
              <Message>Não há registros de entrada ou saída</Message>
            )}
          </Records>
          <Buttons>
            <IoAddCircleOutline
              color="#ffffff"
              size="25px"
              style={{ position: "absolute", top: "6%", left: "2%" }}
            />
            <IoRemoveCircleOutline
              color="#ffffff"
              size="25px"
              style={{ position: "absolute", top: "6%", left: "55%" }}
            />
            <button
              onClick={() => {
                navigate("/add/deposit");
              }}
            >
              Nova entrada
            </button>
            <button
              onClick={() => {
                navigate("/add/withdrawal");
              }}
            >
              Nova saida
            </button>
          </Buttons>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-family: "Raleway", sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Records = styled.div`
  height: 69%;
  width: 85%;
  max-width: 600px;
  display: flex;
  position: absolute;
  top: 10%;
  background-color: #ffffff;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  color: #868686;
  border-radius: 5px;
  margin-bottom: 13px;
`;

const Message = styled.div`
  width: 55%;
  display: flex;
  text-align: center;
  justify-content: center;
`;

const Statements = styled.div`
  width: 95%;
  height: 85%;
  overflow-y: scroll;
`;

const Statment = styled.div`
  width: 100%;
  resize: vertical;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Date = styled.div`
  width: 17%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  color: #c6c6c6;
`;

const Description = styled.div`
  width: 55%;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  color: #000000;
  overflow-x: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.div`
  justify-content: center;
  align-items: center;
  width: 28%;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: ${(props) => (props.type === "withdrawal" ? "#c70000" : "#03AC00")};
`;

const Balance = styled.div`
  width: 95%;
  height: 8%;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  color: #000000;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Amount = styled.div`
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  text-align: right;
  color: ${(props) => {
    if (props.balance !== 0) {
      if (props.balance < 0) {
        return "red";
      }
      return "green";
    } else {
      return "black";
    }
  }};
`;

const Buttons = styled.div`
  width: 85%;
  max-width: 600px;
  height: 17%;
  display: flex;
  position: absolute;
  top: 79%;
  margin-top: 13px;
  justify-content: space-between;
  align-items: center;

  button {
    background-color: #a328d6;
    width: 47%;
    height: 100%;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    display: flex;
    outline: none;
    border: none;
    color: #ffffff;
    align-items: flex-end;
    justify-content: left;
    text-align: left;
    padding: 0 0 9px 10px;
    padding-right: 40%;
  }
`;
