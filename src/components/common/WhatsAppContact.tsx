import { FaWhatsapp } from "react-icons/fa";
import { whatsappUrl } from "@/data/contact";

export function WhatsAppContact() {
  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={30} aria-hidden="true" focusable="false" />
    </a>
  );
}
