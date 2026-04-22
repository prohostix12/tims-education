'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin, FiSend, FiClock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { COURSES } from '@/lib/data'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! We\'ll get back to you within 24 hours.')
        setForm({ name: '', email: '', phone: '', course: '', message: '' })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-hero-gradient min-h-[70vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Contact Us</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Have questions about admissions or programs? Reach out — our team is here to guide you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-white/60 text-sm">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Contact</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Reach Us</p>
              <h2 className="text-2xl font-bold text-primary-800 font-heading mb-4">We're Here for You</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Visit our Tirur or Edappal office, call us, or send a message. Our counsellors respond within 24 hours.
              </p>
            </div>

            {[
              {
                icon: FiMapPin,
                title: 'Tirur Office (HQ)',
                lines: ['2nd Floor, Pamls Tower', 'Near Central Bank, Thazhepalam', 'Tirur, Kerala 676101'],
              },
              {
                icon: FiMapPin,
                title: 'Edappal Office',
                lines: ['Contact: +91 9526 387 777', 'Edappal, Malappuram', 'Kerala'],
              },
              {
                icon: FiPhone,
                title: 'Phone',
                lines: ['+91 7736 1115 88', '+91 9526 387 777'],
              },
              {
                icon: FiMail,
                title: 'Email',
                lines: ['info@timseducation.com'],
              },
              {
                icon: FiClock,
                title: 'Working Hours',
                lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Sun: Closed'],
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <item.icon className="text-primary-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-primary-800 text-sm mb-1">{item.title}</p>
                  {item.lines.map((l) => <p key={l} className="text-gray-500 text-xs">{l}</p>)}
                </div>
              </div>
            ))}

            <a href="https://wa.me/917736111588" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all shadow-md">
              <FaWhatsapp size={18} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-primary-800 font-heading mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-7">Fill out the form and we'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested In</label>
                  <select name="course" value={form.course} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white text-gray-700">
                    <option value="">Select a program</option>
                    {COURSES.map((c) => (
                      <option key={c.title} value={c.title}>{c.title}</option>
                    ))}
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder="Tell us how we can help you..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <><FiSend size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-80 bg-primary-50 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="text-primary-600 mx-auto mb-3" size={40} />
              <p className="font-semibold text-primary-800">Pamls Tower, Thazhepalam, Tirur, Kerala 676101</p>
              <a href="https://maps.google.com/?q=Tirur,Kerala" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-primary-600 underline hover:text-primary-800">
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
