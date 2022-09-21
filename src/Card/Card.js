import "./Card.css";

const Card = ({ name, image }) => {
  return <img src={image} alt={name} className="Card" />;
};

export default Card;
