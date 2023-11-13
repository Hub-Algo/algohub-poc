import { SiGitbook } from 'react-icons/si'

const Footer = () => {
  return (
    <footer className="footer p-10 bg-gray-950 text-gray-100 border-t-2 border-gray-100">
      <nav>
        <header className="footer-title">Company</header>
        <a href="about" className="link link-hover">
          About us
        </a>
        <a className="link link-hover">Contact</a>
      </nav>
      <nav>
        <header className="footer-title">Social</header>
        <div className="grid grid-flow-col gap-4">
          <a>
            <SiGitbook className="text-2xl" />
          </a>
        </div>
      </nav>
    </footer>
  )
}

export default Footer
