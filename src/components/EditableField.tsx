'use client';

import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

export default function EditableField({ 
  label, 
  value, 
  onSave, 
  placeholder,
  type = 'text',
  rows = 4,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="input-field resize-none"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="input-field"
            autoFocus
          />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-burgundy-900 text-white rounded hover:bg-burgundy-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <span className="text-sm text-gray-500">{label}: </span>
        <span className="text-gray-700">
          {value || <span className="italic text-gray-400">Not provided</span>}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="text-sm text-burgundy-700 hover:text-burgundy-900 font-medium shrink-0"
      >
        Edit
      </button>
    </div>
  );
}
