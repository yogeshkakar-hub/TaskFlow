import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, ListTodo, Clock, CheckCircle2, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // Fetch all user tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Establish WebSocket Connection
    // Using port 5000 directly because WebSocket handshake requires backend server address.
    socketRef.current = io('http://localhost:5000');

    // Socket listeners for real-time changes
    socketRef.current.on('taskCreated', (task) => {
      // Only insert if the task belongs to this user and is not already in the list
      if (task.user === user.id) {
        setTasks((prevTasks) => {
          if (prevTasks.some((t) => t._id === task._id)) return prevTasks;
          return [task, ...prevTasks];
        });
      }
    });

    socketRef.current.on('taskUpdated', (task) => {
      if (task.user === user.id) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === task._id ? task : t))
        );
      }
    });

    socketRef.current.on('taskDeleted', ({ id, userId }) => {
      if (userId === user.id) {
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      }
    });

    // Clean up connections on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user.id]);

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      await axios.post('/api/tasks', taskData);
      // Let Socket.io handle state injection to avoid duplicates
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      // Let Socket.io handle state update
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      // Let Socket.io handle state deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks by column
  const todoTasks = tasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Workspace Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1 font-light">
              Manage, monitor, and synchronize your sprint pipeline in real-time.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            Add New Task
          </button>
        </div>

        {/* Premium Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stat 1: Total */}
          <div className="glass rounded-xl p-4.5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Tasks</span>
              <span className="text-2xl font-black text-zinc-100">{totalCount}</span>
            </div>
          </div>

          {/* Stat 2: Active */}
          <div className="glass rounded-xl p-4.5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">In Progress</span>
              <span className="text-2xl font-black text-zinc-100">{inProgressTasks.length}</span>
            </div>
          </div>

          {/* Stat 3: Completed */}
          <div className="glass rounded-xl p-4.5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Completed</span>
              <span className="text-2xl font-black text-zinc-100">{completedCount}</span>
            </div>
          </div>

          {/* Stat 4: Progress Indicator */}
          <div className="glass rounded-xl p-4.5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-indigo-400" />
                Completion Rate
              </span>
              <span className="text-sm font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-2 rounded-full border border-zinc-800/80 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Responsive Kanban Board Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: To Do */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-zinc-300 font-bold">
                  <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                  <h2>To Do</h2>
                </div>
                <span className="text-xs font-semibold bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full text-zinc-400">
                  {todoTasks.length}
                </span>
              </div>
              <div className="flex-1 bg-zinc-900/35 border border-zinc-900 rounded-2xl p-4 min-h-[300px] flex flex-col gap-3">
                {todoTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-850 rounded-xl">
                    <p className="text-sm text-zinc-500 font-light">No tasks in backlog</p>
                  </div>
                ) : (
                  todoTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <h2>In Progress</h2>
                </div>
                <span className="text-xs font-semibold bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full text-amber-400/80">
                  {inProgressTasks.length}
                </span>
              </div>
              <div className="flex-1 bg-zinc-900/35 border border-zinc-900 rounded-2xl p-4 min-h-[300px] flex flex-col gap-3">
                {inProgressTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-850 rounded-xl">
                    <p className="text-sm text-zinc-500 font-light">No tasks in progress</p>
                  </div>
                ) : (
                  inProgressTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <h2>Completed</h2>
                </div>
                <span className="text-xs font-semibold bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full text-emerald-400/80">
                  {completedTasks.length}
                </span>
              </div>
              <div className="flex-1 bg-zinc-900/35 border border-zinc-900 rounded-2xl p-4 min-h-[300px] flex flex-col gap-3">
                {completedTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-850 rounded-xl">
                    <p className="text-sm text-zinc-500 font-light">No completed tasks</p>
                  </div>
                ) : (
                  completedTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;
