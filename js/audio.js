// SFX sintetizado via Web Audio: laser agudo + explosao crushing
window.AudioSys = (function(){
  let ctx=null, master=null, muted=false;
  function ensure(){
    if(ctx) { if(ctx.state==='suspended') ctx.resume(); return true; }
    try{
      const AC = window.AudioContext||window.webkitAudioContext;
      if(!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
      return true;
    }catch(e){ return false; }
  }
  function env(g,t0,a,peak,dur){
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(peak,t0+a);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  }
  function laser(){
    if(muted||!ensure()) return;
    const t0=ctx.currentTime;
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='square';
    o.frequency.setValueAtTime(1400,t0);
    o.frequency.exponentialRampToValueAtTime(180,t0+0.12);
    env(g,t0,0.005,0.6,0.13);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0+0.14);
  }
  function noiseBuffer(dur){
    const sr=ctx.sampleRate, buf=ctx.createBuffer(1,sr*dur,sr);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    return buf;
  }
  function explosion(){
    if(muted||!ensure()) return;
    const t0=ctx.currentTime;
    // crushing: noise + lowpass sweep + sub thump
    const src=ctx.createBufferSource();
    src.buffer=noiseBuffer(0.4);
    const f=ctx.createBiquadFilter();
    f.type='lowpass';
    f.frequency.setValueAtTime(2800,t0);
    f.frequency.exponentialRampToValueAtTime(110,t0+0.35);
    const g=ctx.createGain();
    env(g,t0,0.004,1.0,0.38);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0+0.4);
    const o=ctx.createOscillator(), g2=ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(130,t0);
    o.frequency.exponentialRampToValueAtTime(28,t0+0.3);
    env(g2,t0,0.004,0.9,0.32);
    o.connect(g2); g2.connect(master);
    o.start(t0); o.stop(t0+0.34);
  }
  function playerDown(){
    if(muted||!ensure()) return;
    const t0=ctx.currentTime;
    const src=ctx.createBufferSource();
    src.buffer=noiseBuffer(0.6);
    const f=ctx.createBiquadFilter();
    f.type='lowpass';
    f.frequency.setValueAtTime(3500,t0);
    f.frequency.exponentialRampToValueAtTime(80,t0+0.55);
    const g=ctx.createGain();
    env(g,t0,0.005,1.0,0.6);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0+0.62);
    const o=ctx.createOscillator(), g2=ctx.createGain();
    o.type='sawtooth';
    o.frequency.setValueAtTime(400,t0);
    o.frequency.exponentialRampToValueAtTime(40,t0+0.55);
    env(g2,t0,0.005,0.5,0.58);
    o.connect(g2); g2.connect(master);
    o.start(t0); o.stop(t0+0.6);
  }
  function levelClear(){
    if(muted||!ensure()) return;
    [660,880,1320].forEach((fr,i)=>{
      const t0=ctx.currentTime+i*0.11;
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='square'; o.frequency.value=fr;
      env(g,t0,0.005,0.4,0.1);
      o.connect(g); g.connect(master);
      o.start(t0); o.stop(t0+0.11);
    });
  }
  function toggleMute(){ muted=!muted; return muted; }
  function unlock(){ ensure(); }
  return { laser, explosion, playerDown, levelClear, toggleMute, unlock };
})();
