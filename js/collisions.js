// Colisao AABB precisa estilo arcade (hitbox encolhida)
window.Collisions = (function(){
  function overlap(a,b){
    return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  }
  // hitbox encolhida para ser justo: shrink = fracao a remover de cada lado
  function hitbox(e, shrinkX, shrinkY){
    const sx = e.w*shrinkX, sy = e.h*shrinkY;
    return { x:e.x+sx, y:e.y+sy, w:e.w-sx*2, h:e.h-sy*2 };
  }
  return { overlap, hitbox };
})();
