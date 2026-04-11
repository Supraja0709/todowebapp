import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="page-btn page-btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <IoChevronBackOutline size={16} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? 'page-btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn page-btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <IoChevronForwardOutline size={16} />
      </button>
    </div>
  );
}

export default Pagination;
