import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { todoApi } from '../services/api';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Pomodoro from '../components/Pomodoro';
import Analytics from '../components/Analytics';
import SkeletonLoader from '../components/SkeletonLoader';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import ProgressBar from '../components/ProgressBar';
import { IoLogOutOutline, IoTimerOutline, IoListOutline, IoBarChartOutline } from 'react-icons/io5';

const TASKS_PER_PAGE = 6;

function Dashboard() {
  const [todos, setTodos]               = useState([]);
  const [filter, setFilter]             = useState('all');
  const [search, setSearch]             = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading]           = useState(true);
  const [view, setView]                 = useState('tasks');
  const [currentPage, setCurrentPage]   = useState(1);
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoApi.getAll();
      setTodos(response.data);
    } catch {
      addToast('Failed to load tasks. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const response = await todoApi.create(todoData);
      setTodos(prev => [response.data, ...prev]);
      addToast('Task added successfully!', 'success');
      setCurrentPage(1);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to add task.', 'error');
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      const response = await todoApi.update(id, { is_completed: !currentStatus });
      setTodos(prev => prev.map(t => t.id === id ? response.data : t));
      addToast(currentStatus ? 'Task marked active.' : 'Task completed! 🎉', 'success');
    } catch {
      addToast('Failed to update task.', 'error');
    }
  };

  const editTodo = async (id, newTitle) => {
    try {
      const response = await todoApi.update(id, { title: newTitle });
      setTodos(prev => prev.map(t => t.id === id ? response.data : t));
      addToast('Task updated.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update task.', 'error');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      addToast('Task deleted.', 'info');
    } catch {
      addToast('Failed to delete task.', 'error');
    }
  };

  // Unique categories for filter dropdown
  const categories = useMemo(() =>
    [...new Set(todos.map(t => t.category).filter(Boolean))].sort(),
    [todos]
  );

  // Apply status filter → search → category filter
  const filteredTodos = useMemo(() => {
    let result = todos;
    if (filter === 'active')    result = result.filter(t => !t.is_completed);
    if (filter === 'completed') result = result.filter(t => t.is_completed);
    if (search.trim())          result = result.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
    );
    if (categoryFilter)         result = result.filter(t => t.category === categoryFilter);
    return result;
  }, [todos, filter, search, categoryFilter]);

  // Pagination
  const totalPages   = Math.max(1, Math.ceil(filteredTodos.length / TASKS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const paginated    = filteredTodos.slice((safePage - 1) * TASKS_PER_PAGE, safePage * TASKS_PER_PAGE);

  const handleFilterChange = (f) => { setFilter(f); setCurrentPage(1); };
  const handleSearch       = (v) => { setSearch(v);  setCurrentPage(1); };
  const handleCategoryFilter = (c) => { setCategoryFilter(c); setCurrentPage(1); };

  return (
    <div className={`app-container dashboard ${view === 'analytics' ? 'dashboard--wide' : ''}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Hi, {user?.name} 👋</h2>
          <p>Ready to crush your goals today?</p>
        </div>
        <button className="btn-icon logout-btn" onClick={logout} title="Logout">
          <IoLogOutOutline size={24} />
        </button>
      </div>

      {/* Progress Bar — always visible */}
      {!loading && <ProgressBar todos={todos} />}

      {/* Nav */}
      <div className="dashboard-nav">
        <button className={`nav-item ${view === 'tasks' ? 'active' : ''}`} onClick={() => setView('tasks')}>
          <IoListOutline /> Tasks
        </button>
        <button className={`nav-item ${view === 'analytics' ? 'active' : ''}`} onClick={() => setView('analytics')}>
          <IoBarChartOutline /> Analytics
        </button>
        <button className={`nav-item ${view === 'pomodoro' ? 'active' : ''}`} onClick={() => setView('pomodoro')}>
          <IoTimerOutline /> Focus
        </button>
      </div>

      {/* ── Tasks View ── */}
      {view === 'tasks' && (
        <>
          <TodoForm onAdd={addTodo} />

          <SearchFilter
            search={search}
            onSearch={handleSearch}
            categoryFilter={categoryFilter}
            onCategoryFilter={handleCategoryFilter}
            categories={categories}
          />

          <div className="filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`}       onClick={() => handleFilterChange('all')}>All</button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`}    onClick={() => handleFilterChange('active')}>Active</button>
            <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => handleFilterChange('completed')}>Completed</button>
          </div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <>
              <TodoList
                todos={paginated}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
              {filteredTodos.length > 0 && (
                <div className="pagination-info">
                  <span>Showing {((safePage-1)*TASKS_PER_PAGE)+1}–{Math.min(safePage*TASKS_PER_PAGE, filteredTodos.length)} of {filteredTodos.length}</span>
                  <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Analytics View ── */}
      {view === 'analytics' && <Analytics todos={todos} />}

      {/* ── Pomodoro View ── */}
      {view === 'pomodoro' && (
        <div className="pomodoro-view"><Pomodoro /></div>
      )}
    </div>
  );
}

export default Dashboard;
