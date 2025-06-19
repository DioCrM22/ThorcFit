import styled, { keyframes } from "styled-components";

const focusAnimation = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.2); }
`;

export const InputStyled = styled.div`
  position: relative;
  width: 100%; 

  input {
     width: 100%;
    padding: 5px 50px 5px ${props => props.$showEmoji ? '35px' : '5px'};
    font-family: "Golos Text", sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    color-scheme: light;
    border: none;
    border-bottom: 2px solid #444;
    outline: none;
    background: white;
    transition: all 0.3s ease;

    &::-webkit-calendar-picker-indicator {
      position: absolute;
      color-scheme: light;
      color: #333; 
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      filter: brightness(0) invert(0.4);
      opacity: 0.8;
    }

    &::-webkit-inner-spin-button,
    &::-webkit-clear-button {
      display: none;
    }

    &:focus {
      border-color: white;
      animation: ${focusAnimation} 0.2s forwards;
    }
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 22px;
    color: black;
  }

  .emoji {
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    opacity: ${props => props.$showEmoji ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;
