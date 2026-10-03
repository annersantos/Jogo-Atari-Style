// Pooling de projeteis: player (rapido) + inimigo (lento, 1 por vez)
window.Bullets = (function(){
  const W=480,H=640;
  const playerPool=[], enemyPool=[];
  for(let i=0;i<30;i++) playerPool.push({x:0,y:0,w:4,h:14,vy:0,active:false});
  for(let i=0;i<8;i++) enemyPool.push({x:0,y:0,w:6,h:12,vy:0,active:false});
  function firePlayer(x,y){
    for(const b of playerPool){
      if(!b.active){ b.active=true; b.x=x-b.w/2; b.y=y; b.vy=-640; return true; }
    }
    return false;
  }
  function fireEnemy(x,y,speed){
    for(const b of enemyPool){
      if(!b.active){ b.active=true; b.x=x-b.w/2; b.y=y; b.vy=speed||190; return true; }
    }
    return false;
  }
  function enemyActiveCount(){ let n=0; for(const b of enemyPool) if(b.active) n++; return n; }
  function update(dt){
    for(const b of playerPool){
      if(!b.active) continue;
      b.y += b.vy*dt;
      if(b.y+b.h<0) b.active=false;
    }
    for(const b of enemyPool){
      if(!b.active) continue;
      b.y += b.vy*dt;
      if(b.y>H) b.active=false;
    }
  }
  function draw(ctx){
    for(const b of playerPool){
      if(!b.active) continue;
      ctx.fillStyle='#FFFF33';
      ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle='#FFFFFF';
      ctx.fillRect(b.x,b.y, b.w, 4);
    }
    for(const b of enemyPool){
      if(!b.active) continue;
      ctx.fillStyle='#FF2244';
      ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle='#FFAAAA';
      ctx.fillRect(b.x+1,b.y+2,2,4);
    }
  }
  function clear(){ for(const b of playerPool) b.active=false; for(const b of enemyPool) b.active=false; }
  return { playerPool, enemyPool, firePlayer, fireEnemy, enemyActiveCount, update, draw, clear };
})();
