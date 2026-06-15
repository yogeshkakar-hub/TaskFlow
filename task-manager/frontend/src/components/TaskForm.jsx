import React, { useState } from 'react';
import { X, Plus, ClipboardList } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onSubmit({ title, description, status });
    // Reset state
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md glass rounded-2xl border border-zinc-800 p-6 shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-100">Create New Task</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build authentication route"
              className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows="3"
              className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-zinc-100 text-sm outline-none transition-all cursor-pointer"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-tr from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
