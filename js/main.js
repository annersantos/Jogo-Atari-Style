// Game: loop fixo, estados, colisao arcade, energia, fases, particulas, shake
window.Game = (function(){
  const W=480,H=640;
  let canvas,ctx;
  let state='menu';
  let score=0, lives=4, level=1, hi=0;
  const START_LIVES=4, BONUS_LIFE_EVERY=5;
  let particles=[];
  let floaters=[];
  let shake=0, levelDelay=0, paused=false;
  try{ hi=parseInt(localStorage.getItem('megamania_hi')||'0',10)||0; }catch(e){ hi=0; }

  function init(){
    canvas=document.getElementById('game');
    ctx=canvas.getContext('2d');
    ctx.imageSmoothingEnabled=false;
    window.UI.init();
    window.Input.init(canvas,()=>window.AudioSys.unlock());
    window.UI.menu(hi);
    window.UI.hud(0,hi,START_LIVES,1,100);
    window.addEventListener('keydown',e=>{
      if(e.code==='Enter'){ if(state==='menu'||state==='over') start(); }
      if(e.code==='KeyP'||e.code==='Escape'){ togglePause(); }
    });
    const btnPause=document.getElementById('btn-pause');
    if(btnPause) btnPause.addEventListener('click',e=>{ e.preventDefault(); window.AudioSys.unlock(); togglePause(); });
    const btnPauseTouch=document.getElementById('btn-pause-touch');
    if(btnPauseTouch) btnPauseTouch.addEventListener('pointerdown',e=>{ e.preventDefault(); window.AudioSys.unlock(); togglePause(); });
    document.addEventListener('visibilitychange',()=>{ if(document.hidden&&state==='playing') togglePause(true); });
    // clique no overlay fora do botao tambem desbloqueia audio
    document.getElementById('overlay').addEventListener('pointerdown',()=>window.AudioSys.unlock());
    let last=performance.now();
    requestAnimationFrame(function frame(now){
      let dt=(now-last)/1000; last=now;
      if(dt>0.033) dt=0.033;
      if(state==='playing'&&!paused) update(dt);
      render();
      requestAnimationFrame(frame);
    });
  }
  function start(){
    score=0; lives=START_LIVES; level=1;
    window.Bullets.clear(); particles=[]; floaters=[];
    window.Energy.reset();
    window.Player.reset();
    window.Enemies.spawnLevel(level);
    state='playing'; paused=false;
    window.UI.hide();
    const d=window.Levels.get(level);
    window.UI.levelIntro(level,d.name);
    window.AudioSys.levelClear();
  }
  function nextLevel(){
    const completed=level;
    level++;
    // vida bonus somente a cada 5 fases completas (5, 10, 15...)
    let bonusLife = (completed%BONUS_LIFE_EVERY===0);
    if(bonusLife){
      lives++;
      window.AudioSys.oneUp && window.AudioSys.oneUp();
      floaters.push({x:W/2, y:H/2-60, text:'1UP +1 VIDA', life:2.2, max:2.2});
      burst(W/2,H/2-40,20,'#00FF00');
    }
    window.Energy.reset();
    window.Bullets.clear();
    window.Player.reset();
    window.Player.invuln=2;
    window.Enemies.spawnLevel(level);
    const d=window.Levels.get(level);
    window.UI.levelIntro(level,d.name,bonusLife);
    window.AudioSys.levelClear();
  }
  function loseLife(reason){
    lives--;
    if(lives<0) lives=0;
    window.UI.flash();
    burst(window.Player.x+20,window.Player.y+18,26,'#FF5533');
    burst(window.Player.x+20,window.Player.y+18,14,'#FFFFFF');
    shake=0.35;
    window.AudioSys.playerDown();
    if(lives<=0){ gameOver(); return; }
    window.Energy.reset();
    window.Bullets.clear();
    window.Player.reset();
  }
  function gameOver(){
    state='over';
    if(score>hi){ hi=score; try{ localStorage.setItem('megamania_hi',String(hi)); }catch(e){} }
    window.UI.gameOver(score,hi);
  }
  function addScore(points){
    score+=points;
  }
  function togglePause(force){
    if(state!=='playing') return;
    if(typeof force==='boolean') paused=force;
    else paused=!paused;
    if(paused){
      window.UI.show(`<h2>⏸ PAUSADO</h2><p>SCORE ${score}<br>VIDAS ${lives} • FASE ${level}<br><br>P / ESC ou botão para continuar</p><button id="resume-btn">CONTINUAR</button>`);
      const b=document.getElementById('resume-btn');
      if(b) b.addEventListener('click',()=>{ paused=false; window.UI.hide(); });
    }
    else { window.UI.hide(); }
  }
  function burst(x,y,n,color){
    for(let i=0;i<n;i++){
      const a=Math.random()*Math.PI*2, sp=60+Math.random()*220;
      particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0.4+Math.random()*0.4,max:0.8,size:2+Math.random()*3,color});
    }
  }
  function update(dt){
    // energia drena sempre
    window.Energy.update(dt);
    if(window.Energy.value<=0){ loseLife('fuel'); if(state!=='playing') return; }
    window.Player.update(dt);
    window.Enemies.update(dt);
    window.Bullets.update(dt);
    // particulas
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.life-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=0.98; p.vy*=0.98;
      if(p.life<=0) particles.splice(i,1);
    }
    // textos flutuantes (1UP etc)
    for(let i=floaters.length-1;i>=0;i--){
      floaters[i].life-=dt; floaters[i].y-=30*dt;
      if(floaters[i].life<=0) floaters.splice(i,1);
    }
    if(shake>0) shake-=dt;
    checkCollisions();
    // onda completa destruida -> bonus + refill
    if(window.Enemies.aliveCount()===0){
      addScore(100*level);
      window.Energy.refill(40);
      window.AudioSys.levelClear();
      levelDelay+=dt;
      if(levelDelay>1.2){ levelDelay=0; nextLevel(); }
    } else levelDelay=0;
    window.UI.hud(score,hi,lives,level,window.Energy.value);
  }
  function checkCollisions(){
    const C=window.Collisions;
    const pb=window.Bullets.playerPool;
    const eb=window.Bullets.enemyPool;
    const pbox=C.hitbox(window.Player.box(),0.15,0.15);
    // tiro player x inimigos
    for(const b of pb){
      if(!b.active) continue;
      const bb={x:b.x,y:b.y,w:b.w,h:b.h};
      for(const e of window.Enemies.list){
        if(!e.alive) continue;
        const eh=C.hitbox(e,0.18,0.18);
        if(C.overlap(bb,eh)){
          b.active=false; e.alive=false;
          const d=window.Enemies.def||window.Levels.get(level);
          addScore(d.enemyScore||20);
          burst(e.x+e.w/2,e.y+e.h/2,12,'#FFD23F');
          burst(e.x+e.w/2,e.y+e.h/2,8,'#FF2E63');
          shake=Math.max(shake,0.12);
          window.AudioSys.explosion();
          break;
        }
      }
    }
    if(window.Player.invuln>0) return;
    // tiro inimigo x player
    for(const b of eb){
      if(!b.active) continue;
      if(C.overlap({x:b.x,y:b.y,w:b.w,h:b.h},pbox)){ b.active=false; loseLife('hit'); return; }
    }
    // contato inimigo x player destroi nave
    for(const e of window.Enemies.list){
      if(!e.alive) continue;
      const eh=C.hitbox(e,0.15,0.15);
      if(C.overlap(pbox,eh)){ loseLife('crash'); return; }
    }
  }
  function render(){
    ctx.save();
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,W,H);
    // estrelas de fundo
    ctx.fillStyle='#222';
    const t=performance.now()/1000;
    for(let i=0;i<40;i++){
      const sx=(i*97)%W, sy=(i*57+t*20)%H;
      ctx.fillRect(sx,sy,2,2);
    }
    if(shake>0){
      ctx.translate((Math.random()-0.5)*8*shake*3,(Math.random()-0.5)*8*shake*3);
    }
    if(state==='playing'||state==='over'){
      window.Enemies.draw(ctx);
      window.Bullets.draw(ctx);
      if(state==='playing') window.Player.draw(ctx);
      // particulas
      for(const p of particles){
        ctx.globalAlpha=Math.max(0,p.life/p.max);
        ctx.fillStyle=p.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
      }
      ctx.globalAlpha=1;
      // textos flutuantes (1UP, etc)
      ctx.textAlign='center';
      for(const f of floaters){
        ctx.globalAlpha=Math.max(0,Math.min(1,f.life/f.max*1.5));
        ctx.font='bold 22px "Courier New",monospace';
        ctx.fillStyle='#000';
        ctx.fillText(f.text,f.x+2,f.y+2);
        ctx.fillStyle='#00FF00';
        ctx.fillText(f.text,f.x,f.y);
      }
      ctx.globalAlpha=1;
      // linha da nave
      ctx.strokeStyle='#0a0a0a';
    }
    ctx.restore();
  }
  document.addEventListener('DOMContentLoaded',init);
  return { start, togglePause, get state(){return state;}, get paused(){return paused;}, get lives(){return lives;} };
})();
