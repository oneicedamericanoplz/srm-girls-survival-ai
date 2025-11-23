import { useState } from 'react'
export default function Mess(){
  const [score,setScore]=useState(3); const [stamina,setStamina]=useState(80);
  function submit(s){
    setScore(s);
    alert(`You rated ${s}/5 — saved locally.`);
  }
  return (
    <div style={{maxWidth:1000,margin:'24px auto',padding:20}}>
      <h2>Mess Menu — Rate & Win</h2>
      <div className='card' style={{marginTop:12}}>
        <h4>Today's Menu</h4>
        <ul className='muted'><li>Roti, Mystery Curry, Salad</li><li>Evening: Samosa & Chai</li></ul>
        <div style={{marginTop:8,display:'flex',gap:8}}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>submit(n)} className='btn'>{n}</button>
          ))}
        </div>
      </div>

      <div style={{marginTop:12}} className='card'>
        <h4>Rewards</h4>
        <p className='muted'>Collect 4+ ratings to unlock a Snack Token (+15 stamina).</p>
        <button className='btn' onClick={()=>{ if(score>=4){ setStamina(s=>Math.min(100,s+15)); alert('Redeemed +15 stamina'); } else alert('Need 4+ rating to redeem'); }}>Redeem Token</button>
      </div>
    </div>
  )
}
