import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Styles ---
const styles = `
  :root {
    --bg: #121212;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0a0;
    --accent-red: #ff4757;
    --accent-blue: #2ed573;
    --accent-yellow: #ffa502;
    --accent-purple: #5352ed;
    --card-bg: #1e1e1e;
    --font-mono: 'Courier New', Courier, monospace;
    --font-sans: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  * { box-sizing: border-box; }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-sans);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }

  section {
    padding: 80px 0;
    border-bottom: 1px solid #333;
  }

  h1, h2, h3 {
    font-family: var(--font-mono);
    color: #fff;
  }

  h1 { font-size: 3rem; margin-bottom: 0.5rem; letter-spacing: -1px; }
  h2 { font-size: 2rem; color: var(--accent-red); margin-top: 0; }
  h3 { font-size: 1.5rem; margin-bottom: 10px; }

  p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1.5rem; }

  /* Hero */
  .hero {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
  }
  .hero-tag {
    background: var(--accent-red);
    color: white;
    padding: 5px 15px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
    display: inline-block;
  }

  /* Suspect Cards */
  .grid-5 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 40px;
  }
  .card {
    background: var(--card-bg);
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #333;
    transition: transform 0.3s ease, border-color 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .card:hover {
    transform: translateY(-10px);
    border-color: var(--accent-blue);
  }
  .card.villain:hover { border-color: var(--accent-red); }
  .card-icon { font-size: 3rem; margin-bottom: 15px; }
  .card-stat {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #333;
    font-family: var(--font-mono);
  }

  /* Interactive Game */
  .game-container {
    background: #1a1a1a;
    border: 2px dashed #444;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    max-width: 600px;
    margin: 40px auto;
  }
  .game-snippet {
    background: #000;
    padding: 20px;
    font-family: var(--font-mono);
    color: var(--accent-yellow);
    margin: 20px 0;
    border-radius: 8px;
    font-size: 1.1rem;
  }
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    margin: 0 10px;
    transition: opacity 0.2s;
  }
  .btn-pos { background: var(--accent-blue); color: #000; }
  .btn-neg { background: var(--accent-red); color: white; }
  .btn:hover { opacity: 0.9; }

  /* Charts */
  .chart-wrapper {
    background: #000;
    padding: 20px;
    border-radius: 12px;
    margin: 40px 0;
    height: 300px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
  }
  .bar {
    width: 60px;
    background: #444;
    transition: height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 8px 8px 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .bar-label {
    position: absolute;
    bottom: -30px;
    color: #888;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    text-align: center;
    width: 100px;
  }
  .bar-value {
    margin-bottom: 10px;
    font-weight: bold;
    color: #fff;
  }

  /* Network Graph placeholder */
  .network-viz {
    width: 100%;
    height: 400px;
    background: #080808;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .node {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    background: #333;
    border: 2px solid #555;
    z-index: 2;
    transition: all 0.5s;
    cursor: pointer;
  }
  .node.center { width: 100px; height: 100px; background: var(--accent-blue); color: #000; z-index: 10; }
  .node.angry { background: var(--accent-red); color: #fff; }
  
  .connection {
    position: absolute;
    height: 2px;
    background: #333;
    transform-origin: 0 50%;
    z-index: 1;
  }

  /* Conclusion */
  .law-card {
    border-left: 4px solid var(--accent-yellow);
    padding: 20px;
    background: #222;
    margin-bottom: 20px;
  }
`;

// --- Components ---

const SuspectCard = ({ name, role, icon, complexity, desc, isVillain }) => (
  <div className={`card ${isVillain ? 'villain' : ''}`}>
    <div className="card-icon">{icon}</div>
    <h3>{role}</h3>
    <div style={{color: '#888', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '10px'}}>{name}</div>
    <p style={{fontSize: '0.95rem'}}>{desc}</p>
    <div className="card-stat">
      <span>Complexity Score:</span>
      <span style={{color: isVillain ? 'var(--accent-red)' : 'var(--accent-blue)', fontWeight: 'bold'}}>{complexity}/10</span>
    </div>
  </div>
);

