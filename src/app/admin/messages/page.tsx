'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  sent_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Contact Messages</h1>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-burgundy-100 text-burgundy-700 rounded-full text-sm">
            {unreadCount} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                !message.read ? 'border-l-4 border-burgundy-700' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{message.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(message.sent_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{message.email}</p>
              <p className="text-gray-600 line-clamp-2">{message.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display text-gray-900">{selectedMessage.name}</h2>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm text-burgundy-700 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(selectedMessage.sent_at).toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700">{selectedMessage.message}</div>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Wedding Website Inquiry`}
                className="mt-4 inline-block px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

