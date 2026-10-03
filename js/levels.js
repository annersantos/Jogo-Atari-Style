// Definicao de fases: sprite, nome, velocidade, tiro, score
window.Levels = (function(){
  const defs = [
    { sprite:'hamburger', name:'HAMBÚRGUERES', speed:32,  fireInterval:1.5,  enemyScore:20,  bulletSpeed:170 },
    { sprite:'cookie',    name:'BOLACHAS',     speed:42,  fireInterval:1.3,  enemyScore:30,  bulletSpeed:190 },
    { sprite:'iron',      name:'FERROS',       speed:54,  fireInterval:1.1,  enemyScore:50,  bulletSpeed:210 },
    { sprite:'bowtie',    name:'GRAVATAS',     speed:68,  fireInterval:0.95, enemyScore:80,  bulletSpeed:230 },
    { sprite:'diamond',   name:'DIAMANTES',    speed:84,  fireInterval:0.8,  enemyScore:120, bulletSpeed:250 },
  ];
  function get(level){
    // level 1-based; apos 5, loopa sprite mas continua escalando velocidade
    const i = (level-1) % defs.length;
    const loop = Math.floor((level-1)/defs.length);
    const base = defs[i];
    const mult = 1 + loop*0.35 + (level-1)*0.02;
    return {
      sprite: base.sprite, name: base.name,
      speed: base.speed*mult,
      fireInterval: Math.max(0.45, base.fireInterval - loop*0.15 - (level-1)*0.02),
      enemyScore: Math.round(base.enemyScore*(1+loop*0.5)),
      bulletSpeed: base.bulletSpeed + loop*30 + (level-1)*4
    };
  }
  function count(){ return defs.length; }
  return { get, count };
})();
