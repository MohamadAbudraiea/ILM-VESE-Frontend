import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-primary text-neutral-content items-center p-4">
      <aside className="grid-flow-col items-center">
        <img src="Logo.png" className="h-12" />
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a
          href="https://www.instagram.com/thinking_flares_school?igsh=MXFxZjFhd255aXR6aQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <FaInstagram className="w-7 h-7 fill-current" />
        </a>

        <a
          href="https://www.facebook.com/thinking.flares?mibextid=wwXIfr&rdid=WecM6c0lEpo5xVUd&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F198LSwb5S5%2F%3Fmibextid%3DwwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <FaFacebookF className="w-7 h-7 fill-current" />
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