const SentimentGame = () => {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions = [
    {
      text: "I find your methodology profoundly inadequate and your conclusions demonstrably erroneous.",
      sentiment: "Negative",
      complexity: "High",
      type: "Angry"
    },
    {
      text: "This solution is incredibly comprehensive and solved my issue immediately, thank you!",
      sentiment: "Positive",
      complexity: "Medium",
      type: "Happy"
    },
    {
      text: "While I understand your perspective, the fundamental premise relies on flawed axioms.",
      sentiment: "Negative",
      complexity: "High",
      type: "Angry"
    }
  ];

  const handleGuess = (guess: string) => {
    const q = questions[step];
    if (guess === q.sentiment) {
      setFeedback(`✅ Correct! Even though the language was ${q.complexity}, it was ${q.sentiment}.`);
    } else {
      setFeedback(`❌ Wrong! This was actually ${q.sentiment}. High complexity doesn't mean polite!`);
    }
  };

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setFeedback(null);
    } else {
      setFeedback("Game Over! You see? It's hard to tell based on complexity alone.");
    }
  };

  const q = questions[step];

  return (
    <div className="game-container">
      <h3>🕵️ Detective Challenge: Guess the Sentiment</h3>
      <p>Read the Reddit comment below. Is it Positive or Negative?</p>
      
      <div className="game-snippet">
        "{q.text}"
      </div>
      
      {!feedback ? (
        <div>
          <button className="btn btn-pos" onClick={() => handleGuess('Positive')}>Positive 😊</button>
          <button className="btn btn-neg" onClick={() => handleGuess('Negative')}>Negative 😡</button>
        </div>
      ) : (
        <div>
          <p style={{fontWeight: 'bold', color: feedback.startsWith('✅') ? 'var(--accent-blue)' : 'var(--accent-red)'}}>{feedback}</p>
          {step < questions.length - 1 ? (
             <button className="btn" style={{background: '#fff', color: '#000'}} onClick={next}>Next Case →</button>
          ) : (
             <p style={{fontFamily: 'monospace', color: '#aaa'}}>Investigation Complete.</p>
          )}
        </div>
      )}
    </div>
  );
};

const SimpleBarChart = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="chart-wrapper">
      <div className="bar" style={{height: show ? '200px' : '0px', background: 'var(--accent-blue)'}}>
        <span className="bar-value">0.51</span>
        <span className="bar-label">C1: The Helpers (Positive)</span>
      </div>
      <div className="bar" style={{height: show ? '205px' : '0px', background: 'var(--accent-red)'}}>
        <span className="bar-value">0.52</span>
        <span className="bar-label">C4: Firestarters (Toxic)</span>
      </div>
      <div style={{position: 'absolute', top: 20, right: 20, color: '#666', fontSize: '0.8rem'}}>
        Metric: Linguistic Complexity (0-1)
      </div>
    </div>
  );
};

const NetworkGraph = () => {
  return (
    <div className="network-viz">
      {/* Central Node C1 */}
      <div className="node center" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        C1
      </div>
      <div style={{position:'absolute', top:'65%', left: '50%', transform: 'translateX(-50%)', color: '#aaa', fontSize:'0.8rem'}}>The Helpers</div>

      {/* C4 Node (Angry) */}
      <div className="node angry" style={{top: '20%', left: '20%'}}>
        C4
      </div>
      <div style={{position:'absolute', top:'15%', left: '20%', color: '#aaa', fontSize:'0.8rem'}}>Firestarters</div>

      {/* Line representing the strong connection */}
      <svg style={{position: 'absolute', top:0, left:0, width: '100%', height:'100%', pointerEvents:'none'}}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#ff4757" />
          </marker>
        </defs>
        {/* Connection C4 -> C1 */}
        <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#ff4757" strokeWidth="4" markerEnd="url(#arrow)" strokeDasharray="5,5" />
      </svg>
      
      {/* Other Nodes */}
      <div className="node" style={{top: '20%', right: '20%', background: '#444'}}>C3</div>
      <div className="node" style={{bottom: '20%', right: '30%', background: '#444'}}>C2</div>
      <div className="node" style={{bottom: '30%', left: '20%', background: '#444'}}>C0</div>
    </div>
  )
}

