import React, { useState, useEffect, useRef } from "react";
import Card from "../Card/Card";
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [getDeck, setGetDeck] = useState(null);
  const [getCard, setGetCard] = useState([]);
  const [manualDraw, setManualDraw] = useState(false);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function loadDeckData() {
      let d = await axios.get(`${API_BASE_URL}/new/shuffle`);
      setGetDeck(d.data);
    }
    loadDeckData();
  }, [setGetDeck]);

  useEffect(() => {
    async function loadCardData() {
      let { deck_id } = getDeck;
      try {
        let cardRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);
        if (cardRes.data.remaining === 0) {
          setAutoDraw(false);
          setManualDraw(false);
          throw new Error("No cards remaining");
        }
        const card = cardRes.data.cards[0];
        setGetCard((d) => [
          ...d,
          {
            id: card.code,
            name: card.suit + "" + card.value,
            image: card.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (manualDraw) {
      loadCardData();
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await loadCardData();
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [manualDraw, setManualDraw, autoDraw, setAutoDraw, getDeck]);

  const toggleManualDraw = () => {
    setManualDraw((man) => man + 1);
  };

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const cards = getCard.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div>
      <h1>Deck-O-Cards</h1>
      <div>
        {getDeck ? (
          <button onClick={toggleManualDraw}>Manual Draw</button>
        ) : null}
        {getDeck ? (
          <button onClick={toggleAutoDraw}>
            {autoDraw ? "Stop" : "Auto Draw"}
          </button>
        ) : null}
      </div>
      <div>{cards}</div>
    </div>
  );
};

export default Deck;
