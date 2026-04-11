import { IoSearchOutline, IoFunnelOutline, IoCloseCircleOutline } from 'react-icons/io5';

function SearchFilter({ search, onSearch, categoryFilter, onCategoryFilter, categories }) {
  return (
    <div className="search-filter-bar">
      <div className="search-box">
        <IoSearchOutline className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
          id="task-search"
        />
        {search && (
          <button className="clear-btn" onClick={() => onSearch('')} title="Clear search">
            <IoCloseCircleOutline size={18} />
          </button>
        )}
      </div>

      <div className="category-filter">
        <IoFunnelOutline size={16} className="funnel-icon" />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value)}
          className="category-select"
          id="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;
