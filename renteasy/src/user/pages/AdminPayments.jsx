import React, { useEffect, useState } from 'react';
import './AdminPayments.css';

export default function AdminPayments(){
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(()=>{ fetchPayments(); },[filter]);

  async function fetchPayments(){
    setLoading(true);
    try{
      const res = await fetch(`/api/payments?status=${filter}`);
      const d = await res.json();
      if (d.success) setPayments(d.payments);
    }catch(err){console.error(err)}
    setLoading(false);
  }

  async function approve(id){
    if (!confirm('Approve this payment?')) return;
    await fetch(`/api/payments/${id}/approve`,{method:'POST'});
    fetchPayments();
  }

  async function reject(id){
    const reason = prompt('Reason for rejection (optional)') || '';
    await fetch(`/api/payments/${id}/reject`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason})});
    fetchPayments();
  }

  return (
    <div className="admin-payments">
      <h2>Payment Verifications</h2>
      <div className="controls">
        <label>Filter: <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select></label>
        <button onClick={fetchPayments}>Refresh</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="payments-table">
          <thead><tr><th>Employee</th><th>Txn ID</th><th>Date</th><th>Amount</th><th>Screenshot</th><th>Actions</th></tr></thead>
          <tbody>
            {payments.map(p=> (
              <tr key={p._id} className={p.verified? 'approved':''}>
                <td>{p.employeeName} ({p.employeeId})</td>
                <td>{p.transactionId}</td>
                <td>{new Date(p.paymentDate).toLocaleString()}</td>
                <td>{p.amount || '—'}</td>
                <td>{p.screenshotPath ? <a href={`/${p.screenshotPath}`} target="_blank" rel="noreferrer">View</a> : '—'}</td>
                <td>
                  {!p.verified && <button onClick={()=>approve(p._id)}>Approve</button>}
                  {!p.verified && <button onClick={()=>reject(p._id)}>Reject</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
