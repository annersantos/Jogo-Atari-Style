// Nave do jogador: fundo da tela, apenas horizontal, tiro vertical rapido
window.Player = (function(){
  const W=480,H=640;
  const p={ x:W/2-20, y:H-80, w:40, h:36, speed:360, cooldown:0, fireRate:0.17, invuln:0, visible:true };
  function reset(){ p.x=W/2-p.w/2; p.y=H-80; p.cooldown=0; p.invuln=2; }
  function update(dt){
    const inp=window.Input.state;
    if(inp.left) p.x-=p.speed*dt;
    if(inp.right) p.x+=p.speed*dt;
    // drag touch: persegue dedo
    if(inp.touchX!==null && inp.touchX!==undefined){
      const target=inp.touchX-p.w/2;
      const diff=target-p.x;
      const maxStep=p.speed*1.4*dt;
      if(Math.abs(diff)<=maxStep) p.x=target;
      else p.x+=Math.sign(diff)*maxStep;
    }
    if(p.x<4) p.x=4; if(p.x+p.w>W-4) p.x=W-4-p.w;
    p.cooldown-=dt;
    if(p.invuln>0){ p.invuln-=dt; p.visible=Math.floor(p.invuln*12)%2===0; } else p.visible=true;
    const wantFire = inp.fireHeld || window.Input.consumeFirePressed();
    if(wantFire && p.cooldown<=0){
      if(window.Bullets.firePlayer(p.x+p.w/2, p.y-6)){
        p.cooldown=p.fireRate;
        window.AudioSys.laser();
      }
    }
  }
  function draw(ctx){
    if(!p.visible) return;
    window.Sprites.draw(ctx,'player',p.x,p.y,p.w,p.h);
  }
  function box(){ return { x:p.x, y:p.y, w:p.w, h:p.h }; }
  return { update, draw, reset, box, get x(){return p.x;}, get y(){return p.y;},
    get invuln(){return p.invuln;}, set invuln(v){p.invuln=v;} };
})();
