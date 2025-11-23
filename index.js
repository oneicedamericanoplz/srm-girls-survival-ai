import Link from 'next/link'
import Image from 'next/image'
export default function Home(){
  return (
    <div style={{maxWidth:1100,margin:'24px auto',padding:20}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:56,height:56,borderRadius:28,overflow:'hidden'}}>
            <Image src='https://m.media-amazon.com/images/M/MV5BNzBjYWUyYjYtZmQ1Mi00NzhkLWJmNGEtZjI3OGM1NzcxMWU2XkEyXkFqcGc@._V1_.jpg' width={56} height={56} alt='comic'/>
          </div>
          <div>
            <h1 style={{margin:0}}>SRM Girls Survival</h1>
            <div className='muted'>comic-guide · pastel spring · sarcastic AI</div>
          </div>
        </div>
        <nav style={{display:'flex',gap:8}}>
          <Link href='/chat'><button className='btn'>Chat AI</button></Link>
          <Link href='/mess'><button className='btn'>Mess Game</button></Link>
          <Link href='/map'><button className='btn'>Map</button></Link>
        </nav>
      </header>

      <main style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20}}>
        <section className='card'>
          <h2>Welcome — Game Mode</h2>
          <p className='muted'>A playful, comic-style guide built for girls at SRM. Use the chat for live help, play the mess game, and check the map for safe shortcuts.</p>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <Link href='/chat'><button className='btn'>Talk to Sumi</button></Link>
            <Link href='/mess'><button className='btn'>Play Mess</button></Link>
            <Link href='/map'><button className='btn'>Open Map</button></Link>
          </div>
        </section>

        <aside>
          <div className='card' style={{marginBottom:12}}>
            <Image src='https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&q=60' width={320} height={180} alt='potheri'/>
            <h4 style={{marginTop:8}}>Potheri Lake</h4>
            <div className='muted'>Daytime strolls = yes. Nighttime dares = no.</div>
          </div>

          <div className='card halftone'>
            <h4>Quick Cheats</h4>
            <ul className='muted'>
              <li>Beat queues: Canteen shortcut at 8:30 AM.</li>
              <li>Safety: Group walks after 8 PM.</li>
              <li>Weather: Carry a raincoat in monsoon.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
