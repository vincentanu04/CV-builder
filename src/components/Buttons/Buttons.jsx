import './Buttons.css'

export default function Buttons({ children }) {
    return (
        <div className='nav-buttons'>{children}</div>
    )
}

export function Button({ text }) {
    return (
        <button className='button'>{text}</button>
    )
}

export function NavButton({ text, isSelected, onClick}) {
    return (
        <button className={"nav-button " + (isSelected ? "selected" : null)} onClick={onClick}>{text}</button>
    )
}