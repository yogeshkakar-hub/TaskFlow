import React from 'react';
import { Trash2, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'To Do':
        return {
          bg: 'bg-zinc-900 border-zinc-700/60 text-zinc-300',
          indicator: 'bg-zinc-400',
          nextStatus: 'In Progress',
          prevStatus: null
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
          indicator: 'bg-amber-400',
          nextStatus: 'Completed',
          prevStatus: 'To Do'
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          indicator: 'bg-emerald-400',
          nextStatus: null,
          prevStatus: 'In Progress'
        };
      default:
        return {
          bg: 'bg-zinc-900 border-zinc-800 text-zinc-300',
          indicator: 'bg-zinc-400',
          nextStatus: null,
          prevStatus: null
        };
    }
  };

  const config = getStatusConfig(task.status);
  
  // Format Date beautifully
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="group relative glass rounded-xl border border-zinc-800/80 p-5 hover:border-zinc-700/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[160px] hover:translate-y-[-2px]">
      <div>
        {/* Title */}
        <h4 className="text-base font-bold text-zinc-100 mb-1.5 group-hover:text-white transition-colors leading-snug break-words">
          {task.title}
        </h4>
        
        {/* Description */}
        {task.description && (
          <p className="text-sm text-zinc-400 leading-relaxed mb-4 break-words font-light">
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-zinc-800/50 flex flex-wrap items-center justify-between gap-3">
        {/* Date / Status Badges */}
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.indicator} pulse-slow`}></span>
            {task.status}
          </span>
          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Move Back Button */}
          {config.prevStatus && (
            <button
              onClick={() => onUpdateStatus(task._id, config.prevStatus)}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-150 active:scale-90 cursor-pointer"
              title={`Move back to ${config.prevStatus}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Move Forward Button */}
          {config.nextStatus && (
            <button
              onClick={() => onUpdateStatus(task._id, config.nextStatus)}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-150 active:scale-90 cursor-pointer"
              title={`Move to ${config.nextStatus}`}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-150 active:scale-90 ml-1 cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
