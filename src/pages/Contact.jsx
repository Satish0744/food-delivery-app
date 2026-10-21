import { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.", "success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-app py-10 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold mb-2">Get in Touch</h1>
        <p className="text-gray-600">We'd love to hear from you</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {[
            { icon: FaPhone, title: "Phone", value: "+91 98765 43210" },
            { icon: FaEnvelope, title: "Email", value: "hello@foodhub.com" },
            { icon: FaMapMarkerAlt, title: "Address", value: "MG Road, Bangalore, India" },
          ].map((c, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary text-xl shrink-0">
                <c.icon />
              </div>
              <div>
                <p className="text-xs text-gray-500">{c.title}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Message</label>
            <textarea
              className="input-field min-h-[100px]"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <button className="w-full btn-primary py-3">Send Message</button>
        </form>
      </div>
    </div>
  );
}