import { useState } from 'react'
export default function Chat(){
  const [q,setQ]=useState(''); const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(false); const [error,setError]=useState(null);
  async function ask(e){
    e?.preventDefault();
    if(!q.trim()) return;
    setLoading(true); setError(null);
    try{
      const res = await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q})});
      const json = await res.json();
      if(!res.ok) throw new Error(json.error||'AI error');
      setHistory(h => [{q, a: json.answer}, ...h]);
    }catch(err){ setError(err.message); setHistory(h=>[{q,a: 'Fallback: network issue or AI error.'},...h]); }
    finally{ setLoading(false); setQ(''); }
  }
  return (
    <div style={{maxWidth:1000,margin:'24px auto',padding:20}}>
      <h2>Ask Sumi (AI Chat)</h2>
      <form onSubmit={ask} style={{display:'flex',gap:8,marginTop:12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Ask about mess, lake, maps, dress code...' style={{flex:1,padding:10,borderRadius:8,border:'1px solid #eee'}} />
        <button className='btn' onClick={ask}>{loading? 'Thinking...':'Ask'}</button>
      </form>
      {error && <div style={{color:'crimson',marginTop:8}}>Error: {error}</div>}
      <div style={{marginTop:16}}>
        {history.map((h,idx)=>(
          <div key={idx} className='card' style={{marginBottom:8}}>
            <div className='muted'>Q: {h.q}</div>
            <div><strong>A:</strong> {h.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
