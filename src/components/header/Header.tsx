import titleLogo from './../../assets/title.png'

export default function Header() {
  return (
    <div className="title-header">
      <img className={`title-logo`} alt="logo" src={titleLogo}></img>
      <div className={`title-desc`}>
        OPEN YOUR EYES TO THE GREATNESS OF TAMIL NADU'S LITERATURE AND HISTORY
      </div>
    </div>
  )
}
