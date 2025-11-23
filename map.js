export default function Map(){
  const shortcuts = [
    { name: 'Canteen Shortcut', info: 'Cut through the west gate at 8:30 AM to avoid queues.' },
    { name: 'Safe Route Home', info: 'Well-lit path near admin building. Walk with buddies after 8 PM.' },
    { name: 'Laundry Drop', info: 'Use the ground floor vendor between 10–5.' },
  ];
  return (
    <div style={{maxWidth:1000,margin:'24px auto',padding:20}}>
      <h2>Potheri Map & Safe Shortcuts</h2>
      <div className='card' style={{marginTop:12}}>
        <h4>Campus Map (comic)</h4>
        <img src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800' alt='campus' style={{width:'100%',borderRadius:8,marginTop:8}} />
      </div>
      <div style={{marginTop:12}} className='card'>
        <h4>Shortcuts</h4>
        <ul className='muted'>
          {shortcuts.map((s,i)=>(<li key={i}><strong>{s.name}:</strong> {s.info}</li>))}
        </ul>
      </div>
    </div>
  )
}