const App = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        {/* Act I: The Setup */}
        <section className="hero">
          <span className="hero-tag">Case File #2025</span>
          <h1>The Reddit Socialite Effect</h1>
          <p>Why Angry People Don't Shout in ALL CAPS <br/> (A Data Detective Story)</p>
          <div style={{marginTop: '40px', fontSize: '2rem'}}>👇</div>
        </section>

        {/* Act II: The Suspects */}
        <section>
          <h2>Act I: The Lineup</h2>
          <p>We analyzed 1 million interactions. Five distinct "personalities" emerged. Which one is the toxic troll?</p>
          <div className="grid-5">
            <SuspectCard 
              name="C0" 
              role="The Novelist" 
              icon="🎭" 
              desc="Writes walls of text. Loves stories. Found in r/WritingPrompts."
              complexity={8} 
              isVillain={false} 
            />
            <SuspectCard 
              name="C1" 
              role="The Helper" 
              icon="😊" 
              desc="Step-by-step guides. Polite. Found in r/techsupport."
              complexity={5} 
              isVillain={false} 
            />
            <SuspectCard 
              name="C3" 
              role="The Analyst" 
              icon="🤓" 
              desc="Measured discourse. Big words. Found in r/OutOfTheLoop."
              complexity={9} 
              isVillain={false} 
            />
            <SuspectCard 
              name="C4" 
              role="The Firestarter" 
              icon="😡" 
              desc="Emotional intensity. Drama. Found in r/SubredditDrama."
              complexity={6} 
              isVillain={true} 
            />
          </div>
        </section>

        {/* Act III: The Investigation */}
        <section>
          <h2>Act II: The Clue That Didn't Fit</h2>
          <p>We assumed angry people used simpler language (shouting, slurs, short sentences). We were wrong.</p>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center'}}>
            <div style={{flex: 1, minWidth: '300px'}}>
              <h3>The Complexity Paradox</h3>
              <p>Look at the complexity scores of the "Helpers" (the nicest people) vs the "Firestarters" (the angriest).</p>
              <p style={{borderLeft: '4px solid var(--accent-red)', paddingLeft: '15px', color: '#fff'}}>
                <strong>The Twist:</strong> They are statistically identical. Toxic users use complex grammar, just like the helpful ones.
              </p>
            </div>
            <div style={{flex: 1, minWidth: '300px'}}>
              <SimpleBarChart />
            </div>
          </div>
        </section>

        {/* Interactive Game */}
        <section>
          <h2>Act III: Can You Beat the AI?</h2>
          <p>Our machine learning models failed to predict sentiment based on sentence structure alone. Can you do better?</p>
          <SentimentGame />
        </section>

        {/* Act IV: The Network */}
        <section>
          <h2>Act IV: The Socialite Effect</h2>
          <p>If they aren't simpler, how do we find them? We looked at <strong>who they talk to</strong>.</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <NetworkGraph />
            <p>
              <strong>The Reveal:</strong> The Firestarters (C4) don't shout into the void. They specifically target The Helpers (C1). 
              It's like a cocktail party: The dramatic guests seek out the popular hosts who will listen to them.
            </p>
          </div>
        </section>

        {/* Conclusion */}
        <section style={{borderBottom: 'none', paddingBottom: '100px'}}>
          <h2>The Verdict</h2>
          <p>What we learned from 1 million posts:</p>
          
          <div className="law-card">
            <h3>Law #1: The Vocabulary Principle</h3>
            <p>It's not <em>how</em> you build sentences (complexity). It's <em>which</em> words you put in them (emotion).</p>
          </div>
          
          <div className="law-card" style={{borderLeftColor: 'var(--accent-blue)'}}>
            <h3>Law #2: The Socialite Principle</h3>
            <p>Angry people don't want to be alone. They want an audience. They target the most helpful nodes in the network.</p>
          </div>

          <div style={{marginTop: '60px', textAlign: 'center', opacity: 0.6}}>
            <p>Data Story Project • Milestone P3 • 2025</p>
          </div>
        </section>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);