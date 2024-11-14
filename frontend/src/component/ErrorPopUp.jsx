import styled from 'styled-components';

const ErrorWindow = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
`;

const ErrorContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    width: 300px;
`;

const CloseButton = styled.button`
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const ErrorPopUp = ({ isOpen, onClose, message}) => {
  if (!isOpen) return null;

  return (
    <>
      <ErrorWindow onClick={onClose}>
        <ErrorContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>X</CloseButton>
          {message}
        </ErrorContent>
      </ErrorWindow>
        
    </>
  );
}

export default ErrorPopUp;