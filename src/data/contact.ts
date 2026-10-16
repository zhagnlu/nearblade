export const contactEmail = "info@nearblade.com";
export const contactPhone = {
  number: "8618966486485",
  e164: "+8618966486485",
  displayNumber: "+8618966486485",
};
export const phoneUrl = `tel:${contactPhone.e164}`;

export interface ContactInquiry {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export function contactEmailDraft(values: ContactInquiry) {
  const subject = values.subject.replace(/[\r\n]+/g, " ").trim().slice(0, 300) || "Nearblade product inquiry";
  const body = [
    "Nearblade product inquiry",
    "",
    `Name: ${values.name.trim().slice(0, 300)}`,
    `Email: ${values.email.trim().slice(0, 300)}`,
    `Company: ${values.company.trim().slice(0, 300) || "Not provided"}`,
    `Phone / WhatsApp: ${values.phone.trim().slice(0, 100) || "Not provided"}`,
    "",
    "Requirements:",
    values.message.trim().slice(0, 5000),
  ].join("\r\n");

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const whatsappContact = contactPhone;

export const whatsappUrl = `https://wa.me/${whatsappContact.number}`;
