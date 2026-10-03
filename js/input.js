// Abstracao de input: teclado + touch + drag no canvas
window.Input = (function(){
  const st = { left:false, right:false, fireHeld:false, touchX:null, firePressed:false };
  function init(canvas, onFirstGesture){
    window.addEventListener('keydown',e=>{
      if(['ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
      if(e.code==='ArrowLeft'||e.code==='KeyA') st.left=true;
      if(e.code==='ArrowRight'||e.code==='KeyD') st.right=true;
      if(e.code==='Space') { if(!st.fireHeld) st.firePressed=true; st.fireHeld=true; }
      if(e.code==='KeyM' && window.AudioSys) window.AudioSys.toggleMute();
      if(typeof onFirstGesture==='function') onFirstGesture();
      if(typeof onFirstGesture==='function' && (e.code==='Enter'||e.code==='Space')) { /* main trata start */ }
    });
    window.addEventListener('keyup',e=>{
      if(e.code==='ArrowLeft'||e.code==='KeyA') st.left=false;
      if(e.code==='ArrowRight'||e.code==='KeyD') st.right=false;
      if(e.code==='Space') st.fireHeld=false;
    });
    const bl=document.getElementById('btn-left');
    const br=document.getElementById('btn-right');
    const bf=document.getElementById('btn-fire');
    function bindHold(el,prop){
      const on=e=>{ e.preventDefault(); st[prop]=true; if(typeof onFirstGesture==='function') onFirstGesture(); };
      const off=e=>{ e.preventDefault(); st[prop]=false; };
      el.addEventListener('pointerdown',on);
      el.addEventListener('pointerup',off);
      el.addEventListener('pointercancel',off);
      el.addEventListener('pointerleave',off);
    }
    if(bl) bindHold(bl,'left');
    if(br) bindHold(br,'right');
    if(bf){
      bf.addEventListener('pointerdown',e=>{ e.preventDefault(); st.fireHeld=true; st.firePressed=true; if(typeof onFirstGesture==='function') onFirstGesture(); });
      const off=e=>{ e.preventDefault(); st.fireHeld=false; };
      bf.addEventListener('pointerup',off);
      bf.addEventListener('pointercancel',off);
    }
    // drag no canvas: move + autofire enquanto toca
    canvas.addEventListener('pointerdown',e=>{
      if(typeof onFirstGesture==='function') onFirstGesture();
      st.touchX = xToCanvas(e,canvas);
      st.fireHeld = true; st.firePressed = true;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove',e=>{
      if(st.touchX!==null) st.touchX = xToCanvas(e,canvas);
    });
    const end=e=>{ st.touchX=null; st.fireHeld = document.getElementById('btn-fire') ? st.fireHeld && false : false; st.fireHeld=false; };
    canvas.addEventListener('pointerup',end);
    canvas.addEventListener('pointercancel',end);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
  }
  function xToCanvas(e,canvas){
    const r=canvas.getBoundingClientRect();
    const nx=(e.clientX-r.left)/r.width;
    return nx*480;
  }
  function consumeFirePressed(){ const v=st.firePressed; st.firePressed=false; return v; }
  return { state:st, init, consumeFirePressed };
})();
