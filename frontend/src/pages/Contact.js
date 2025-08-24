import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
      setSent(true);
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
        <p className="text-slate-600 mb-6">Have a question or need help? Send us a message and our support bot will follow up.</p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded">Thanks — we received your message and will reply soon.</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full border px-3 py-2 rounded" required />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border px-3 py-2 rounded" required />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" className="w-full border px-3 py-2 rounded h-40" required />
            <div>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">{loading ? 'Sending...' : 'Send Message'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
