import React from 'react';
import './Pagination.css';

const Pagination = () => {
  return (
    <div className="pagination">
      <div className="entries">
        <span>Show</span>
        <select>
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>
        <span>entries</span>
      </div>
      <div class="pagination-controls">
        <a href="#">Previous</a>
        <span>1 2 3</span>
        <a href="#">Next</a>
      </div>
    </div>
  );
};

export default Pagination;