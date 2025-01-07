import './Buttons.css';

export default function Buttons({ children, className }) {
  return <div className={`buttons ${className}`}>{children}</div>;
}

export function Button({ text, onClick, disabled, className }) {
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
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
