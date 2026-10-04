// HUD + overlay menu/gameover/fase
window.UI = (function(){
  let elScore,elHi,elLives,elLevel,elFill,elNum,elOverlay,elFlash;
  function init(){
    elScore=document.getElementById('score');
    elHi=document.getElementById('hi');
    elLives=document.getElementById('lives');
    elLevel=document.getElementById('level');
    elFill=document.getElementById('energy-fill');
    elNum=document.getElementById('energy-num');
    elOverlay=document.getElementById('overlay');
    elFlash=document.getElementById('flash');
  }
  function pad(n){ return String(Math.max(0,n|0)).padStart(6,'0'); }
  function hud(score,hi,lives,level,energy){
    elScore.textContent=pad(score);
    elHi.textContent=pad(hi);
    elLives.textContent=lives;
    elLevel.textContent=level;
    elNum.textContent=Math.ceil(energy);
    elFill.style.width=energy+'%';
    elFill.classList.toggle('low',energy<40);
    elFill.classList.toggle('crit',energy<15);
  }
  function show(html){ elOverlay.innerHTML=html; elOverlay.classList.remove('hidden'); wireButtons(); }
  function hide(){ elOverlay.classList.add('hidden'); }
  function wireButtons(){
    const b=document.getElementById('start-btn');
    if(b) b.addEventListener('click',()=>{ window.AudioSys.unlock(); window.Game.start(); });
  }
  function menu(hi){
    show(`<h1>MEGAMANIA</h1><h2>SHMUP 8-BIT</h2>
    <p>Mova só na horizontal e destrua a onda completa<br>para recarregar a ENERGIA.<br><br>
    🍔 F1 Hambúrguer • 🍪 F2 Bolacha • ♨️ F3 Ferro<br>🎀 F4 Gravata • 💎 F5 Diamante<br><br>
    +1 VIDA BÔNUS a cada 5 fases (começa com 4)<br><br>
    Desktop: ← → / A D + ESPAÇO<br>Mobile: arraste + FOGO<br>P / ESC ou botão ⏸ pausa<br>HI-SCORE: ${pad(hi)}</p>
    <button id="start-btn">INICIAR</button>`);
  }
  function levelIntro(level,name,bonusLife){
    show(`<h2>FASE ${level}</h2><h1>${name}</h1><p>ENERGIA RENOVADA${bonusLife?'<br>🎁 +1 VIDA BÔNUS!':''}</p>`);
    setTimeout(()=>{
      // nao esconde a tela de PAUSADO se o jogador pausou durante a intro
      if(window.Game && window.Game.paused) return;
      if(window.Game && window.Game.state!=='playing') return;
      hide();
    },1600);
  }
  function gameOver(score,hi){
    show(`<h1>GAME OVER</h1><p>SCORE ${pad(score)}<br>HI ${pad(hi)}</p><button id="start-btn">JOGAR DE NOVO</button>`);
  }
  function pause(){ show(`<h2>PAUSADO</h2><button id="start-btn">CONTINUAR</button>`); }
  function flash(){ elFlash.style.opacity=0.7; setTimeout(()=>elFlash.style.opacity=0,80); }
  return { init, hud, show, hide, menu, levelIntro, gameOver, pause, flash };
})();
