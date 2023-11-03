import axios from "axios";
import "../assets/css/style.css";
import { useState, useEffect } from "react";

function Converter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("https://api.binance.com/api/v3/ticker/price");
      const data = response.data;
      setCurrencies(data);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    const interval = setInterval(() => {
      fetchCurrencies();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const convertCurrency = () => {
    const sourceCurrency = currencies.find((currency) => currency.symbol === fromCurrency);
    const targetCurrency = currencies.find((currency) => currency.symbol === toCurrency);

    if (sourceCurrency && targetCurrency && inputValue) {
      if (sourceCurrency.symbol !== targetCurrency.symbol) {
        const sourceRate = sourceCurrency.price;
        const targetRate = targetCurrency.price;
        const value = parseFloat(inputValue);

        const conversionResult = (value * targetRate) / sourceRate;
        setResult(conversionResult.toFixed(2));

        // Save the conversion in history state
        const conversion = `${value} ${fromCurrency} = ${conversionResult.toFixed(2)} ${toCurrency}`;
        setHistory([...history, conversion]);
      } else {
        setResult("Selecione uma moeda diferente.");
      }
    } else {
      setResult("Preencha todas as informações necessárias.");
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Conversor de Moeda</h1>
        <div className="conversion_container">
          <div className="select_from">
            <select
              className="select_currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Moeda de Origem</option>
              {currencies.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.symbol}
                </option>
              ))}
            </select>

            <input
              className="input_value"
              type="number"
              placeholder="digite o valor aqui"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="select_to">
            <select
              className="select_currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Moeda de Destino</option>
              {currencies.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.symbol}
                </option>
              ))}
            </select>
            <div className="input_value">
              {result}
            </div>
          </div>

          <button className="convert_button" onClick={convertCurrency}>
            Converter
          </button>
        </div>

        <select className="conversion_history">
          <option value="">Histórico de conversão</option>
          {history.map((conversion, index) => (
            <option key={index} value={conversion}>
              {conversion}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Converter;
