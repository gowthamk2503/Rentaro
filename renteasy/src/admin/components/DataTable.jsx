import React from 'react';

const DataTable = ({ data, columns }) => {
  if (!Array.isArray(data)) {
    return <p>Error: Data is not an array.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, idx) => <th key={idx}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col, i) => <td key={i}>{row[col]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
