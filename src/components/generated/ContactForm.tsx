import { useState } from "react";
import { FaCheck } from "react-icons/fa";

interface ContactFormProps {
  compact?: boolean;
}

export function ContactForm({ compact = false }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
          <FaCheck className="text-success" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-metal-text mb-2">Demo Completed</h3>
        <p className="text-metal-subtext">This preview form does not send inquiries. Please email sales@ruchengmachine.com.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? "" : "max-w-2xl mx-auto"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm text-metal-subtext mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-metal-subtext mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
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
          <label htmlFor="company" className="block text-sm text-metal-subtext mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="Your Company Ltd."
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm text-metal-subtext mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-metal-subtext mb-2">
          Your Requirements *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={compact ? 3 : 5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 inquiry-field border border-border rounded-card text-metal-text placeholder-metal-gray focus:outline-none focus:border-steel transition-colors resize-none"
          placeholder="Please describe the products you need, specifications, quantity, etc."
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
