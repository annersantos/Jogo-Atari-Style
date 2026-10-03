// Inimigos: fileiras 2x4, zigue-zague + descida lenta, 1 tiro por vez
window.Enemies = (function(){
  const W=480;
  const list=[];
  const formation={ x:W/2, y:80, t:0, amp:110, freq:0.8, speed:32, targetY:80 };
  let fireTimer=0, def=null;
  function spawnLevel(level){
    list.length=0;
    def = window.Levels.get(level);
    formation.t=0; formation.x=W/2; formation.y=70;
    formation.speed=def.speed;
    formation.amp=Math.max(60,120-level*6);
    formation.freq=0.7+level*0.06;
    fireTimer=def.fireInterval;
    const spacing=64;
    for(let slot=0;slot<8;slot++){
      const col=slot%4, row=Math.floor(slot/4);
      list.push({ slot, col, row, x:0, y:0, w:40, h:30, alive:true, phase:Math.random()*Math.PI*2, sprite:def.sprite });
    }
    layout(0);
  }
  function layout(dt){
    formation.t+=dt;
    formation.x = W/2 + Math.sin(formation.t*formation.freq)*formation.amp;
    // descida lenta ate ~250, depois flutua
    if(formation.y<250) formation.y += formation.speed*dt;
    else formation.y = 250 + Math.sin(formation.t*0.6)*22;
    const spacing=64;
    for(const e of list){
      if(!e.alive) continue;
      e.x = formation.x + (e.col-1.5)*spacing + Math.sin(formation.t*2.1+e.phase)*12 - e.w/2;
      e.y = formation.y + e.row*40 + Math.cos(formation.t*1.6+e.phase)*8;
      // clamp lateral
      if(e.x<8) e.x=8; if(e.x+e.w>W-8) e.x=W-8-e.w;
    }
  }
  function update(dt){
    if(list.length===0) return;
    layout(dt);
    fireTimer-=dt;
    if(fireTimer<=0){
      // regra: poucos projeteis, um de cada vez
      if(window.Bullets.enemyActiveCount()===0){
        const alive=list.filter(e=>e.alive);
        if(alive.length>0){
          const s=alive[(Math.random()*alive.length)|0];
          window.Bullets.fireEnemy(s.x+s.w/2, s.y+s.h, def.bulletSpeed);
        }
        fireTimer=def.fireInterval*(0.8+Math.random()*0.4);
      } else {
        fireTimer=0.2;
      }
    }
  }
  function draw(ctx){
    for(const e of list){
      if(!e.alive) continue;
      window.Sprites.draw(ctx,e.sprite,e.x,e.y,e.w,e.h);
    }
  }
  function aliveCount(){ let n=0; for(const e of list) if(e.alive) n++; return n; }
  function clear(){ list.length=0; }
  return { list, spawnLevel, update, draw, aliveCount, clear, get def(){return def;} };
})();
