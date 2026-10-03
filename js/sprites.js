// Pixel-art 8-bit: matrizes de caracteres -> canvas offscreen
window.Sprites = (function(){
  const DEFS = {
    player: {
      palette:{ W:'#FFFFFF', B:'#00BFFF', D:'#0066FF', R:'#FF2233', Y:'#FFFF33' },
      rows:[
      ".......WW.......",
      ".......WW.......",
      "......BWWB......",
      "......BWWB......",
      "......BWWB......",
      ".....BBWWBB.....",
      ".....BBWWBB.....",
      "....BBBWWBBB....",
      "....BBWRRWBB....",
      "...BBBWRRWBBB...",
      "...BBWRRRRWBB...",
      "..BBBBRRRRBBBB..",
      "..WBBBRYYRBBBW..",
      "..WBBBBBBBBBBW.."
      ]
    },
    hamburger: {
      palette:{ B:'#F4A460', D:'#8B4513', G:'#39FF14', Y:'#FFE135', R:'#FF3131', P:'#6B2D0B' },
      rows:[
      "....DDDDDDDD....",
      "..BBBBBBBBBBBB..",
      ".BBBBBBBBBBBBBB.",
      ".DBBBBBBBBBBBBD.",
      "..GGGGGGGGGGGG..",
      ".GGGGGGGGGGGGGG.",
      "..YYYYYYYYYYYY..",
      "...PPPPPPPPPP...",
      "..PPPPPPPPPPPP..",
      "..RRRRRRRRRRRR..",
      ".BBBBBBBBBBBBBB.",
      ".DBBBBBBBBBBBBD.",
      "..DDDDDDDDDDDD.."
      ]
    },
    cookie: {
      palette:{ T:'#E0A840', D:'#8B5A00', C:'#3B1F0B', W:'#FFF2B0' },
      rows:[
      "....DDDDDD......",
      "..TTTTTTTTTT....",
      ".TTTTWTTTTTTT...",
      ".TTTTTTTTTTTT...",
      "TTTCTTTTCTTTTT..",
      "TTTTTTTTTTTTTT..",
      "TTTTTTCTTTTTTT..",
      ".TTTTTTTTCTTT...",
      ".TTTTTTTTTTTT...",
      "..TTTTCTTTT.....",
      "....DDDDDD......"
      ]
    },
    iron: {
      palette:{ S:'#C0C8D0', D:'#5A6577', K:'#FFFFFF', R:'#FF4444', B:'#222831' },
      rows:[
      "................",
      ".....KKKKKK.....",
      "....KBDDDDBK....",
      "....KBD...DDBK..",
      "...KSB....BSDBK.",
      "...KSB.....BSBK.",
      "..KSSB.....SSBK.",
      "..KSSSBBBBBSSSK.",
      "..KSSSSSSSSSSSK.",
      "..KSSRRRSSSSSK..",
      "...KKKKKKKKKK...",
      "................"
      ]
    },
    bowtie: {
      palette:{ R:'#FF2E63', D:'#A50034', Y:'#FFD23F', W:'#FFFFFF' },
      rows:[
      "RR....WW....RR..",
      "RRR...WW...RRR..",
      "RRRRR.WW..RRRRR.",
      "RRRRRRWW.RRRRRR.",
      ".RRRRRWWRRRRRR..",
      "..RRRWYYYYWRR...",
      "...RRYYYYYYRR...",
      "..RRRWYYYYWRR...",
      ".RRRRRWWRRRRRR..",
      "RRRRRRWW.RRRRRR.",
      "RRRRR.WW..RRRRR.",
      "RRR...WW...RRR..",
      "RR....WW....RR.."
      ]
    },
    diamond: {
      palette:{ C:'#00E5FF', W:'#FFFFFF', B:'#0077FF', D:'#004488' },
      rows:[
      "......WW........",
      ".....WCCW.......",
      "....WCCCCW......",
      "...WCCWWCCW.....",
      "..WCCWWWWCCW....",
      ".WCCBWWWWBCCW...",
      ".WCCBBWWBBCCW...",
      "..WCCBBBBCCW....",
      "...WCCBBCCW.....",
      "....WCCCCW......",
      ".....WCCW.......",
      "......WW........"
      ]
    }
  };
  const cache = {};
  function build(name){
    if(cache[name]) return cache[name];
    const def = DEFS[name];
    const h = def.rows.length;
    const w = Math.max(...def.rows.map(r=>r.length));
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    def.rows.forEach((row,y)=>{
      for(let x=0;x<row.length;x++){
        const ch = row[x];
        if(ch==='.'||ch===' ') continue;
        const col = def.palette[ch];
        if(!col) continue;
        g.fillStyle = col;
        g.fillRect(x,y,1,1);
      }
    });
    cache[name]=c;
    return c;
  }
  function draw(ctx,name,dx,dy,dw,dh){
    const img = build(name);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img,dx,dy,dw,dh);
  }
  function list(){ return Object.keys(DEFS); }
  return { build, draw, list };
})();
