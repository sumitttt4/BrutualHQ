import React, { useState } from 'react';

const SupportWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([ { from: 'bot', text: 'Hi! Ask me anything — product, pricing, or how to use the Generator.' } ]);

  const send = async () => {
    if (!input.trim()) return;
    const user = { from: 'user', text: input };
    setMessages((m) => [...m, user]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: input }) });
      const data = await res.json();
      setMessages((m) => [...m, { from: 'bot', text: data.answer || 'Thanks — our team will follow up.' }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, I could not reach support. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="w-80 card rounded-lg shadow-lg mb-2 overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <strong>Support Bot</strong>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-sm">✕</button>
            </div>
            <div className="p-3 h-40 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={m.from === 'bot' ? 'text-sm' : 'text-sm text-right'} style={{ color: m.from === 'bot' ? 'var(--text)' : 'var(--text)' }}>{m.text}</div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Ask a question..." style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }} />
              <button onClick={send} disabled={loading} className="px-3 py-1" style={{ backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', borderRadius: '6px' }}>{loading ? '...' : 'Send'}</button>
            </div>
          </div>
        )}

        <button aria-label="Open support chat" onClick={() => setOpen((s) => !s)} className="w-14 h-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center">💬</button>
      </div>
    </div>
  );
};

export default SupportWidget;
