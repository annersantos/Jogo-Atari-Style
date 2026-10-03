// Barra de energia: dreno constante, refill por onda, renew por fase
window.Energy = (function(){
  const o = { value:100, max:100, drainPerSec:3.6 };
  function update(dt){ o.value -= o.drainPerSec*dt; if(o.value<0) o.value=0; }
  function refill(a){ o.value=Math.min(o.max,o.value+a); }
  function reset(){ o.value=o.max; }
  function setDrain(v){ o.drainPerSec=v; }
  return { ...o, update, refill, reset, setDrain,
    get value(){ return o.value; }, set value(v){ o.value=v; },
    get drain(){ return o.drainPerSec; } };
})();
