import './Buttons.css';

export default function Buttons({ children }) {
  return <div className='buttons'>{children}</div>;
}

export function Button({ text, onClick, disabled }) {
  return (
    <button className='button' onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export function MultipleInputButton({ text, onClick, disabled }) {
  return (
    <button
      className='multiple-input-button'
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export function NavButton({ text, isSelected, onClick }) {
  return (
    <button
      className={'nav-button ' + (isSelected ? 'selected' : null)}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
