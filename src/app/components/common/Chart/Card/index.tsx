import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

interface CardProps {
  label: string;
  balance: number;
  className?: string;
}

const Card = ({ label, balance, className }: CardProps) => {
  return (
    <Frame data-testid="Card" className={className}>
      {label}
      {balance}
    </Frame>
  );
}

const Frame = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 15px;
`;
Card.propTypes = {
  label: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: "",
};

export default Card;
