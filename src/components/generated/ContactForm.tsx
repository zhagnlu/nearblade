import { useId, useRef, useState } from "react";
import { contactEmail, contactEmailDraft } from "@/data/contact";

interface ContactFormProps {
  compact?: boolean;
  initialSubject?: string;
}

export function ContactForm({ compact = false, initialSubject = "Nearblade product inquiry" }: ContactFormProps) {
  const formId = useId();
  const draftLink = useRef<HTMLAnchorElement>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: initialSubject,
    message: "",
  });
  const draftUrl = contactEmailDraft(formData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setIsDraftReady(true);
    draftLink.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
    setIsDraftReady(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? "" : "max-w-2xl mx-auto"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className="block text-sm text-metal-subtext mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            maxLength={300}
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm text-metal-subtext mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id={`${formId}-email`}
            name="email"
            autoComplete="email"
            maxLength={300}
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="john@company.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-company`} className="block text-sm text-metal-subtext mb-2">
            Company Name
          </label>
          <input
            type="text"
            id={`${formId}-company`}
            name="company"
            autoComplete="organization"
            maxLength={300}
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="Your Company Ltd."
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-sm text-metal-subtext mb-2">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            id={`${formId}-phone`}
            name="phone"
            autoComplete="tel"
            maxLength={100}
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${formId}-subject`} className="block text-sm text-metal-subtext mb-2">
          Subject *
        </label>
        <input
          type="text"
          id={`${formId}-subject`}
          name="subject"
          required
          maxLength={300}
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
          placeholder="Product inquiry or quotation request"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-message`} className="block text-sm text-metal-subtext mb-2">
          Your Requirements *
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          maxLength={5000}
          rows={compact ? 3 : 5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors resize-none"
          placeholder="Please describe the products you need, specifications, quantity, etc."
        />
      </div>
      <p className="text-sm text-metal-subtext">
        This opens your email app with your inquiry addressed to {contactEmail}. Review and send the message there.
      </p>
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5"
      >
        Open Email Draft
      </button>
      <a ref={draftLink} href={draftUrl} hidden aria-hidden="true" tabIndex={-1}>Open Email Draft</a>
      {isDraftReady && (
        <div role="status" aria-live="polite" className="bg-industrial-secondary border border-border rounded-card p-4 text-sm text-metal-subtext">
          <p className="mb-2">Your email draft is ready. Send it from your email app. Your details remain here for editing.</p>
          <p>
            If your email app did not open, <a href={draftUrl} className="text-steel font-medium hover:underline">open the draft again</a>, or email <a href={`mailto:${contactEmail}`} className="text-steel font-medium hover:underline">{contactEmail}</a> with your requirements.
          </p>
        </div>
      )}
    </form>
  );
}
