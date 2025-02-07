import './Buttons.css';

interface ButtonsProps {
  children: React.ReactNode;
  className?: string;
}

export default function Buttons({ children, className = '' }: ButtonsProps) {
  return <div className={`buttons ${className}`}>{children}</div>;
}

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ text, onClick, disabled, className }: ButtonProps) {
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

interface MultipleInputButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MultipleInputButton({
  text,
  onClick,
  disabled,
}: MultipleInputButtonProps) {
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

interface NavButtonProps {
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NavButton({
  text,
  isSelected = false,
  onClick,
}: NavButtonProps) {
  return (
    <button
      className={'nav-button ' + (isSelected ? 'selected' : null)}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
