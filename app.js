// Utilidad para quitar tildes
function quitarTildes(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const form = document.getElementById('name-form');
const input = document.getElementById('name-input');
const formContainer = document.getElementById('form-container');
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
const birthdayCard = document.getElementById('birthday-card');
const closeCardBtn = document.getElementById('close-card-btn');

let animationRunning = false;
let backgroundImage = null;

// Load background image
function loadBackgroundImage() {
    return new Promise((resolve, reject) => {
        backgroundImage = new Image();
        backgroundImage.crossOrigin = 'anonymous';
        backgroundImage.onload = () => resolve();
        backgroundImage.onerror = () => reject();
        backgroundImage.src = 'https://i.postimg.cc/7Z4JzM0m/fondo1.jpg';
    });
}

// Initialize background image loading when page loads
window.addEventListener('load', () => {
    loadBackgroundImage().catch(() => {
        console.log('Background image failed to load, using fallback');
    });
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let nombre = input.value.trim();
    if (!nombre || animationRunning) return;
    
    nombre = quitarTildes(nombre).toUpperCase();
    formContainer.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('credits').style.display = 'block';
    resizeCanvas();
    animationRunning = true;
    iniciarAnimacionBlockMensaje(nombre);
});

// Close card button functionality
closeCardBtn.addEventListener('click', function() {
    birthdayCard.classList.add('hidden');
    canvas.style.display = 'block';
    
    // Launch celebration fireworks
    launchCelebrationFireworks();
    
    // After fireworks, reset to initial state
    setTimeout(function() {
        resetToInitialState();
    }, 5000); // 5 seconds of fireworks
});

function resetToInitialState() {
    canvas.style.display = 'none';
    document.getElementById('credits').style.display = 'none';
    formContainer.style.display = 'flex';
    input.value = '';
    animationRunning = false;
    
    // Clear any remaining fireworks
    fireworks = [];
    clouds = [];
}

function drawPlane(x, y, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    let scale = 1;
    
    if (isSmallMobile) {
      scale = 0.6;
    } else if (isMobile) {
      scale = 0.75;
    }
    
    ctx.scale(scale, scale);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(-19, -5, 38, 10);
    ctx.fillStyle = '#b22222';
    ctx.fillRect(14, -3, 11, 6);
    ctx.fillStyle = '#888';
    ctx.fillRect(-22, -2, 6, 4);
    ctx.fillStyle = '#4682b4';
    ctx.fillRect(-8, -8, 16, 6);
    ctx.beginPath();
    ctx.arc(-2, -5, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd299';
    ctx.fill();
    ctx.fillStyle = '#b22222';
    ctx.fillRect(-6, 2, 25, 5);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
}

function drawCloudSmoke(x, y) {
    for (let i = 0; i < 5; i++) {
      const dx = (Math.random() - 0.5) * 8;
      const dy = (Math.random() - 0.5) * 8;
      const r = 4 + Math.random() * 4;
      ctx.save();
      ctx.globalAlpha = 0.15 + Math.random() * 0.2;
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#e0e0e0';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
}

// Block letters paths - using the provided data
const blockLetters = {
    'A': [
        [[0,80],[14,0],[28,80]],
        [[6,40],[22,40]]
    ],
    'B': [
        [[0,0],[0,80]],
        [[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]],
        [[0,40],[32,40],[38,48],[38,72],[32,80],[0,80]]
    ],
    'C': [
        [[38,8],[32,0],[6,0],[0,8],[0,72],[6,80],[32,80],[38,72]]
    ],
    'D': [
        [[0,0],[0,80]],
        [[0,0],[28,0],[38,12],[38,68],[28,80],[0,80]]
    ],
    'E': [
        [[38,0],[0,0],[0,80],[38,80]],
        [[0,40],[28,40]]
    ],
    'F': [
        [[0,0],[0,80]],
        [[0,0],[38,0]],
        [[0,40],[28,40]]
    ],
    'G': [
        [[38,8],[32,0],[6,0],[0,8],[0,72],[6,80],[32,80],[38,72],[38,48],[22,48]]
    ],
    'H': [
        [[0,0],[0,80]],
        [[38,0],[38,80]],
        [[0,40],[38,40]]
    ],
    'I': [
        [[0,0],[38,0]],
        [[19,0],[19,80]],
        [[0,80],[38,80]]
    ],
    'J': [
        [[38,0],[38,64],[32,80],[6,80],[0,72]]
    ],
    'K': [
        [[0,0],[0,80]],
        [[0,40],[38,0]],
        [[0,40],[38,80]]
    ],
    'L': [
        [[0,0],[0,80],[38,80]]
    ],
    'M': [
        [[0,80],[0,0],[19,40],[38,0],[38,80]]
    ],
    'N': [
        [[0,80],[0,0],[38,80],[38,0]]
    ],
    'O': [
        [[6,0],[32,0],[38,8],[38,72],[32,80],[6,80],[0,72],[0,8],[6,0]]
    ],
    'P': [
        [[0,80],[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]]
    ],
    'Q': [
        [[6,0],[32,0],[38,8],[38,72],[32,80],[6,80],[0,72],[0,8],[6,0]],
        [[24,56],[38,80]]
    ],
    'R': [
        [[0,80],[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]],
        [[0,40],[38,80]]
    ],
    'S': [
        [[38,8],[32,0],[6,0],[0,8],[0,32],[6,40],[32,40],[38,48],[38,72],[32,80],[6,80],[0,72]]
    ],
    'T': [
        [[0,0],[38,0]],
        [[19,0],[19,80]]
    ],
    'U': [
        [[0,0],[0,64],[6,80],[32,80],[38,64],[38,0]]
    ],
    'V': [
        [[0,0],[19,80],[38,0]]
    ],
    'W': [
        [[0,0],[9,80],[19,40],[29,80],[38,0]]
    ],
    'X': [
        [[0,0],[38,80]],
        [[38,0],[0,80]]
    ],
    'Y': [
        [[0,0],[19,40],[38,0]],
        [[19,40],[19,80]]
    ],
    'Z': [
        [[0,0],[38,0],[0,80],[38,80]]
    ],
    ' ': [],
    '♥': [
        [
            [32,80],[8,56],[4,36],[12,20],[28,16],[32,24],[36,16],[52,20],[60,36],[56,56],[32,80]
        ]
    ]
};

function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// Cloud sprites - using the provided data
const cloudSprites = [
    [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,1,1,0]
    ],
    [
        [0,0,1,1,0,0],
        [0,1,1,1,1,0],
        [1,1,1,1,1,1],
        [0,1,1,1,1,0],
        [0,0,1,1,0,0]
    ],
    [
        [0,1,1,0],
        [1,1,1,1],
        [0,1,1,0]
    ]
];

let clouds = [];
function initClouds() {
    clouds = [];
    const n = 7;
    for(let i=0;i<n;i++){
      let y;
      do {
        y = 40 + Math.random() * (canvas.height-200);
      } while (y > canvas.height/2-90 && y < canvas.height/2+90);
      clouds.push({
        x: Math.random()*canvas.width,
        y,
        speed: 0.1 + Math.random()*0.15,
        sprite: cloudSprites[Math.floor(Math.random()*cloudSprites.length)],
        scale: 2 + Math.random()*2
      });
    }
}

function drawCloudSprite(cloud) {
    const {x, y, sprite, scale} = cloud;
    for(let i=0;i<sprite.length;i++){
      for(let j=0;j<sprite[i].length;j++){
        if(sprite[i][j]){
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#e0e0e0';
          ctx.shadowBlur = 4;
          ctx.fillRect(x+j*scale, y+i*scale, scale, scale);
          ctx.restore();
        }
      }
    }
}

function updateClouds() {
    for(const cloud of clouds){
      cloud.x += cloud.speed;
      if(cloud.x > canvas.width+40) cloud.x = -40;
    }
}

function drawBackground() {
    if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        // Calculate scaling to cover the entire canvas while maintaining aspect ratio
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (canvasAspect > imageAspect) {
            // Canvas is wider than image aspect ratio
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageAspect;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
        } else {
            // Canvas is taller than image aspect ratio
            drawWidth = canvas.height * imageAspect;
            drawHeight = canvas.height;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
        }
        
        ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
    } else {
        // Fallback color while image loads
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Fireworks system
let fireworks = [];
function launchFirework() {
    const x = 100 + Math.random()*(canvas.width-200);
    const y = 100 + Math.random()*(canvas.height/2-100);
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particles = [];
    for(let i=0;i<20;i++){
      const angle = (i/20)*2*Math.PI;
      const speed = 2+Math.random()*3;
      particles.push({
        x, y, angle, speed,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        alpha: 1,
        gravity: 0.02
      });
    }
    fireworks.push({particles, color});
}

function updateFireworks() {
    for(const fw of fireworks){
      for(const p of fw.particles){
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= 0.015;
      }
    }
    fireworks = fireworks.filter(fw => fw.particles.some(p => p.alpha > 0));
}

function drawFireworks() {
    for(const fw of fireworks){
      for(const p of fw.particles){
        if(p.alpha>0){
          ctx.save();
          ctx.globalAlpha = Math.max(0,p.alpha);
          ctx.fillStyle = fw.color;
          ctx.shadowColor = fw.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(p.x-2, p.y-2, 4, 4);
          ctx.restore();
        }
      }
    }
}

function launchCelebrationFireworks() {
    let fireworkCount = 0;
    const maxFireworks = 30;
    
    const fireworkInterval = setInterval(() => {
        if (fireworkCount < maxFireworks) {
            launchFirework();
            if(Math.random() > 0.7) launchFirework();
            fireworkCount++;
        } else {
            clearInterval(fireworkInterval);
        }
    }, 150);
    
    const animateFireworks = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        updateClouds();
        for(const cloud of clouds) drawCloudSprite(cloud);
        
        updateFireworks();
        drawFireworks();
        
        if (fireworks.length > 0 || fireworkCount < maxFireworks) {
            requestAnimationFrame(animateFireworks);
        }
    };
    
    animateFireworks();
}

function iniciarAnimacionBlockMensaje(nombre) {
    initClouds();
    
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let letraW, letraH, esp, espPalabra, corazonScale;
    
    if (isSmallMobile) {
      letraW = 10*0.8;
      letraH = 20*0.8;
      esp = 55*0.8;
      espPalabra = 65*0.8;
      corazonScale = 0.6;
    } else if (isMobile) {
      letraW = 14*0.8;
      letraH = 28*0.8;
      esp = 60*0.8;
      espPalabra = 70*0.8;
      corazonScale = 0.7;
    } else {
      letraW = 38*0.8;
      letraH = 80*0.8;
      esp = 35*0.8;
      espPalabra = 48*0.8;
      corazonScale = 1.1;
    }
    
    let mensaje, segundaLinea;
    if (isMobile) {
      mensaje = 'HBD';
      segundaLinea = nombre;
    } else {
      mensaje = ('HBD ' + nombre).toUpperCase();
      segundaLinea = null;
    }
    
    let paths = [];
    let letraIndices = [];
    let x = 0;
    let y = 0;
    let maxY = 0, minY = Infinity;
    
    function getLetterWidth(ch) {
      if (ch === ' ') return espPalabra;
      const letter = blockLetters[ch] || blockLetters[' '];
      if(letter.length === 0) return espPalabra;
      let maxX = 0;
      for (const seg of letter) {
        const segMaxX = Math.max(...seg.map(([px, _]) => px));
        if (segMaxX > maxX) maxX = segMaxX;
      }
      return maxX * 0.8;
    }
    
    let totalWidth = 0;
    let letterCount = 0;
    
    for (let i = 0; i < mensaje.length; i++) {
      const ch = mensaje[i];
      if (ch === ' ') {
        totalWidth += espPalabra;
        continue;
      }
      totalWidth += getLetterWidth(ch);
      letterCount++;
    }
    
    totalWidth += (letterCount - 1) * esp;
    
    const corazonWidth = 60 * corazonScale;
    totalWidth += 15 + corazonWidth;
    
    if (segundaLinea) {
      let segundaLineaWidth = 0;
      let segundaLineaLetterCount = 0;
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        segundaLineaWidth += getLetterWidth(ch);
        segundaLineaLetterCount++;
      }
      segundaLineaWidth += (segundaLineaLetterCount - 1) * esp;
      segundaLineaWidth += 15 + corazonWidth;
      totalWidth = Math.max(totalWidth, segundaLineaWidth);
    }
    
    x = (canvas.width - totalWidth) / 2;
    
    if (isMobile) {
      let hbdWidth = 0;
      let hbdLetterCount = 0;
      for (let i = 0; i < mensaje.length; i++) {
        const ch = mensaje[i];
        hbdWidth += getLetterWidth(ch);
        hbdLetterCount++;
      }
      hbdWidth += (hbdLetterCount - 1) * esp;
      x = (canvas.width - hbdWidth) / 2;
    }
    
    for (let i = 0; i < mensaje.length; i++) { 
      const ch = mensaje[i];
      if (ch === ' ') {
        x += espPalabra;
        continue;
      }
      const letter = blockLetters[ch] || blockLetters[' '];
      for (const seg of letter) {
        const segAbs = seg.map(([px, py]) => [x + px*0.8, y + py*0.8]);
        paths.push(segAbs);
        letraIndices.push(i);
        for (const [_, py] of seg) {
          if (py > maxY) maxY = py;
          if (py < minY) minY = py;
        }
      }
      x += letraW + esp;
    }
    
    if (segundaLinea) {
      let nombreWidth = 0;
      let nombreLetterCount = 0;
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        nombreWidth += getLetterWidth(ch);
        nombreLetterCount++;
      }
      nombreWidth += (nombreLetterCount - 1) * esp;
      nombreWidth += 15 + corazonWidth;
      x = (canvas.width - nombreWidth) / 2;
      y = letraH + 80;
      
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        const letter = blockLetters[ch] || blockLetters[' '];
        for (const seg of letter) {
          const segAbs = seg.map(([px, py]) => [x + px*0.8, y + py*0.8]);
          paths.push(segAbs);
          letraIndices.push(mensaje.length + i);
          for (const [_, py] of seg) {
            if (y + py > maxY) maxY = y + py;
            if (y + py < minY) minY = y + py;
          }
        }
        x += letraW + esp;
      }
    }
    
    const corazonYOffset = (letraH - 80*corazonScale) / 2;
    const corazonXOffset = x + 15;
    const corazonY = segundaLinea ? y + 25 : 0;
    const corazon = blockLetters['♥'][0].map(([px, py]) => [corazonXOffset + px*corazonScale, corazonY + py*corazonScale + corazonYOffset]);
    paths.push(corazon);
    letraIndices.push(mensaje.length + (segundaLinea ? segundaLinea.length : 0));

    const totalH = segundaLinea ? y + letraH + 80 : letraH;
    const offsetY = canvas.height/2 - totalH/2;

    let pathIdx = 0, puntoIdx = 0, t = 0;
    let estado = 'dibuja';
    let lastPoint = null, moveFrom = null, moveTo = null;
    let drawnSmoke = [];
    let pausaFrames = isMobile ? 15 : 20;
    let showFireworks = false;
    let fireworkTimer = 0;

    function animar() {
        if(pathIdx >= paths.length) {
            showFireworks = true;
            if(fireworkTimer < 60) {
                if(fireworkTimer%15===0) launchFirework();
                fireworkTimer++;
            } else {
                setTimeout(function() {
                    birthdayCard.classList.remove('hidden');
                    animationRunning = false;
                }, 500);
                return;
            }
        }

        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawBackground();
        updateClouds();
        for(const cloud of clouds) drawCloudSprite(cloud);

        if(showFireworks){
            updateFireworks();
            drawFireworks();
        }
        
        for(const dot of drawnSmoke) drawCloudSmoke(dot[0], dot[1]);

        if(pathIdx < paths.length) {
            const seg = paths[pathIdx];
            if(puntoIdx < seg.length - 1) {
                const start = seg[puntoIdx];
                const end = seg[puntoIdx+1];
                let px, py, angle;
                
                if(estado==='dibuja') {
                    const dx = end[0]-start[0], dy = end[1]-start[1];
                    const dist = Math.sqrt(dx*dx+dy*dy);
                    const speed = isMobile ? 5.5 : 4.5;
                    t += speed/dist;
                    px = start[0] + (end[0]-start[0])*t;
                    py = offsetY + start[1] + (end[1]-start[1])*t;
                    angle = getAngle(start[0], offsetY + start[1], end[0], offsetY + end[1]);
                    drawPlane(px, py, angle);
                    drawCloudSmoke(px, py);
                    drawnSmoke.push([px, py]);
                    if(t>=1) {
                      t=0;
                      puntoIdx++;
                      if(puntoIdx>=seg.length-1) {
                        puntoIdx=0;
                        let prevLetter = pathIdx < letraIndices.length ? letraIndices[pathIdx] : -1;
                        pathIdx++;
                        let nextLetter = pathIdx < letraIndices.length ? letraIndices[pathIdx] : -1;
                        lastPoint = end;
                        if(nextLetter !== prevLetter) {
                          estado='pausa';
                        } else {
                          estado='mueve';
                          moveFrom = [lastPoint[0], offsetY + lastPoint[1]];
                          if(pathIdx < paths.length) {
                            moveTo = [paths[pathIdx][0][0], offsetY + paths[pathIdx][0][1]];
                          }
                          t = 0;
                        }
                      }
                    }
                } else if(estado==='pausa') {
                    px = lastPoint[0];
                    py = offsetY + lastPoint[1];
                    angle = 0;
                    drawPlane(px, py, angle);
                    pausaFrames--;
                    if(pausaFrames<=0) {
                      pausaFrames = isMobile ? 15 : 20;
                      estado='mueve';
                      if(pathIdx<paths.length) {
                        moveFrom = [lastPoint[0], offsetY + lastPoint[1]];
                        moveTo = [paths[pathIdx][0][0], offsetY + paths[pathIdx][0][1]];
                      }
                      t = 0;
                    }
                } else if(estado==='mueve') {
                    const from = moveFrom;
                    const to = moveTo;
                    const dx = to[0]-from[0], dy = to[1]-from[1];
                    const dist = Math.sqrt(dx*dx+dy*dy);
                    const speed = isMobile ? 7.0 : 6.0;
                    t += speed/dist;
                    px = from[0] + (to[0]-from[0])*t;
                    py = from[1] + (to[1]-from[1])*t;
                    angle = getAngle(from[0], from[1], to[0], to[1]);
                    drawPlane(px, py, angle);
                    if(t>=1) {
                      t=0;
                      estado='dibuja';
                    }
                }
            }
        }
        requestAnimationFrame(animar);
    }
    animar();
}