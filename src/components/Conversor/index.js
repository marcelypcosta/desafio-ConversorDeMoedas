import axios from "axios";
import React, { useState, useEffect } from "react";
import "../assets/css/style.css";


const Converter = () => {
  // Estados
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [fromResult, setFromResult] = useState("");
  const [toResult, setToResult] = useState("");
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(0);

  // Função para converter moeda
  const convertCurrency = async () => {
    try {
      // buscando as taxas de câmbio da API da Binance
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${fromCurrency.toUpperCase()}${toCurrency.toUpperCase()}`
      );
      const exchangeRate = response.data.price;

      // Definir o valor inicial
      setFromResult(1);

      // Iniciar a contagem regressiva
      setCountdown(30);

      // Configurar intervalo para atualizar a contagem regressiva a cada segundo
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Aguardar 30 segundos antes de exibir o resultado e salvar no histórico
      setTimeout(() => {
        clearInterval(countdownInterval);
        setToResult(exchangeRate);
        const conversion = `${fromCurrency.toUpperCase()} para ${toCurrency.toUpperCase()}: ${exchangeRate}`;
        setHistory([...history, conversion]);
      }, 30000);
    } catch (error) {
      console.error("Erro ao converter moeda:", error);
    }
  };

  // Efeito para limpar o intervalo quando a contagem regressiva chega a zero
  useEffect(() => {
    let countdownInterval;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    // Limpar o intervalo quando o componente é desmontado ou a contagem regressiva muda
    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  return (
    <div className="container">
      <h1>Conversor de Moeda</h1>
      <div className="title_container">
        <p className="title_currency">Moeda</p>
        <p className="title_value">Valor</p>
      </div>
      <div className="conversion_container">
        <div className="select_from">
          {/* Input para a moeda de origem */}
          <input
            className="input_from"
            type="text"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          />
          {/* Exibição do valor da moeda de origem */}
          <div className="input_value">{fromResult}</div>
        </div>
        <div className="select_to">
          {/* Input para a moeda de destino */}
          <input
            className="input_to"
            type="text"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          />
          {/* Exibição do valor convertido */}
          <div className="input_value">{toResult}</div>
        </div>

        {/* Botão de conversão */}
        <button
          className="convert_button"
          onClick={convertCurrency}
          disabled={countdown > 0}
        >
          {/* Texto do botão com contagem regressiva ou 'Converter' */}
          {countdown > 0 ? `Convertendo...` : "Converter"}
        </button>
      </div>

      {/* Dropdown para exibir o histórico de conversões */}
      <select className="conversion_history">
        <option value="">Histórico de conversão</option>
        {history.map((conversion, index) => (
          <option key={index} value={conversion}>
            {conversion}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Converter;
