'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  sent_at: string;
}

// Status colors and labels
const statusConfig = {
  unread: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-red-500',
    badge: 'bg-red-100 text-red-700',
    label: 'Unread',
  },
  read: {
    bg: 'bg-orange-50',
    border: 'border-l-4 border-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    label: 'Read',
  },
  resolved: {
    bg: 'bg-green-50',
    border: 'border-l-4 border-green-500',
    badge: 'bg-green-100 text-green-700',
    label: 'Resolved',
  },
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'resolved'>('all');

  useEffect(() => {
    document.title = 'Harry & Adia Wedding | Admin | Messages';
  }, []);

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

  const updateStatus = async (id: number, status: 'unread' | 'read' | 'resolved') => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        // Update local state
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, status } : m))
        );
        // Update selected message if open
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const resolvedCount = messages.filter(m => m.status === 'resolved').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Contact Messages</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            {unreadCount} unread
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            {readCount} read
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {resolvedCount} resolved
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 rounded p-1 flex-wrap gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'read', label: 'Read' },
            { key: 'resolved', label: 'Resolved' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                filter === f.key ? 'bg-white shadow' : 'hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          No messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map(message => {
            const config = statusConfig[message.status];
            return (
              <div
                key={message.id}
                className={`${config.bg} ${config.border} p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${config.badge}`}>
                      {config.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(message.sent_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{message.email}</p>
                <p className="text-gray-600 line-clamp-2">{message.message}</p>
                
                {/* Status buttons */}
                <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
                  {message.status !== 'unread' && (
                    <button
                      onClick={() => updateStatus(message.id, 'unread')}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Mark Unread
                    </button>
                  )}
                  {message.status !== 'read' && (
                    <button
                      onClick={() => updateStatus(message.id, 'read')}
                      className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {message.status !== 'resolved' && (
                    <button
                      onClick={() => updateStatus(message.id, 'resolved')}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`p-6 border-b ${statusConfig[selectedMessage.status].bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-display text-gray-900">{selectedMessage.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[selectedMessage.status].badge}`}>
                      {statusConfig[selectedMessage.status].label}
                    </span>
                  </div>
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
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Wedding Website Inquiry`}
                  className="px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800 transition-colors"
                >
                  Reply via Email
                </a>
                
                {selectedMessage.status !== 'unread' && (
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'unread')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Mark Unread
                  </button>
                )}
                {selectedMessage.status !== 'read' && (
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'read')}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                  >
                    Mark Read
                  </button>
                )}
                {selectedMessage.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'resolved')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
