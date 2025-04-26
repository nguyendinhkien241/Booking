import { usePagination, useTable } from 'react-table';
import './ManageTable.css';

const ManageTable = ({ data, columns, handleRoomDetails, handleEdit, handleDelete }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  return (
    <div className="manage-table">
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => (
                    <td key={index} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div className="entries">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="page-nav">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <i className="isax isax-arrow-left-2"></i>
          </button>
          <ul>
            {pageOptions.map((pageNum) => (
              <li key={pageNum} className={pageIndex === pageNum ? 'active' : ''}>
                <button onClick={() => gotoPage(pageNum)}>{pageNum + 1}</button>
              </li>
            ))}
          </ul>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <i className="isax isax-arrow-right-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTable;