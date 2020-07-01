import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function formatResponseTransactions(response: Transaction[]): Transaction[] {
    const formattedTransactions = response.map(transaction => ({
      ...transaction,
      formattedDate: formatDate(String(transaction.created_at)),
      formattedValue: formatValue(transaction.value),
    }));

    return formattedTransactions;
  }

  function formatResponseBalance(response: Balance): Balance {
    const formattedBalance = {
      income: formatValue(response.income),
      outcome: formatValue(response.outcome),
      total: formatValue(response.total),
    };

    return formattedBalance;
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const {
        transactions: responseTransactions,
        balance: responseBalance,
      } = response.data;

      setTransactions(formatResponseTransactions(responseTransactions));
      setBalance(formatResponseBalance(responseBalance));
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header size="large" activeRoute="Dashboard" />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance?.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance?.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance?.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions.map(transaction => (
              <tbody key={transaction.id}>
                {transaction.type === 'income' ? (
                  <tr>
                    <td className="title">{transaction.title}</td>
                    <td className="income">{transaction.formattedValue}</td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ) : (
                  <tr>
                    <td className="title">{transaction.title}</td>
                    <td className="outcome">
                      -{` ${transaction.formattedValue}`}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
