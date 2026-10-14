(()=>{
const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem('ftcbl.'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('ftcbl.'+k,JSON.stringify(v))}catch(e){}}};
const C={line:'#2b3441',accent:'#f0b52e',blue:'#4a86ff',red:'#ff5a52',purple:'#a066ff',green:'#33d17f',fg:'#e8edf3',mute:'#8d99aa',pollen:'#f5d63a',nred:'#e8433b',nblue:'#3d7bff'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===== SEASONS ===== */
const SEASONS={
  decode:{id:'decode',name:'DECODE',yrs:'2025–26',motors:8,servos:10,control:3,mean:52,sd:30,fKey:'Gate',
    tag:'Build an 18-inch robot from goBILDA-style parts, then drive it on a top-down DECODE field. Launch artifacts from the launch zones, fill your ramp in the motif pattern, and park in base.',
    pts:[['LEAVE (auto)','3'],['CLASSIFIED artifact','3'],['OVERFLOW artifact','1'],['PATTERN match per ramp slot','2'],['BASE partial / full','5 / 10'],['Minor / Major foul (to opponent)','5 / 15']],
    rules:'8 DC motors · 10 servos · hold 3 artifacts'},
  biobuzz:{id:'biobuzz',name:'BIOBUZZ',yrs:'2026–27',motors:8,servos:8,control:4,mean:62,sd:36,fKey:'Place',
    tag:'Build an 18-inch robot, then pollinate a top-down BIOBUZZ field. Launch pollen and nectar into your hive to tip it, claim flowers with your nectar in the last minute, fill your garden, and park in the loading zone.',
    pts:[['LEAVE (auto)','3'],['PARK (auto, and again at end)','5 + 5'],['HIVE TIP','20'],['Piece left in upward CELL','2'],['Piece in a FLOWER you own','2'],['Bottom NECTAR bonus per flower','5'],['Piece in your GARDEN','1'],['Minor / Major foul (to opponent)','5 / 20']],
    rules:'8 DC motors · 8 servos · hold 4 pieces'}
};
let S=SEASONS[store.get('season','decode')]||SEASONS.decode;

/* ===== PART CATALOG ===== */
const CATS=[['struct','Structure · goBILDA aluminum'],['plastic','Structure · plastic'],['wheels','Wheels'],['motors','Motors (Yellow Jacket)'],['servos','Servos'],['elec','Electronics'],['mech','Mechanisms']];
const PARTS=[],DEF={};const add=o=>{PARTS.push(o);DEF[o.id]=o};
[5,7,9,11,13,15,17,19].forEach(n=>add({id:'uc'+n,name:`U-Channel ${n}`,cat:'struct',kind:'channel',w:2,h:n,g:Math.round(n*6.3),desc:`${n} holes · ${n*24} mm · 6061 aluminum`}));
[5,9,13,19].forEach(n=>add({id:'ls'+n,name:`Low-Side U-Channel ${n}`,cat:'struct',kind:'lowside',w:2,h:n,g:Math.round(n*4.4),desc:`${n} holes · lighter, less stiff`}));
add({id:'gp79',name:'Grid Plate 7×9',cat:'struct',kind:'gplate',w:7,h:9,g:115,desc:'Aluminum mounting plate'});
[9,13,17].forEach(n=>add({id:'pc'+n,name:`Polycarb Channel ${n}`,cat:'plastic',kind:'pchannel',w:2,h:n,g:Math.round(n*2.2),plastic:1,desc:`${n} squares · ~65% lighter than aluminum`}));
add({id:'pp59',name:'Polycarb Plate 5×9',cat:'plastic',kind:'plate',w:5,h:9,g:48,plastic:1,desc:'1/16 in polycarbonate'});
add({id:'pp99',name:'Polycarb Plate 9×9',cat:'plastic',kind:'plate',w:9,h:9,g:86,plastic:1,desc:'1/16 in polycarbonate'});
add({id:'mec104',name:'104 mm Mecanum',cat:'wheels',kind:'mecanum',w:2,h:4,g:170,diam:104,desc:'Strafes in a set of 4'});
add({id:'mec96',name:'96 mm Mecanum',cat:'wheels',kind:'mecanum',w:2,h:4,g:145,diam:96,desc:'Smaller, lighter mecanum'});
add({id:'omni96',name:'96 mm Omni',cat:'wheels',kind:'omni',w:2,h:4,g:110,diam:96,desc:'Turns easily, no strafe here'});
add({id:'grip96',name:'96 mm Grip Wheel',cat:'wheels',kind:'traction',w:2,h:4,g:95,diam:96,desc:'Traction, best pushing'});
[[312,24.3],[435,18.7],[1150,7.9],[6000,1.5]].forEach(([r,t])=>add({id:'m'+r,name:`Motor ${r} RPM`,cat:'motors',kind:'motor',w:2,h:4,g:r===6000?300:375,rpm:r,torque:t,desc:r===6000?'Bare motor 1:1 · flywheels':`${t} kg·cm stall`}));
add({id:'svT',name:'Torque Servo',cat:'servos',kind:'servo',w:2,h:1,g:70,desc:'Positional · strong'});
add({id:'svS',name:'Speed Servo',cat:'servos',kind:'servo',w:2,h:1,g:70,desc:'Positional · fast'});
add({id:'svCR',name:'Continuous Servo',cat:'servos',kind:'servo',cr:1,w:2,h:1,g:70,desc:'Spins like a small motor'});
add({id:'hub',name:'Control Hub',cat:'elec',kind:'hub',w:6,h:4,g:190,desc:'Robot controller · 4 motors, 6 servos'});
add({id:'exp',name:'Expansion Hub',cat:'elec',kind:'exp',w:6,h:4,g:190,desc:'+4 motors, +6 servos'});
add({id:'bat',name:'12V Battery',cat:'elec',kind:'battery',w:3,h:6,g:575,desc:'Main power · exactly 1'});
add({id:'odo',name:'Odometry Pod',cat:'elec',kind:'odo',w:2,h:2,g:45,desc:'Better positioning in auto'});
add({id:'cam',name:'Vision Camera',cat:'elec',kind:'camera',w:2,h:2,g:80,desc:'Reads AprilTags · tighter aim'});
add({id:'intk',name:'Compliant-Wheel Intake',cat:'mech',kind:'intake',w:12,h:2,g:210,desc:'Needs a motor or CR servo next to it'});
add({id:'intkP',name:'Plastic Roller Intake',cat:'mech',kind:'intake',w:12,h:2,g:120,plastic:1,desc:'Lighter, slower pickup'});
add({id:'fly',name:'Flywheel Launcher',cat:'mech',kind:'flywheel',w:5,h:5,g:260,desc:'Shoots pieces · needs a fast motor'});
add({id:'hop',name:'Polycarb Hopper',cat:'mech',kind:'hopper',w:6,h:6,g:85,plastic:1,desc:'Holds up to the season control limit'});
add({id:'tur',name:'Turret Ring',cat:'mech',kind:'turret',w:6,h:6,g:180,desc:'Auto-aims ±70° · needs servo/motor'});
const Z={gplate:0,plate:0,channel:1,lowside:1,pchannel:1,mecanum:2,omni:2,traction:2,intake:3,hopper:3,turret:3,flywheel:4,battery:4,hub:4,exp:4,motor:5,servo:5,odo:5,camera:5};
const FRAME=new Set(['channel','lowside','pchannel','plate','gplate']);

/* ===== PART DRAWING ===== */
function rr(ctx,x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else ctx.rect(x,y,w,h)}
function circ(ctx,x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(.2,r),0,Math.PI*2)}
function drawShape(ctx,d,x,y,w,h,s,mirror){
  const k=d.kind;ctx.lineWidth=Math.max(.6,s*.07);const vert=h>=w,n=Math.round(Math.max(w,h)/s);
  if(k==='channel'||k==='lowside'||k==='pchannel'){
    const pl=k==='pchannel';
    ctx.fillStyle=pl?'rgba(140,200,255,.30)':k==='lowside'?'#b8c1cc':'#a2acb8';rr(ctx,x,y,w,h,s*.15);ctx.fill();
    ctx.strokeStyle=pl?'rgba(170,220,255,.85)':'#56606c';ctx.stroke();
    ctx.fillStyle=pl?'rgba(170,220,255,.35)':'#77818d';const t=(vert?w:h)*(k==='lowside'?.08:.13);
    if(vert){ctx.fillRect(x+w*.06,y+s*.12,t,h-s*.24);ctx.fillRect(x+w*.94-t,y+s*.12,t,h-s*.24)}else{ctx.fillRect(x+s*.12,y+h*.06,w-s*.24,t);ctx.fillRect(x+s*.12,y+h*.94-t,w-s*.24,t)}
    ctx.fillStyle=pl?'rgba(15,25,35,.55)':'#2a3038';
    for(let i=0;i<n;i++){circ(ctx,vert?x+w/2:x+(i+.5)*s,vert?y+(i+.5)*s:y+h/2,s*.19);ctx.fill()}
  }else if(k==='plate'||k==='gplate'){
    ctx.fillStyle=k==='plate'?'rgba(150,205,255,.18)':'#97a1ad';rr(ctx,x,y,w,h,s*.2);ctx.fill();ctx.strokeStyle=k==='plate'?'rgba(170,220,255,.7)':'#56606c';ctx.stroke();
    ctx.fillStyle=k==='plate'?'rgba(170,220,255,.35)':'#2a3038';
    for(let i=0;i<Math.round(w/s);i++)for(let j=0;j<Math.round(h/s);j++){if((i+j)%2)continue;circ(ctx,x+(i+.5)*s,y+(j+.5)*s,s*.13);ctx.fill()}
  }else if(k==='mecanum'||k==='omni'||k==='traction'){
    ctx.fillStyle='#1b1f25';rr(ctx,x,y,w,h,Math.min(w,h)*.35);ctx.fill();ctx.strokeStyle='#05070a';ctx.stroke();
    ctx.save();rr(ctx,x+s*.12,y+s*.12,w-s*.24,h-s*.24,Math.min(w,h)*.3);ctx.clip();
    if(k==='mecanum'){ctx.strokeStyle='#7f8996';ctx.lineWidth=s*.3;const L=Math.max(w,h);
      for(let t=-L;t<L*2;t+=s*.72){ctx.beginPath();
        if(vert){if(mirror){ctx.moveTo(x,y+t);ctx.lineTo(x+w,y+t+w)}else{ctx.moveTo(x,y+t+w);ctx.lineTo(x+w,y+t)}}
        else{if(mirror){ctx.moveTo(x+t,y);ctx.lineTo(x+t+h,y+h)}else{ctx.moveTo(x+t+h,y);ctx.lineTo(x+t,y+h)}}ctx.stroke()}}
    else if(k==='omni'){ctx.fillStyle='#8a94a1';for(let t=s*.3;t<(vert?h:w)-s*.2;t+=s*.6){if(vert)ctx.fillRect(x+w*.2,y+t,w*.6,s*.3);else ctx.fillRect(x+t,y+h*.2,s*.3,h*.6)}}
    else{ctx.strokeStyle='#3a4049';ctx.lineWidth=s*.18;for(let t=s*.3;t<(vert?h:w);t+=s*.45){ctx.beginPath();if(vert){ctx.moveTo(x,y+t);ctx.lineTo(x+w,y+t)}else{ctx.moveTo(x+t,y);ctx.lineTo(x+t,y+h)}ctx.stroke()}}
    ctx.restore();ctx.fillStyle=C.accent;circ(ctx,x+w/2,y+h/2,Math.min(w,h)*.16);ctx.fill();
  }else if(k==='motor'){
    ctx.fillStyle='#e9b52c';if(vert)rr(ctx,x+w*.06,y,w*.88,h*.68,s*.3);else rr(ctx,x,y+h*.06,w*.68,h*.88,s*.3);ctx.fill();
    ctx.fillStyle='#a87a10';if(vert)rr(ctx,x+w*.14,y+h*.64,w*.72,h*.36,s*.2);else rr(ctx,x+w*.64,y+h*.14,w*.36,h*.72,s*.2);ctx.fill();
    ctx.fillStyle='#d9dde3';if(vert)circ(ctx,x+w/2,y+h*.85,s*.25);else circ(ctx,x+w*.85,y+h/2,s*.25);ctx.fill();
    if(s>=7){ctx.fillStyle='#1a1408';ctx.font=`600 ${Math.max(6,s*.62)}px JetBrains Mono, monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.save();ctx.translate(vert?x+w/2:x+w*.34,vert?y+h*.34:y+h/2);if(vert)ctx.rotate(-Math.PI/2);ctx.fillText(d.rpm>=1000?(d.rpm/1000)+'k':d.rpm,0,0);ctx.restore()}
  }else if(k==='servo'){
    ctx.fillStyle='#24272d';rr(ctx,x,y,w,h,s*.2);ctx.fill();ctx.strokeStyle='#05070a';ctx.stroke();
    ctx.fillStyle=d.cr?C.green:'#d4a12a';circ(ctx,x+(vert?w/2:w*.28),y+(vert?h*.28:h/2),Math.min(w,h)*.32);ctx.fill();
  }else if(k==='hub'||k==='exp'){
    ctx.fillStyle='#2b313b';rr(ctx,x,y,w,h,s*.3);ctx.fill();ctx.strokeStyle='#4a5260';ctx.stroke();
    ctx.fillStyle='#ff7a1a';ctx.fillRect(x+s*.2,y+s*.2,w-s*.4,Math.max(1,s*.45));ctx.fillStyle=C.green;circ(ctx,x+w-s*.6,y+h-s*.6,s*.22);ctx.fill();
    if(s>=7){ctx.fillStyle='#c8ced8';ctx.font=`600 ${s*.75}px JetBrains Mono, monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(k==='hub'?'CTRL':'EXP',x+w/2,y+h/2+s*.2)}
  }else if(k==='battery'){
    ctx.fillStyle='#2a2d33';rr(ctx,x,y,w,h,s*.3);ctx.fill();ctx.strokeStyle='#4a5260';ctx.stroke();
    ctx.fillStyle=C.red;ctx.fillRect(x+s*.3,y+s*.3,s*.6,s*.6);ctx.fillStyle='#111';ctx.fillRect(x+w-s*.9,y+s*.3,s*.6,s*.6);
    if(s>=7){ctx.fillStyle='#c8ced8';ctx.font=`600 ${s*.75}px JetBrains Mono, monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('12V',x+w/2,y+h/2+s*.3)}
  }else if(k==='intake'){
    ctx.fillStyle=d.plastic?'rgba(150,205,255,.15)':'rgba(51,209,127,.13)';rr(ctx,x,y,w,h,s*.3);ctx.fill();ctx.strokeStyle=d.plastic?'rgba(170,220,255,.6)':C.green;ctx.stroke();
    ctx.strokeStyle='#5c6672';ctx.lineWidth=s*.12;ctx.beginPath();if(vert){ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h)}else{ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2)}ctx.stroke();
    ctx.fillStyle=d.plastic?'#9cc7ef':C.green;for(let i=0;i<n;i+=1.5){circ(ctx,vert?x+w/2:x+(i+.75)*s,vert?y+(i+.75)*s:y+h/2,Math.min(w,h)*.38);ctx.fill()}
  }else if(k==='flywheel'){
    ctx.fillStyle='#20242b';rr(ctx,x,y,w,h,s*.4);ctx.fill();const r=Math.min(w,h)*.42;ctx.fillStyle='#3a3f48';circ(ctx,x+w/2,y+h/2,r);ctx.fill();ctx.strokeStyle=C.accent;ctx.lineWidth=s*.25;ctx.stroke();
    ctx.strokeStyle='#8d99aa';ctx.lineWidth=s*.12;for(let a=0;a<6;a++){ctx.beginPath();ctx.moveTo(x+w/2,y+h/2);ctx.lineTo(x+w/2+Math.cos(a)*r*.85,y+h/2+Math.sin(a)*r*.85);ctx.stroke()}
    ctx.fillStyle=C.accent;ctx.beginPath();ctx.moveTo(x+w/2,y-s*.1);ctx.lineTo(x+w/2-s*.5,y+s*.7);ctx.lineTo(x+w/2+s*.5,y+s*.7);ctx.fill();
  }else if(k==='hopper'){
    ctx.fillStyle='rgba(150,205,255,.16)';rr(ctx,x,y,w,h,s*.4);ctx.fill();ctx.strokeStyle='rgba(170,220,255,.75)';ctx.stroke();
    ctx.setLineDash([s*.3,s*.25]);for(let i=0;i<3;i++){circ(ctx,x+w/2,y+h*(.2+.3*i),Math.min(w,h)*.13);ctx.stroke()}ctx.setLineDash([]);
  }else if(k==='turret'){
    const r=Math.min(w,h)*.46;ctx.strokeStyle='#8d99aa';ctx.lineWidth=s*.5;circ(ctx,x+w/2,y+h/2,r*.8);ctx.stroke();ctx.lineWidth=s*.12;
    for(let a=0;a<24;a++){const A=a/24*Math.PI*2;ctx.beginPath();ctx.moveTo(x+w/2+Math.cos(A)*r*.98,y+h/2+Math.sin(A)*r*.98);ctx.lineTo(x+w/2+Math.cos(A)*r*1.1,y+h/2+Math.sin(A)*r*1.1);ctx.stroke()}
  }else if(k==='odo'){ctx.fillStyle='#1f232a';rr(ctx,x,y,w,h,s*.3);ctx.fill();ctx.fillStyle='#8a94a1';rr(ctx,x+w*.35,y+h*.15,w*.3,h*.7,s*.15);ctx.fill()}
  else if(k==='camera'){ctx.fillStyle='#1d2026';rr(ctx,x,y,w,h,s*.3);ctx.fill();ctx.fillStyle=C.blue;circ(ctx,x+w/2,y+h/2,Math.min(w,h)*.28);ctx.fill();ctx.fillStyle='#cfe0ff';circ(ctx,x+w*.42,y+h*.42,Math.min(w,h)*.08);ctx.fill()}
}
function drawPart(ctx,d,rot,x,y,s,mirror){const fw=(rot?d.h:d.w)*s,fh=(rot?d.w:d.h)*s;ctx.save();ctx.translate(x+fw/2,y+fh/2);if(rot)ctx.rotate(Math.PI/2);drawShape(ctx,d,-d.w*s/2,-d.h*s/2,d.w*s,d.h*s,s,mirror);ctx.restore()}

/* ===== BOT MODEL ===== */
const GRID=23,BOX0=2,BOXN=19,IN_PER_SQ=18/19; // 18 in box = 19 squares, centered in a 23-square grid
// Starter Bot: laid out inside the 18 in box with no overlapping parts. Footprint 17 x 18 squares = 16.1 x 17.1 in.
const STARTER_RAW=[
 ['uc17',3,1,0],['uc17',14,1,0],['uc11',4,4,1],['uc11',4,12,1],          // frame: two side rails + two cross channels
 ['mec104',1,1,0],['mec104',16,1,0],['mec104',1,14,0],['mec104',16,14,0], // mecanum corners
 ['m312',3,2,0],['m312',14,2,0],['m312',3,14,0],['m312',14,14,0],          // drive motors on the rails
 ['intk',4,0,0],['m1150',8,2,1],                                           // front intake + its motor
 ['hop',7,4,0],['svS',6,6,1],                                              // hopper + sorter servo
 ['bat',7,10,1],                                                           // battery low and centered
 ['fly',7,13,0],['m6000',5,13,0],                                          // flywheel + 6000 RPM motor
 ['hub',14,6,1],['exp',1,6,1]                                              // control hub + expansion hub
];
const STARTER=()=>STARTER_RAW.map(([id,x,y,rot],i)=>({uid:1000+i,id,x:x+BOX0,y:y+BOX0,rot}));
let bot=store.get('bot2',null);
if(!bot||!Array.isArray(bot.parts))bot={name:'Starter Bot',parts:STARTER()};
let uidN=bot.parts.reduce((m,p)=>Math.max(m,p.uid),1100)+1;
const saveBot=()=>store.set('bot2',bot);
const fp=p=>{const d=DEF[p.id];return{d,fw:p.rot?d.h:d.w,fh:p.rot?d.w:d.h}};

function compile(parts,SS){
  SS=SS||S;
  const P=parts.filter(p=>DEF[p.id]).map(p=>({...p,...fp(p)}));
  const out={P,errors:[],tips:[],counts:{},motors:0,servos:0,lb:0,top:0,wIn:0,hIn:0};
  if(!P.length){out.errors.push('Add some parts first.');out.tips.push('Load the Starter Bot to see a legal build.');return out}
  const byK=k=>P.filter(p=>p.d.kind===k);
  const adj=(a,b)=>a.x-1<b.x+b.fw&&b.x<a.x+a.fw+1&&a.y-1<b.y+b.fh&&b.y<a.y+a.fh+1;
  const over=(a,b)=>a.x<b.x+b.fw&&b.x<a.x+a.fw&&a.y<b.y+b.fh&&b.y<a.y+a.fh;
  let minX=99,minY=99,maxX=-1,maxY=-1,g=0,mx=0,my=0;
  P.forEach(p=>{minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x+p.fw);maxY=Math.max(maxY,p.y+p.fh);g+=p.d.g;mx+=p.d.g*(p.x+p.fw/2);my+=p.d.g*(p.y+p.fh/2)});
  const cxS=(minX+maxX)/2,cyS=(minY+maxY)/2;
  out.wSq=maxX-minX;out.hSq=maxY-minY;out.wIn=out.wSq*IN_PER_SQ;out.hIn=out.hSq*IN_PER_SQ;out.halfW=out.wIn/2;out.halfH=out.hIn/2;
  out.inBox=minX>=BOX0&&minY>=BOX0&&maxX<=BOX0+BOXN&&maxY<=BOX0+BOXN;
  out.massG=Math.round(g*1.12);out.lb=out.massG/453.6;out.comX=(mx/g-cxS)*IN_PER_SQ;out.comY=(my/g-cyS)*IN_PER_SQ;
  P.forEach(p=>{p.L={x:(p.x-cxS)*IN_PER_SQ,y:(p.y-cyS)*IN_PER_SQ,w:p.fw*IN_PER_SQ,h:p.fh*IN_PER_SQ};p.mirror=((p.x+p.fw/2<cxS)!==(p.y+p.fh/2<cyS))});
  // overlap check (frame parts may sit under others)
  const solid=P.filter(p=>!FRAME.has(p.d.kind)),ov=[];
  for(let i=0;i<solid.length;i++)for(let j=i+1;j<solid.length;j++)if(over(solid[i],solid[j]))ov.push(`${solid[i].d.name} and ${solid[j].d.name}`);
  if(ov.length)out.errors.push(`Parts overlap: ${ov.slice(0,3).join('; ')}${ov.length>3?` (+${ov.length-3} more)`:''}. Move them apart.`);
  const motors=byK('motor'),servos=byK('servo'),acts=[...motors,...servos],used=new Set();
  const claim=(c,f,sc)=>{let b=null,bs=-1e9;for(const a of acts){if(used.has(a.uid)||!f(a)||!adj(c,a))continue;const s=sc(a);if(s>bs){bs=s;b=a}}if(b)used.add(b.uid);return b};
  const fly=byK('flywheel'),tur=byK('turret'),intk=byK('intake'),wheels=P.filter(p=>['mecanum','omni','traction'].includes(p.d.kind)),hop=byK('hopper');
  const flyP=fly.map(f=>({f,m:claim(f,a=>a.d.kind==='motor',a=>a.d.rpm)}));
  const whP=wheels.map(w=>({w,m:claim(w,a=>a.d.kind==='motor',a=>-a.d.rpm)}));
  const intP=intk.map(i=>({i,m:claim(i,a=>a.d.kind==='motor'||a.d.cr,a=>a.d.kind==='motor'?2:1)}));
  const turP=tur.map(t=>({t,m:claim(t,a=>a.d.kind==='servo'||a.d.kind==='motor',a=>a.d.kind==='servo'?2:1)}));
  const hopP=hop.map(h=>({h,m:claim(h,a=>a.d.kind==='servo'&&!a.d.cr,()=>1)}));
  const frame=P.filter(p=>FRAME.has(p.d.kind));
  const cnt=f=>P.filter(f).length;
  out.counts={'U-Channels':cnt(p=>p.d.kind==='channel'),'Low-side channels':cnt(p=>p.d.kind==='lowside'),'Plastic parts':cnt(p=>p.d.plastic),'Plates':cnt(p=>p.d.kind==='gplate'||p.d.kind==='plate'),
    'Mecanum wheels':cnt(p=>p.d.kind==='mecanum'),'Other wheels':cnt(p=>p.d.kind==='omni'||p.d.kind==='traction'),'DC motors':motors.length,'Servos':servos.length,'Control Hubs':byK('hub').length,'Expansion Hubs':byK('exp').length,'Batteries':byK('battery').length};
  out.motors=motors.length;out.servos=servos.length;
  const nh=byK('hub').length,ne=byK('exp').length,nb=byK('battery').length;
  if(nh!==1)out.errors.push(nh?'Only 1 robot controller allowed — remove extra Control Hubs.':'Add a Control Hub (exactly 1 robot controller is required).');
  if(ne>1)out.errors.push('Use at most 1 Expansion Hub.');
  if(nb!==1)out.errors.push(nb?'Exactly 1 main 12V battery is allowed.':'Add the 12V battery — the robot has no power.');
  if(motors.length>SS.motors)out.errors.push(`${motors.length} DC motors — the ${SS.name} limit is ${SS.motors}.`);
  if(servos.length>SS.servos)out.errors.push(`${servos.length} servos — the ${SS.name} limit is ${SS.servos}.`);
  if(nh===1&&motors.length>4*(1+Math.min(ne,1)))out.errors.push(`${motors.length} motors need ${Math.ceil(motors.length/4)} hubs. Add an Expansion Hub (4 motor ports each).`);
  if(nh===1&&servos.length>6*(1+Math.min(ne,1)))out.errors.push(`${servos.length} servos need more ports. Each hub has 6 servo ports.`);
  if(out.wSq>BOXN||out.hSq>BOXN)out.errors.push(`Robot is ${out.wIn.toFixed(1)} × ${out.hIn.toFixed(1)} in — it must fit in 18 × 18 in.`);
  else if(!out.inBox)out.tips.push('Some parts hang outside the amber box. It still fits 18 in, but slide it back inside to be sure.');
  const pw=whP.filter(x=>x.m);const L=pw.filter(x=>x.w.x+x.w.fw/2<cxS).length,R=pw.length-L;
  out.drivePowered=pw.length;out.wheels=wheels.length;const kg=out.massG/1000;
  if(pw.length>=2&&L&&R&&nb>=1&&nh>=1){
    const rpm=pw.reduce((s,x)=>s+x.m.d.rpm,0)/pw.length,tq=pw.reduce((s,x)=>s+x.m.d.torque,0)/pw.length,diam=pw.reduce((s,x)=>s+x.w.d.diam,0)/pw.length;
    const free=rpm/60*Math.PI*diam/25.4;const Fz=pw.length*tq*.0981/(diam/2000);const acc=Math.min(4.2,Fz/kg*.5);
    out.accel=acc*39.37;let top=free*.82;if(acc<1.5)top*=Math.max(.35,acc/1.5);out.top=Math.min(top,130);
    out.holo=pw.length>=4&&pw.every(x=>x.w.d.kind==='mecanum')&&wheels.every(w=>w.d.kind==='mecanum');
    out.turn=Math.min(360,out.top/Math.hypot(out.halfW,out.halfH)*180/Math.PI*.8);out.driveRpm=Math.round(rpm);
    out.push=pw.reduce((s,x)=>s+(x.w.d.kind==='traction'?1.4:1),0)/4*Math.min(1.5,acc/3)*kg;
  }else{out.top=0;out.accel=0;out.turn=0;out.holo=false;out.push=0.1}
  const fl=flyP.find(x=>x.m);
  if(fl){const r=fl.m.d.rpm;const T=r>=6000?[230,2.4,.35]:r>=1150?[165,4,.6]:r>=435?[110,7,.8]:[85,9.5,.9];
    out.shooter={rpm:r,speed:T[0],range:Math.round(T[0]*.78),spread:T[1],cd:T[2],L:{x:fl.f.L.x+fl.f.L.w/2,y:fl.f.L.y+fl.f.L.h/2}}}else out.shooter=null;
  out.turret=!!turP.find(x=>x.m);out.camera=byK('camera').length>0;
  if(out.shooter&&out.camera)out.shooter.spread*=.6;if(out.shooter&&out.turret)out.shooter.spread*=.8;
  const ip=intP.filter(x=>x.m);
  out.intakes=ip.map(x=>({x:x.i.L.x,y:x.i.L.y,w:x.i.L.w,h:x.i.L.h,rate:(x.m.d.kind==='motor'?.18:.38)*(x.i.d.plastic?1.4:1)}));
  out.capacity=out.intakes.length?(hop.length?SS.control:1):(fl?1:0);
  out.sorter=!!hopP.find(x=>x.m);out.odo=byK('odo').length>=2;
  const T=out.tips;
  wheels.forEach((w,i)=>{if(!whP[i].m)T.push(`A ${w.d.name} has no motor touching it, so it just rolls. Put a 312 or 435 RPM motor right next to it.`)});
  if(!wheels.length)T.push('No wheels yet. Four 104 mm mecanum wheels on the corners is the standard drivetrain.');
  else if(pw.length&&(!L||!R))T.push('All powered wheels are on one side — the robot will spin in circles. Power wheels on both sides.');
  if(wheels.length&&!out.holo&&wheels.some(w=>w.d.kind==='mecanum'))T.push('Mecanum only strafes with 4 powered mecanum wheels and no other wheel types.');
  if(pw.some(x=>x.m.d.rpm>=1150))T.push('Drive motors at 1150+ RPM have very little torque. 312 or 435 RPM accelerates much faster.');
  if(frame.length<2)T.push('Wheels and motors need a frame. Add at least two U-Channels as side rails.');
  wheels.forEach(w=>{if(!frame.some(f=>adj(w,f)))T.push(`The ${w.d.name} at column ${w.x+1} isn't next to any channel — mount it to the frame.`)});
  if(!fly.length)T.push(SS.id==='biobuzz'?'No launcher, so the robot can never tip the HIVE (20 pts each). Add a Flywheel Launcher.':'No launcher, so the robot cannot score in the goal. Add a Flywheel Launcher.');
  else if(!fl)T.push('The flywheel has no motor touching it. Use a 6000 RPM bare motor for long shots.');
  else if(fl.m.d.rpm<6000)T.push(`Flywheel on a ${fl.m.d.rpm} RPM motor only reaches ~${out.shooter.range} in. A 6000 RPM motor shoots much farther.`);
  if(!intk.length)T.push('No intake, so you can only score your preloads. Add an intake at the front edge.');
  else if(!ip.length)T.push('The intake has nothing spinning it. Put a motor or continuous servo next to it.');
  if(ip.length&&!hop.length)T.push(`Without a hopper you hold 1 piece at a time. A hopper holds ${SS.control} (the ${SS.name} control limit).`);
  if(hop.length&&!out.sorter)T.push(SS.id==='biobuzz'?'Put a positional servo next to the hopper so you can choose pollen or nectar for each shot.':'Put a positional servo next to the hopper to sort colors and build the motif pattern (2 pts each).');
  if(fl&&!out.turret&&!out.camera)T.push('A Vision Camera or Turret Ring makes shots tighter and faster to line up.');
  if(out.lb>18)T.push(`At ${out.lb.toFixed(1)} lb the robot is heavy and slow to accelerate. Swap some aluminum for polycarbonate.`);
  const off=Math.hypot(out.comX,out.comY);if(off>2.2)T.push(`Center of mass is ${off.toFixed(1)} in off center — the robot will pull to one side. Move the battery toward the middle.`);
  if(out.wIn<12||out.hIn<12)T.push('The footprint is small. A wider base is more stable and fits a bigger intake.');
  if(!out.odo)T.push('Two odometry pods make the auto routine more accurate.');
  if(!T.length)T.push('Solid build. Try plastic channels to shave weight, or tune for faster cycles.');
  out.legal=!out.errors.length;return out;
}

/* ===== SCREENS ===== */
const screens=['home','studio','match','results'];
function show(id){screens.forEach(s=>$('#'+s).hidden=s!==id);window.scrollTo(0,0);if(id==='home')renderHome();if(id==='studio')layoutGrid()}
function modal(id,on){$('#'+id).hidden=!on}
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.hidden=true}));
function drawGridBg(ctx,s){
  const W=s*GRID;ctx.fillStyle='#141920';ctx.fillRect(0,0,W,W);
  ctx.fillStyle='rgba(240,181,46,.05)';ctx.fillRect(BOX0*s,BOX0*s,BOXN*s,BOXN*s);
  ctx.strokeStyle='rgba(141,153,170,.12)';ctx.lineWidth=1;for(let i=0;i<=GRID;i++){ctx.beginPath();ctx.moveTo(i*s,0);ctx.lineTo(i*s,W);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*s);ctx.lineTo(W,i*s);ctx.stroke()}
  ctx.strokeStyle='rgba(240,181,46,.85)';ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(BOX0*s,BOX0*s,BOXN*s,BOXN*s);ctx.setLineDash([]);
}
function drawParts(ctx,parts,s){[...parts].filter(p=>DEF[p.id]).sort((a,b)=>Z[DEF[a.id].kind]-Z[DEF[b.id].kind]).forEach(p=>{const {d,fw,fh}=fp(p);drawPart(ctx,d,p.rot,p.x*s,p.y*s,s,(p.x+fw/2<GRID/2)!==(p.y+fh/2<GRID/2))})}
function renderHome(){
  document.querySelectorAll('[data-season]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.season===S.id));
  $('#hTag').textContent=S.tag;$('#ptsTitle').textContent=`${S.name} point values · ${S.rules}`;
  $('#ptsList').innerHTML=S.pts.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('');
  $('#hName').textContent=bot.name||'My Bot';
  const cv=$('#hPrev'),ctx=cv.getContext('2d'),s=cv.width/GRID;drawGridBg(ctx,s);drawParts(ctx,bot.parts,s);
  const st=compile(bot.parts);
  $('#hStats').innerHTML=`<dt>Inspection (${S.name})</dt><dd style="color:${st.legal?'var(--good)':'var(--bad)'}">${st.legal?'PASS':'FAIL'}</dd>
   <dt>Size</dt><dd>${st.wIn.toFixed(1)} × ${st.hIn.toFixed(1)} in</dd><dt>Weight</dt><dd>${st.lb.toFixed(1)} lb</dd><dt>Top speed</dt><dd>${Math.round(st.top)} in/s</dd>
   <dt>Launcher range</dt><dd>${st.shooter?st.shooter.range+' in':'none'}</dd><dt>Motors · servos</dt><dd>${st.motors}/${S.motors} · ${st.servos}/${S.servos}</dd>`;
}
document.querySelectorAll('[data-season]').forEach(b=>b.onclick=()=>{S=SEASONS[b.dataset.season];store.set('season',S.id);renderHome()});

/* ===== STUDIO ===== */
const grid=$('#grid'),gctx=grid.getContext('2d');let gs=24,sel=null,drag=null;
CATS.forEach(([k,l])=>{const o=document.createElement('option');o.value=k;o.textContent=l;$('#catSel').appendChild(o)});
$('#catSel').onchange=renderList;
function renderList(){
  const L=$('#plist');L.innerHTML='';
  PARTS.filter(p=>p.cat===$('#catSel').value).forEach(p=>{
    const b=document.createElement('button');b.className='pitem';b.type='button';
    const cv=document.createElement('canvas');cv.width=88;cv.height=88;const c=cv.getContext('2d'),s=Math.min(80/Math.max(p.w,p.h),12);drawPart(c,p,0,(88-p.w*s)/2,(88-p.h*s)/2,s,false);
    const t=document.createElement('div');t.innerHTML=`<b>${p.name}</b><span>${p.g} g · ${p.w}×${p.h} sq</span>`;
    b.append(cv,t);b.title=p.desc;b.addEventListener('pointerdown',e=>startPaletteDrag(e,p));L.appendChild(b);
  });
}
let pd=null;
function startPaletteDrag(e,p){
  pd={p,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,touch:e.pointerType!=='mouse'};
  const mv=ev=>{if(!pd)return;const dx=ev.clientX-pd.x0,dy=ev.clientY-pd.y0;
    if(!pd.moved&&Math.hypot(dx,dy)>6){if(pd.touch&&Math.abs(dy)>Math.abs(dx)){cleanup();return}pd.moved=true;pd.ghost=document.createElement('div');pd.ghost.className='ghost-drag';pd.ghost.textContent=p.name;document.body.appendChild(pd.ghost)}
    if(pd.ghost){pd.ghost.style.left=ev.clientX+'px';pd.ghost.style.top=ev.clientY+'px';ev.preventDefault()}};
  const up=ev=>{if(!pd)return;
    if(pd.moved){const r=grid.getBoundingClientRect();if(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom){const gx=Math.floor((ev.clientX-r.left)/r.width*GRID),gy=Math.floor((ev.clientY-r.top)/r.height*GRID);placeNew(p,gx-Math.floor(p.w/2),gy-Math.floor(p.h/2))}}
    else placeNew(p,Math.floor((GRID-p.w)/2),Math.floor((GRID-p.h)/2));cleanup()};
  const cleanup=()=>{if(pd&&pd.ghost)pd.ghost.remove();pd=null;window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cleanup)};
  window.addEventListener('pointermove',mv,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cleanup);
}
function clampP(p){const {fw,fh}=fp(p);p.x=Math.max(0,Math.min(GRID-fw,p.x));p.y=Math.max(0,Math.min(GRID-fh,p.y))}
function placeNew(d,x,y){const p={uid:uidN++,id:d.id,x,y,rot:0};clampP(p);bot.parts.push(p);sel=p.uid;saveBot();drawGrid()}
function layoutGrid(){const wrap=grid.parentElement.getBoundingClientRect().width;const W=Math.max(200,Math.min(wrap,620));gs=W/GRID;const dpr=window.devicePixelRatio||1;grid.width=Math.round(W*dpr);grid.height=Math.round(W*dpr);grid.style.width=W+'px';grid.style.height=W+'px';gctx.setTransform(dpr,0,0,dpr,0,0);drawGrid()}
function drawGrid(){
  drawGridBg(gctx,gs);gctx.fillStyle='rgba(240,181,46,.85)';gctx.font='600 11px JetBrains Mono, monospace';gctx.textAlign='center';gctx.textBaseline='alphabetic';gctx.fillText('▲ FRONT · 18 in',gs*GRID/2,BOX0*gs-6);
  drawParts(gctx,bot.parts,gs);
  const p=bot.parts.find(x=>x.uid===sel);if(p){const {fw,fh}=fp(p);gctx.strokeStyle=C.fg;gctx.lineWidth=2;gctx.setLineDash([5,3]);gctx.strokeRect(p.x*gs+1,p.y*gs+1,fw*gs-2,fh*gs-2);gctx.setLineDash([])}
  updateCounters();
}
function updateCounters(){
  const st=compile(bot.parts);
  const set=(id,val,max,txt)=>{const m=$(id);m.querySelector('.mono').textContent=txt;m.querySelector('i').style.width=Math.min(100,val/max*100)+'%';m.classList.toggle('over',val>max)};
  set('#mMot',st.motors,S.motors,`${st.motors} / ${S.motors}`);set('#mSrv',st.servos,S.servos,`${st.servos} / ${S.servos}`);
  set('#mWt',st.lb,25,`${st.lb.toFixed(1)} lb`);set('#mSize',Math.max(st.wIn,st.hIn),18,`${st.wIn.toFixed(1)} × ${st.hIn.toFixed(1)} in`);
  const fits=bot.parts.length&&st.wSq<=BOXN&&st.hSq<=BOXN;const ft=$('#fitTag');ft.className='fit '+(fits?'ok':'no');ft.textContent=bot.parts.length?(fits?'Fits 18 × 18 in':'Too big for 18 × 18 in'):'Empty';
  const p=bot.parts.find(x=>x.uid===sel);
  $('#selInfo').innerHTML=p?`<b style="color:var(--fg)">${DEF[p.id].name}</b><br>${DEF[p.id].desc}<br><span class="mono">${DEF[p.id].g} g · col ${p.x-BOX0+1}, row ${p.y-BOX0+1}${p.rot?' · rotated':''}</span>`:'Nothing selected. Click a part on the grid to move, rotate or delete it.';
}
const cellAt=e=>{const r=grid.getBoundingClientRect();return{gx:(e.clientX-r.left)/r.width*GRID,gy:(e.clientY-r.top)/r.height*GRID}};
function partAt(gx,gy){const s=[...bot.parts].sort((a,b)=>Z[DEF[b.id].kind]-Z[DEF[a.id].kind]);return s.find(p=>{const {fw,fh}=fp(p);return gx>=p.x&&gx<p.x+fw&&gy>=p.y&&gy<p.y+fh})}
grid.addEventListener('pointerdown',e=>{const {gx,gy}=cellAt(e);const p=partAt(gx,gy);if(p){sel=p.uid;drag={p,ox:gx-p.x,oy:gy-p.y};grid.setPointerCapture(e.pointerId)}else sel=null;drawGrid()});
grid.addEventListener('pointermove',e=>{if(!drag)return;const {gx,gy}=cellAt(e);const nx=Math.round(gx-drag.ox),ny=Math.round(gy-drag.oy);if(nx!==drag.p.x||ny!==drag.p.y){drag.p.x=nx;drag.p.y=ny;clampP(drag.p);drawGrid()}});
grid.addEventListener('pointerup',()=>{if(drag){drag=null;saveBot()}});
const selP=()=>bot.parts.find(x=>x.uid===sel);
function rotSel(){const p=selP();if(!p)return;p.rot^=1;clampP(p);saveBot();drawGrid()}
function delSel(){const p=selP();if(!p)return;bot.parts=bot.parts.filter(x=>x!==p);sel=null;saveBot();drawGrid()}
function dupSel(){const p=selP();if(!p)return;const n={...p,uid:uidN++,x:p.x+1,y:p.y+1};clampP(n);bot.parts.push(n);sel=n.uid;saveBot();drawGrid()}
$('#tRot').onclick=rotSel;$('#tDel').onclick=delSel;$('#tDup').onclick=dupSel;
$('#tStarter').onclick=()=>{bot.parts=STARTER().map(p=>({...p,uid:uidN++}));bot.name='Starter Bot';$('#botName').value=bot.name;sel=null;saveBot();drawGrid()};
$('#tClear').onclick=()=>$('#clearConfirm').hidden=false;$('#tClearNo').onclick=()=>$('#clearConfirm').hidden=true;
$('#tClearYes').onclick=()=>{bot.parts=[];sel=null;saveBot();drawGrid();$('#clearConfirm').hidden=true};
$('#botName').addEventListener('input',e=>{bot.name=e.target.value||'My Bot';saveBot()});
window.addEventListener('keydown',e=>{if($('#studio').hidden||e.target.tagName==='INPUT')return;if(e.key==='r'||e.key==='R')rotSel();else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();delSel()}else if(e.key==='d'||e.key==='D')dupSel()});
window.addEventListener('resize',()=>{if(!$('#studio').hidden)layoutGrid();if(!$('#match').hidden)sizeField()});
$('#sHome').onclick=()=>show('home');$('#sDone').onclick=()=>showStats();

function showStats(){
  const st=compile(bot.parts);const tile=(v,l)=>`<div class="tile"><div class="v">${v}</div><div class="l">${l}</div></div>`;
  $('#statsSheet').innerHTML=`
   <div class="row" style="justify-content:space-between"><div><div class="eyebrow">Robot stats · checked against ${S.name} ${S.yrs} rules</div><h2>${esc(bot.name)}</h2></div><span class="badge ${st.legal?'pass':'fail'}">${st.legal?'INSPECTION PASS':'INSPECTION FAIL'}</span></div>
   <div class="tiles">
    ${tile(st.lb.toFixed(1)+' lb','Weight · '+(st.massG||0)+' g incl. hardware')}
    ${tile(st.wIn.toFixed(1)+'×'+st.hIn.toFixed(1),'Footprint in inches (max 18)')}
    ${tile(Math.round(st.top)+' in/s','Top speed'+(st.driveRpm?' · '+st.driveRpm+' RPM drive':''))}
    ${tile(Math.round(st.accel||0)+' in/s²','Acceleration')}
    ${tile(Math.round(st.turn||0)+'°/s','Turn rate')}
    ${tile(st.holo?'Mecanum':st.top?'Tank':'None','Drive · '+(st.drivePowered||0)+'/'+(st.wheels||0)+' wheels powered')}
    ${tile(st.shooter?st.shooter.range+' in':'—','Launch range'+(st.shooter?' · '+st.shooter.rpm+' RPM':''))}
    ${tile(st.shooter?'±'+st.shooter.spread.toFixed(1)+'°':'—','Shot spread')}
    ${tile((st.capacity||0)+' / '+S.control,'Pieces held (control limit)')}
    ${tile(st.sorter?'Yes':'No','Sorter (choose what to shoot)')}
   </div>
   <div class="cols">
    <div><h3 style="font-size:16px;margin-bottom:6px">Part counts</h3><table>${Object.entries(st.counts).map(([k,v])=>`<tr><td>${k}</td><td class="n">${v}${k==='DC motors'?' / '+S.motors:k==='Servos'?' / '+S.servos:''}</td></tr>`).join('')}</table></div>
    <div>${st.errors.length?`<h3 style="font-size:16px;margin-bottom:6px;color:var(--bad)">Must fix to compete</h3><ul class="list err">${st.errors.map(e=>`<li>${e}</li>`).join('')}</ul><br>`:''}
     <h3 style="font-size:16px;margin-bottom:6px">Improvement tips</h3><ul class="list tip">${st.tips.map(e=>`<li>${e}</li>`).join('')}</ul></div>
   </div>
   <div class="row" style="margin-top:18px;justify-content:flex-end">
    <button class="btn ghost" id="stEdit">Keep editing</button><button class="btn" id="st2p" ${st.legal?'':'disabled'}>Vs. a Person</button><button class="btn primary" id="stSolo" ${st.legal?'':'disabled'}>Play Solo</button>
   </div>`;
  modal('statsModal',true);
  $('#stEdit').onclick=()=>modal('statsModal',false);$('#stSolo').onclick=()=>{modal('statsModal',false);setup('solo')};$('#st2p').onclick=()=>{modal('statsModal',false);setup('2p')};
}

/* ===== MATCH SETUP ===== */
function setup(kind){
  const st=compile(bot.parts);if(!st.legal){showStats();return}
  const f=S.fKey;
  $('#setupSheet').innerHTML=kind==='solo'?`
   <div class="eyebrow">Solo · ${S.name} · 2:30 match</div><h2>How should this match run?</h2>
   <div class="opt">
    <label><input type="radio" name="mode" value="drive" checked>Drive it myself<small>Your bot runs its own AUTO program for 30 s, then you take the controls for 2:00 of TELEOP.</small></label>
    <label><input type="radio" name="mode" value="sim">Computer simulates<small>The sim drives your bot the whole match. Speed it up and stop any time.</small></label>
   </div>
   <div class="row" style="justify-content:flex-end"><button class="btn ghost" id="suX">Cancel</button><button class="btn primary" id="suGo">Start match</button></div>`:`
   <div class="eyebrow">2 players · one keyboard · ${S.name}</div><h2>Blue vs Red</h2>
   <p style="color:var(--mute)">Blue uses <b>${esc(bot.name)}</b>. Pick Red's robot.</p>
   <div class="opt">
    <label><input type="radio" name="red" value="mine" checked>Same robot<small>${esc(bot.name)} — a mirror match</small></label>
    <label><input type="radio" name="red" value="starter">Starter Bot<small>The default build</small></label>
   </div>
   <p class="keys" style="text-align:left">Blue: <kbd>W A S D</kbd> move · <kbd>Q</kbd><kbd>E</kbd> turn · <kbd>Space</kbd> shoot · <kbd>F</kbd> ${f.toLowerCase()} · <kbd>C</kbd> pick piece<br>Red: <kbd>↑ ← ↓ →</kbd> move · <kbd>,</kbd><kbd>.</kbd> turn · <kbd>Enter</kbd> shoot · <kbd>/</kbd> ${f.toLowerCase()} · <kbd>;</kbd> pick piece</p>
   <div class="row" style="justify-content:flex-end"><button class="btn ghost" id="suX">Cancel</button><button class="btn primary" id="suGo">Start match</button></div>`;
  modal('setupModal',true);$('#suX').onclick=()=>modal('setupModal',false);
  $('#suGo').onclick=()=>{
    if(kind==='solo'){const m=document.querySelector('input[name=mode]:checked').value;modal('setupModal',false);startMatch({kind:'solo',sim:m==='sim'})}
    else{const r=document.querySelector('input[name=red]:checked').value;modal('setupModal',false);startMatch({kind:'2p',redParts:r==='mine'?bot.parts:STARTER(),redName:r==='mine'?bot.name:'Starter Bot'})}
  };
}

/* ===== SHARED GAME ENGINE ===== */
const F=144,MX=22,TOP=14,BOTM=6,WW=F+MX*2,WH=TOP+F+BOTM;
const field=$('#field'),fctx=field.getContext('2d');let K=5;
function sizeField(){const avail=Math.min(980,field.parentElement.getBoundingClientRect().width);const hAvail=window.innerHeight-230;const w=Math.max(280,Math.min(avail,hAvail*WW/WH));K=w/WW;const dpr=window.devicePixelRatio||1;field.width=Math.round(w*dpr);field.height=Math.round(w*WH/WW*dpr);field.style.width=w+'px';field.style.height=w*WH/WW+'px';fctx.setTransform(dpr*K,0,0,dpr*K,dpr*K*MX,dpr*K*TOP)}
const AUTO=30,TRANS=8,TELE=120,TOTAL=AUTO+TRANS+TELE;
const BR={P:2.5,G:2.5,Y:1.4,R:1.8,B:1.8};const BCOL={P:C.purple,G:C.green,Y:C.pollen,R:C.nred,B:C.nblue};
const inTri=(p,t)=>{const s=(a,b,c)=>(a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1]);const d1=s(p,t[0],t[1]),d2=s(p,t[1],t[2]),d3=s(p,t[2],t[0]);return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0))};
const inRect=(x,y,r)=>x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3];
const wrap=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a};
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const opp=al=>al==='blue'?'red':'blue';
let G=null,raf=0,keys=new Set();
function corners(r){const c=Math.cos(r.th),s=Math.sin(r.th),hw=r.b.halfW,hh=r.b.halfH;return[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh],[0,-hh],[0,hh],[-hw,0],[hw,0],[0,0]].map(([lx,ly])=>[r.x+lx*c-ly*s,r.y+lx*s+ly*c])}
const toLocal=(r,x,y)=>{const dx=x-r.x,dy=y-r.y,c=Math.cos(r.th),s=Math.sin(r.th);return[dx*c+dy*s,-dx*s+dy*c]};
const toWorld=(r,lx,ly)=>{const c=Math.cos(r.th),s=Math.sin(r.th);return[r.x+lx*c-ly*s,r.y+lx*s+ly*c]};
const headTo=(x0,y0,x1,y1)=>Math.atan2(x1-x0,-(y1-y0));
function rectDist(r,x,y){const[lx,ly]=toLocal(r,x,y);const dx=Math.max(0,Math.abs(lx)-r.b.halfW),dy=Math.max(0,Math.abs(ly)-r.b.halfH);return Math.hypot(dx,dy)}
const touchingWall=r=>corners(r).some(([x,y])=>x<.8||y<.8||x>F-.8||y>F-.8);

function makeRobot(al,parts,name,ctrl){const b=compile(parts);const r={al,b,name,ctrl,x:0,y:0,th:0,vx:0,vy:0,om:0,hold:[],sel:0,cd:0,pick:0,ai:{tgt:null,bl:new Map(),best:1e9,since:0},cmd:{mode:'field',a:0,b:0,head:null,t:0},fouls:0};Object.assign(r,M().start(al,b));return r}
const M=()=>MODES[G?G.season.id:S.id];
function startMatch(opt){
  const robots=[makeRobot('blue',bot.parts,bot.name,opt.kind==='2p'?'p1':(opt.sim?'ai':'p1'))];
  if(opt.kind==='2p')robots.push(makeRobot('red',opt.redParts,opt.redName,'p2'));
  G={season:S,opt,robots,balls:[],t:0,phase:'auto',speed:1,done:false,last:performance.now(),hpT:{blue:0,red:0},
     sc:{blue:{},red:{}},flags:{}};
  M().init(G);
  $('#redBox').style.visibility=opt.kind==='2p'?'visible':'hidden';
  $('#lBlue').textContent=opt.kind==='2p'?'BLUE · P1':(opt.sim?'BLUE · SIM':'BLUE · YOU');$('#lRed').textContent='RED · P2';
  $('#mSpeed').hidden=!(opt.kind==='solo'&&opt.sim);$('#mSpeed').textContent='Speed 1×';$('#padF').textContent=S.fKey;
  const fk=S.fKey.toLowerCase();
  $('#keys').innerHTML=opt.kind==='2p'?`Blue: <kbd>WASD</kbd> <kbd>Q</kbd><kbd>E</kbd> <kbd>Space</kbd> shoot <kbd>F</kbd> ${fk} <kbd>C</kbd> pick · Red: <kbd>Arrows</kbd> <kbd>,</kbd><kbd>.</kbd> <kbd>Enter</kbd> shoot <kbd>/</kbd> ${fk} <kbd>;</kbd> pick`:
    opt.sim?'The computer is driving. Use <kbd>Stop match</kbd> to end early.':`<kbd>W A S D</kbd> move (field-centric on mecanum) · <kbd>Q</kbd><kbd>E</kbd> turn · <kbd>Space</kbd> shoot · <kbd>F</kbd> ${M().fHelp} · <kbd>C</kbd> pick which piece`;
  show('match');sizeField();keys.clear();toast(M().intro(G));cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);sfx('start');
}
function toast(m){if(!G)return;$('#toast').textContent=m;G.toastT=3.5}
$('#mStop').onclick=()=>{if(G&&!G.done)finish(true)};
$('#mSpeed').onclick=()=>{if(!G)return;G.speed=G.speed===1?2:G.speed===2?4:1;$('#mSpeed').textContent=`Speed ${G.speed}×`};
const P1K=['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','Space','KeyF','KeyC'],P2K=['ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Comma','Period','Enter','Slash','Semicolon'];
const soloMap=c=>G&&G.opt.kind==='solo'?({ArrowUp:'KeyW',ArrowLeft:'KeyA',ArrowDown:'KeyS',ArrowRight:'KeyD'}[c]||c):c;
window.addEventListener('keydown',e=>{if(!G||G.done||$('#match').hidden)return;const c=soloMap(e.code);
  if(P1K.includes(c)||P2K.includes(c)){e.preventDefault();if(!keys.has(c))press(c);keys.add(c)}if(e.code==='Escape')finish(true)});
window.addEventListener('keyup',e=>keys.delete(soloMap(e.code)));
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();if(!keys.has(k))press(k);keys.add(k)});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>keys.delete(k)))});
function press(c){
  if(!G||G.phase!=='tele')return;
  const r=G.robots.find(r=>(r.ctrl==='p1'&&P1K.includes(c))||(r.ctrl==='p2'&&P2K.includes(c)));if(!r)return;
  const i=(r.ctrl==='p1'?P1K:P2K).indexOf(c);
  if(i===6)shoot(r);else if(i===7)M().actF(r);
  else if(i===8&&r.hold.length){if(!r.b.sorter){r.sel=0;toast('No sorter — add a positional servo next to the hopper to pick pieces.')}else r.sel=(r.sel+1)%r.hold.length}
}
function takeSel(r){const idx=r.b.sorter?Math.min(r.sel,r.hold.length-1):0;const c=r.hold.splice(idx,1)[0];r.sel=0;return c}
function shoot(r){
  if(!r.b.shooter){toast('No working launcher on this robot.');return}
  if(!r.hold.length||r.cd>0)return;
  const chk=M().canLaunch(r);if(chk.block){toast(chk.msg);return}
  const sh=r.b.shooter,tg=M().target(r);const [sx,sy]=toWorld(r,sh.L.x,sh.L.y);
  let ang=r.th;
  if(r.b.turret){const want=headTo(sx,sy,tg.x,tg.y);ang=r.th+Math.max(-1.22,Math.min(1.22,wrap(want-r.th)))}
  ang+=gauss()*sh.spread*Math.PI/180;
  const dist=Math.hypot(tg.x-sx,tg.y-sy);
  const max=Math.min(sh.range,dist+(tg.over||0))*(1+gauss()*.035);
  const c=takeSel(r);
  G.balls.push({x:sx,y:sy,vx:Math.sin(ang)*sh.speed+r.vx,vy:-Math.cos(ang)*sh.speed+r.vy,c,r:BR[c],air:1,d:0,max,from:r.al,illegal:!!chk.foul});
  r.cd=sh.cd;sfx('shoot');
  if(chk.foul){G.sc[opp(r.al)].foul=(G.sc[opp(r.al)].foul||0)+5;r.fouls++;toast(chk.msg);sfx('foul')}
}
function goTo(r,tx,ty,head,slow=12){const cmd=r.cmd,dx=tx-r.x,dy=ty-r.y,d=Math.hypot(dx,dy);if(d>.8){const sp=Math.min(1,Math.max(.3,d/slow));cmd.a=dx/d*sp;cmd.b=dy/d*sp}if(head!=null)cmd.head=head;return d}
function aiCollect(r,dt,filter){
  const b=r.b,a=r.ai;const t=pickTarget(r,filter);if(!t)return false;
  const it=b.intakes[0],ix=it.x+it.w/2,iy=it.y+it.h/2,ai=Math.atan2(ix,-iy);
  const ang=headTo(r.x,r.y,t.x,t.y),d=Math.hypot(t.x-r.x,t.y-r.y);
  if(a.tgt!==t){a.tgt=t;a.best=d;a.since=0}if(d<a.best-1.5){a.best=d;a.since=0}else a.since+=dt;
  if(a.since>2.6){a.bl.set(t,G.t+8);a.tgt=null}
  const err=Math.abs(wrap(ang-ai-r.th));goTo(r,t.x,t.y,ang-ai,err>.6?40:14);
  if(err>.9&&b.holo){r.cmd.a*=.25;r.cmd.b*=.25}
  return true;
}
function pickTarget(r,filter){
  let best=null,bd=1e9;
  for(const b of G.balls){if(b.air||(r.ai.bl.get(b)||0)>G.t)continue;if(!M().canTake(r,b))continue;if(filter&&!filter(b))continue;
    if(b.x<r.b.halfW*.5-3||b.x>F-r.b.halfW*.5+3)continue;
    const d=Math.hypot(b.x-r.x,b.y-r.y)*(M().prefer?M().prefer(r,b):1);if(d<bd){bd=d;best=b}}
  return best;
}
function aimShot(r,tg,turretTol){
  const sh=r.b.shooter;if(!sh||!r.hold.length||r.cd>0)return false;
  const [sx,sy]=toWorld(r,sh.L.x,sh.L.y);const d=Math.hypot(tg.x-sx,tg.y-sy);if(d>sh.range*1.02)return false;
  const err=Math.abs(wrap(headTo(sx,sy,tg.x,tg.y)-r.th));if(err>(r.b.turret?1.2:(turretTol||.06)))return false;
  return true;
}
function playerCmd(r){
  const ks=r.ctrl==='p1'?P1K:P2K,k=i=>keys.has(ks[i])?1:0;const cmd=r.cmd;const f=k(0)-k(2),s=k(3)-k(1),t=k(5)-k(4);
  if(r.b.holo){cmd.mode='field';cmd.a=s;cmd.b=-f;cmd.head=null;cmd.t=t}else{cmd.mode='robot';cmd.a=0;cmd.b=f;cmd.head=null;cmd.t=t+s}
}
function physRobot(r,dt){
  const b=r.b,cmd=r.cmd;r.cd=Math.max(0,r.cd-dt);r.pick=Math.max(0,r.pick-dt);
  let dvx=0,dvy=0,t=cmd.t;const Fw=[Math.sin(r.th),-Math.cos(r.th)];
  if(b.top>0&&G.phase!=='trans'){
    if(cmd.head!=null)t=Math.max(-1,Math.min(1,wrap(cmd.head-r.th)*3.5));
    if(b.holo){if(cmd.mode==='field'){const m=Math.hypot(cmd.a,cmd.b),n=m>1?m:1;dvx=cmd.a/n*b.top;dvy=cmd.b/n*b.top}else{dvx=Fw[0]*cmd.b*b.top;dvy=Fw[1]*cmd.b*b.top}}
    else{if(cmd.mode==='field'){const m=Math.hypot(cmd.a,cmd.b);if(m>.05){const dot=cmd.a*Fw[0]+cmd.b*Fw[1];const dir=Math.atan2(cmd.a,-cmd.b);if(cmd.head==null){const e1=wrap(dir-r.th),e2=wrap(dir+Math.PI-r.th);const e=Math.abs(e1)<Math.abs(e2)?e1:e2;t=Math.max(-1,Math.min(1,e*3.5))}const sp=dot*b.top;dvx=Fw[0]*sp;dvy=Fw[1]*sp}}
      else{dvx=Fw[0]*cmd.b*b.top;dvy=Fw[1]*cmd.b*b.top}}
  }
  const ax=dvx-r.vx,ay=dvy-r.vy,am=Math.hypot(ax,ay),lim=(b.accel||1)*dt;if(am>lim){r.vx+=ax/am*lim;r.vy+=ay/am*lim}else{r.vx=dvx;r.vy=dvy}
  const wt=t*(b.turn||0)*Math.PI/180,dw=wt-r.om,wl=(b.turn||0)*Math.PI/180*6*dt;r.om+=Math.max(-wl,Math.min(wl,dw));
  if(G.phase==='trans'){r.vx*=.8;r.vy*=.8;r.om*=.8}
  r.x+=r.vx*dt;r.y+=r.vy*dt;r.th=wrap(r.th+r.om*dt);
  for(let it=0;it<2;it++){const cs=corners(r);let px=0,py=0;cs.forEach(([x,y])=>{if(x<0)px=Math.max(px,-x);if(x>F)px=Math.min(px,F-x);if(y<0)py=Math.max(py,-y);if(y>F)py=Math.min(py,F-y)});
    if(px){r.x+=px;r.vx*=.2}if(py){r.y+=py;r.vy*=.2}M().robotObst(r)}
  // circular obstacles
  (M().circles||[]).forEach(([cx,cy,rad])=>{const[lx,ly]=toLocal(r,cx,cy);const qx=Math.max(-r.b.halfW,Math.min(r.b.halfW,lx)),qy=Math.max(-r.b.halfH,Math.min(r.b.halfH,ly));const[wx,wy]=toWorld(r,qx,qy);const dx=wx-cx,dy=wy-cy,d=Math.hypot(dx,dy);if(d<rad){const n=d>.01?[dx/d,dy/d]:[r.x-cx,r.y-cy].map(v=>v/(Math.hypot(r.x-cx,r.y-cy)||1));r.x+=n[0]*(rad-d);r.y+=n[1]*(rad-d);r.vx*=.3;r.vy*=.3}});
}
function step(dt){
  G.t+=dt;const prev=G.phase;
  G.phase=G.t<AUTO?'auto':G.t<AUTO+TRANS?'trans':G.t<TOTAL?'tele':'end';
  if(prev==='auto'&&G.phase!=='auto'){M().endAuto(G);toast(G.opt.sim?'AUTO over. TELEOP in 8 s…':'AUTO over. Get ready — TELEOP in 8 s…');sfx('buzz')}
  if(prev==='trans'&&G.phase==='tele'){toast(G.opt.sim?'TELEOP':'TELEOP — you have the controls!');sfx('start')}
  if(G.phase==='end'){finish(false);return}
  M().tick(G,dt);
  G.robots.forEach(r=>{const cmd=r.cmd;cmd.mode='field';cmd.a=0;cmd.b=0;cmd.head=null;cmd.t=0;
    if(G.phase==='auto'||r.ctrl==='ai'){if(r.b.top)M().ai(r,dt)}else if(G.phase==='tele')playerCmd(r);physRobot(r,dt)});
  if(G.robots.length===2){const[a,b]=G.robots;const ra=Math.max(a.b.halfW,a.b.halfH)*.95,rb=Math.max(b.b.halfW,b.b.halfH)*.95;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01;if(d<ra+rb){const o=ra+rb-d,pa=b.b.push/(a.b.push+b.b.push||1);a.x-=dx/d*o*pa;a.y-=dy/d*o*pa;b.x+=dx/d*o*(1-pa);b.y+=dy/d*o*(1-pa)}}
  const keep=[];
  for(const b of G.balls){
    if(b.air){b.x+=b.vx*dt;b.y+=b.vy*dt;b.d+=Math.hypot(b.vx,b.vy)*dt;
      if(M().inFlight(b))continue;
      if(b.x<b.r||b.x>F-b.r||b.y<b.r||b.y>F-b.r){b.air=0;b.vx*=-.25;b.vy*=-.25;b.x=Math.max(b.r,Math.min(F-b.r,b.x));b.y=Math.max(b.r,Math.min(F-b.r,b.y))}
      else if(b.d>=b.max){if(M().land(b))continue;b.air=0;b.vx*=.15;b.vy*=.15}
      keep.push(b);continue}
    b.vx*=Math.max(0,1-2.2*dt);b.vy*=Math.max(0,1-2.2*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.4}if(b.x>F-b.r){b.x=F-b.r;b.vx=-Math.abs(b.vx)*.4}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*.4}if(b.y>F-b.r){b.y=F-b.r;b.vy=-Math.abs(b.vy)*.4}
    M().ballObst(b);
    let gone=false;
    for(const r of G.robots){const[lx,ly]=toLocal(r,b.x,b.y);const hw=r.b.halfW+b.r,hh=r.b.halfH+b.r;
      if(r.hold.length<r.b.capacity&&r.pick<=0&&G.phase!=='trans'&&M().canTake(r,b)){for(const it of r.b.intakes){if(lx>it.x-1.5&&lx<it.x+it.w+1.5&&ly>it.y-3.5&&ly<it.y+it.h+3.5){r.hold.push(b.c);r.pick=it.rate;gone=true;sfx('pick');break}}}
      if(gone)break;
      if(Math.abs(lx)<hw&&Math.abs(ly)<hh){const px=hw-Math.abs(lx),py=hh-Math.abs(ly);let nlx=lx,nly=ly;if(px<py)nlx=Math.sign(lx||1)*hw;else nly=Math.sign(ly||1)*hh;const[wx,wy]=toWorld(r,nlx,nly);b.vx=(wx-b.x)/dt*.3+r.vx;b.vy=(wy-b.y)/dt*.3+r.vy;b.x=wx;b.y=wy}}
    if(!gone)keep.push(b);
  }
  G.balls=keep;
  const gb=G.balls.filter(b=>!b.air);for(let i=0;i<gb.length;i++)for(let j=i+1;j<gb.length;j++){const a=gb[i],c=gb[j],dx=c.x-a.x,dy=c.y-a.y,d2=dx*dx+dy*dy,rs=a.r+c.r;if(d2<rs*rs&&d2>1e-6){const d=Math.sqrt(d2),o=(rs-d)/2;a.x-=dx/d*o;a.y-=dy/d*o;c.x+=dx/d*o;c.y+=dy/d*o}}
}
function loop(now){
  if(!G||G.done)return;let dt=Math.min(.05,(now-G.last)/1000);G.last=now;
  let sim=dt*G.speed;while(sim>0&&!G.done){const h=Math.min(1/120,sim);step(h);sim-=h}
  if(G.toastT!=null){G.toastT-=dt;if(G.toastT<=0){$('#toast').textContent='';G.toastT=null}}
  if(G.done)return;render();raf=requestAnimationFrame(loop);
}
function drawBall(c,b,r){c.fillStyle=BCOL[b.c];c.beginPath();c.arc(b.x,b.y,r,0,Math.PI*2);c.fill();if(b.c==='R'||b.c==='B'){c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.45;c.stroke()}c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(b.x-r*.35,b.y-r*.35,r*.35,0,Math.PI*2);c.fill()}
function render(){
  const c=fctx;c.save();c.clearRect(-MX,-TOP,WW,WH);c.fillStyle='#0b0e12';c.fillRect(-MX,-TOP,WW,WH);
  for(let i=0;i<6;i++)for(let j=0;j<6;j++){c.fillStyle=(i+j)%2?'#2b3038':'#2e343d';c.fillRect(i*24,j*24,24,24)}
  c.strokeStyle='#22262d';c.lineWidth=.35;for(let i=1;i<6;i++){c.beginPath();c.moveTo(i*24,0);c.lineTo(i*24,F);c.stroke();c.beginPath();c.moveTo(0,i*24);c.lineTo(F,i*24);c.stroke()}
  c.textAlign='center';c.textBaseline='alphabetic';
  M().drawUnder(c);
  c.strokeStyle='#cfd6df';c.lineWidth=1.6;c.strokeRect(-.8,-.8,F+1.6,F+1.6);
  G.balls.filter(b=>!b.air).forEach(b=>drawBall(c,b,b.r));
  G.robots.forEach(r=>{c.save();c.translate(r.x,r.y);c.rotate(r.th);const col=r.al==='blue'?C.blue:C.red;
    c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-r.b.halfW+1,-r.b.halfH+1.5,r.b.halfW*2,r.b.halfH*2);
    [...r.b.P].sort((a,b)=>Z[a.d.kind]-Z[b.d.kind]).forEach(p=>drawPart(c,p.d,p.rot,p.L.x,p.L.y,IN_PER_SQ,p.mirror));
    c.strokeStyle=col;c.lineWidth=1.1;c.strokeRect(-r.b.halfW-.5,-r.b.halfH-.5,r.b.halfW*2+1,r.b.halfH*2+1);
    c.fillStyle=col;c.beginPath();c.moveTo(0,-r.b.halfH-3.2);c.lineTo(-2,-r.b.halfH-1);c.lineTo(2,-r.b.halfH-1);c.fill();
    r.hold.forEach((h,i)=>{c.fillStyle=BCOL[h];c.beginPath();c.arc(-4+i*2.8,0,1.2,0,Math.PI*2);c.fill()});c.restore();
    c.fillStyle='#fff';c.font='700 3px Chakra Petch, sans-serif';c.fillText(G.phase==='auto'?'AUTO':r.ctrl==='ai'?'SIM':r.ctrl==='p1'?(G.opt.kind==='2p'?'P1':'YOU'):'P2',r.x,r.y-Math.max(r.b.halfW,r.b.halfH)-4)});
  M().drawOver(c);
  G.balls.filter(b=>b.air).forEach(b=>{const f=Math.min(1,b.d/b.max),h=4*f*(1-f);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(b.x+h*3,b.y+h*3,b.r,0,Math.PI*2);c.fill();drawBall(c,b,b.r*(1+h*.7))});
  c.restore();
  const rem=G.phase==='auto'?AUTO-G.t:G.phase==='trans'?AUTO+TRANS-G.t:TOTAL-G.t;const m=Math.floor(Math.max(0,rem)/60),sec=Math.floor(Math.max(0,rem)%60);
  $('#clock').textContent=`${m}:${String(sec).padStart(2,'0')}`;
  $('#phase').textContent=G.phase==='auto'?'AUTONOMOUS':G.phase==='trans'?'TRANSITION':(TOTAL-G.t<M().endgame?'ENDGAME':'TELEOP');
  $('#sBlue').textContent=M().live(G,'blue');$('#sRed').textContent=M().live(G,'red');
  const holdHTML=r=>{if(!r)return'';const cap=r.b.capacity||0;let h=`<span>${r.al==='blue'?'Blue':'Red'} holding</span>`;for(let i=0;i<Math.max(cap,1);i++){const v=r.hold[i];h+=`<i class="ball ${v?'':'empty'} ${v&&r.b.sorter&&i===r.sel?'sel':''}" style="${v?'background:'+BCOL[v]:''}"></i>`}return h};
  $('#holdB').innerHTML=holdHTML(G.robots[0]);$('#holdR').innerHTML=holdHTML(G.robots[1]);
}
function finish(stopped){if(!G||G.done)return;G.done=true;cancelAnimationFrame(raf);if(G.t<AUTO)M().endAuto(G);M().endMatch(G);sfx('buzz');showResults(stopped)}

/* ===== DECODE ===== */
const LZ_BIG=[[0,0],[F,0],[72,72]],LZ_SMALL=[[48,F],[96,F],[72,F-24]];
const DGOAL={blue:{c:[9,9],n:[1,1]},red:{c:[F-9,9],n:[-1,1]}};
const goalS=(al,x,y)=>al==='blue'?(x+y-27)/Math.SQRT2:((F-x)+y-27)/Math.SQRT2;
const DZ={blue:{gate:[0,64,11,12],base:[93,93,18,18],load:[F-23,F-23,23,23],ramp:-11},red:{gate:[F-11,64,11,12],base:[33,93,18,18],load:[0,F-23,23,23],ramp:F+11}};
const inLaunch=r=>corners(r).some(p=>inTri(p,LZ_BIG)||inTri(p,LZ_SMALL));
const DEC={
  endgame:20,fHelp:'open gate',
  start(al,b){return{x:al==='blue'?54:90,y:F-1-b.halfH,th:0}},
  init(G){
    G.motif=['GPP','PGP','PPG'][Math.floor(Math.random()*3)];G.ramps={blue:[],red:[]};G.supply={blue:6,red:6};
    ['blue','red'].forEach(al=>G.sc[al]={leave:0,cls:0,ovf:0,patA:0,patT:0,base:0,foul:0});
    [60,84,108].forEach((y,ri)=>{const pat=['GPP','PGP','PPG'][ri];[0,1,2].forEach(i=>{G.balls.push({x:15+i*5.6,y,vx:0,vy:0,c:pat[i],r:2.5,air:0});G.balls.push({x:F-15-i*5.6,y,vx:0,vy:0,c:pat[i],r:2.5,air:0})})});
    G.robots.forEach(r=>{r.hold=['P','G','P'].slice(0,Math.min(3,r.b.capacity||0))});
  },
  intro:G=>`Motif ${G.motif.split('').join(' · ')}. AUTO: your robot runs its program.`,
  canTake:()=>true,
  canLaunch(r){return inLaunch(r)?{}:{foul:true,msg:`MINOR FOUL: ${r.al} launched outside a launch zone (+5 ${opp(r.al)}).`}},
  target(r){return{x:DGOAL[r.al].c[0],y:DGOAL[r.al].c[1],over:8}},
  inFlight(b){for(const al of ['blue','red'])if(goalS(al,b.x,b.y)<0){DEC.score(b,al);return true}return false},
  land:()=>false,
  score(b,al){const ramp=G.ramps[al];if(ramp.length<9){ramp.push(b.c);G.sc[al].cls++;sfx('score')}else{G.sc[al].ovf++;G.supply[al]++;sfx('ovf')}
    if(b.illegal){G.sc[opp(b.from)].foul+=10;toast(`MAJOR FOUL: illegal launch scored (+15 total to ${opp(b.from)}).`)}},
  pat:al=>G.ramps[al].reduce((s,c,i)=>s+(c===G.motif[i%3]?2:0),0),
  actF(r){const z=DZ[r.al].gate;if(!corners(r).some(p=>inRect(p[0],p[1],[z[0]-2,z[1]-2,z[2]+4,z[3]+4]))){toast('Drive into your GATE zone to open the gate.');return}
    const ramp=G.ramps[r.al];if(!ramp.length)return;const left=r.al==='blue';
    ramp.forEach((c,i)=>G.balls.push({x:left?4:F-4,y:z[1]+z[3]+2+i*.3,vx:(left?1:-1)*(20+Math.random()*25),vy:15+Math.random()*25,c,r:2.5,air:0}));
    G.ramps[r.al]=[];toast(`${r.al.toUpperCase()} gate opened — ramp emptied.`);sfx('gate')},
  robotObst(r){['blue','red'].forEach(al=>{let m=0;corners(r).forEach(([x,y])=>{m=Math.min(m,goalS(al,x,y))});if(m<0){const n=DGOAL[al].n;r.x-=m*n[0]/Math.SQRT2;r.y-=m*n[1]/Math.SQRT2}})},
  ballObst(b){['blue','red'].forEach(al=>{const s=goalS(al,b.x,b.y)-b.r;if(s<0){const n=DGOAL[al].n;b.x-=s*n[0]/Math.SQRT2;b.y-=s*n[1]/Math.SQRT2}})},
  tick(G,dt){
    if(G.phase==='tele'&&TOTAL-G.t<20&&!G.flags.end){G.flags.end=1;toast('ENDGAME — 20 s left. Park in your BASE.');sfx('buzz')}
    if(G.phase==='tele')['blue','red'].forEach(al=>{if(G.opt.kind==='solo'&&al==='red')return;G.hpT[al]-=dt;const z=DZ[al].load;
      if(G.hpT[al]<=0&&G.supply[al]>0&&G.balls.filter(b=>!b.air&&inRect(b.x,b.y,z)).length<2){G.hpT[al]=5;G.supply[al]--;G.balls.push({x:z[0]+5+Math.random()*13,y:z[1]+5+Math.random()*13,vx:0,vy:0,c:G.supply[al]%3===0?'G':'P',r:2.5,air:0})}});
  },
  ai(r,dt){
    const b=r.b,rem=G.phase==='auto'?AUTO-G.t:TOTAL-G.t;
    if(G.phase==='tele'){const z=DZ[r.al].base,cx=z[0]+9,cy=z[1]+9;const d=Math.hypot(cx-r.x,cy-r.y);if(rem<5+d/Math.max(20,b.top)*1.6){goTo(r,cx,cy,0,6);return}}
    if(G.phase==='auto'&&rem<4.5){goTo(r,r.al==='blue'?36:F-36,86,0);return}
    if(G.ramps[r.al].length>=9&&G.phase==='tele'){const z=DZ[r.al].gate;const d=goTo(r,z[0]+z[2]/2+(r.al==='blue'?b.halfW:-b.halfW)*.6,z[1]+z[3]/2,0,8);if(d<b.halfW+4)DEC.actF(r);return}
    const tg=DEC.target(r);
    const wantShoot=b.shooter&&r.hold.length&&(r.hold.length>=b.capacity||!pickTarget(r));
    if(wantShoot||(!b.intakes.length&&r.hold.length)){const spot=r.al==='blue'?[52,38]:[F-52,38];const d=goTo(r,spot[0],spot[1],b.turret?null:headTo(r.x,r.y,tg.x,tg.y),10);
      if(d<14&&inLaunch(r)&&aimShot(r,tg)){if(b.sorter){const need=G.motif[G.ramps[r.al].length%3];const i=r.hold.indexOf(need);r.sel=i<0?0:i}shoot(r)}return}
    if(b.intakes.length&&r.hold.length<b.capacity){if(!aiCollect(r,dt,x=>goalS('blue',x.x,x.y)>8&&goalS('red',x.x,x.y)>8&&!inRect(x.x,x.y,DZ[opp(r.al)].load)))goTo(r,r.al==='blue'?50:F-50,70,null)}
  },
  endAuto(G){if(G.flags.autoDone)return;G.flags.autoDone=1;G.robots.forEach(r=>{if(!inLaunch(r))G.sc[r.al].leave=3});['blue','red'].forEach(al=>G.sc[al].patA=DEC.pat(al))},
  endMatch(G){['blue','red'].forEach(al=>G.sc[al].patT=DEC.pat(al));G.robots.forEach(r=>{const z=DZ[r.al].base,cs=corners(r);const n=cs.filter(p=>inRect(p[0],p[1],z)).length;G.sc[r.al].base=n===cs.length?10:n>0?5:0})},
  total:s=>s.leave+s.cls*3+s.ovf+s.patA+s.patT+s.base+s.foul,
  live:(G,al)=>{const s=G.sc[al];return s.leave+s.cls*3+s.ovf+s.patA+s.foul+(G.done?s.patT+s.base:0)},
  rows:s=>[['LEAVE (auto)',s.leave],[`CLASSIFIED × ${s.cls}`,s.cls*3],[`OVERFLOW × ${s.ovf}`,s.ovf],['PATTERN at end of auto',s.patA],['PATTERN at end of match',s.patT],['BASE',s.base],['Foul points from opponent',s.foul]],
  drawUnder(c){
    [LZ_BIG,LZ_SMALL].forEach(t=>{c.beginPath();c.moveTo(...t[0]);c.lineTo(...t[1]);c.lineTo(...t[2]);c.closePath();c.fillStyle='rgba(255,255,255,.045)';c.fill();c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1;c.beginPath();c.moveTo(...t[0]);c.lineTo(...t[2]);c.lineTo(...t[1]);c.stroke()});
    c.fillStyle='rgba(255,255,255,.35)';c.font='600 3.2px JetBrains Mono, monospace';c.fillText('LAUNCH ZONE',72,52);c.fillText('LAUNCH ZONE',72,F-6);
    ['blue','red'].forEach(al=>{const z=DZ[al],col=al==='blue'?C.blue:C.red;
      c.strokeStyle=col;c.lineWidth=.8;c.setLineDash([2,1.5]);c.strokeRect(...z.base);c.strokeRect(...z.load);c.strokeRect(...z.gate);c.setLineDash([]);
      c.fillStyle=al==='blue'?'rgba(74,134,255,.12)':'rgba(255,90,82,.12)';c.fillRect(...z.base);
      c.fillStyle=col;c.font='600 2.6px JetBrains Mono, monospace';c.fillText('BASE',z.base[0]+9,z.base[1]+10);c.fillText('LOADING',z.load[0]+11.5,z.load[1]+12.5);c.fillText('GATE',z.gate[0]+5.5,z.gate[1]+7);
      c.beginPath();if(al==='blue'){c.moveTo(0,0);c.lineTo(27*Math.SQRT2,0);c.lineTo(0,27*Math.SQRT2)}else{c.moveTo(F,0);c.lineTo(F-27*Math.SQRT2,0);c.lineTo(F,27*Math.SQRT2)}c.closePath();c.fillStyle=col;c.globalAlpha=.75;c.fill();c.globalAlpha=1;
      const g=DGOAL[al].c;c.fillStyle='#0b0e12';c.beginPath();c.arc(g[0]+(al==='blue'?3:-3),g[1]+3,6,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.fillText('GOAL',g[0]+(al==='blue'?4:-4),g[1]+4);
      const rx=z.ramp,ramp=G.ramps[al];c.fillStyle='#1a1f27';c.fillRect(rx-4,24,8,46);c.strokeStyle=col;c.lineWidth=.5;c.strokeRect(rx-4,24,8,46);
      for(let i=0;i<9;i++){const y=27+i*5;c.strokeStyle=G.motif[i%3]==='P'?C.purple:C.green;c.globalAlpha=.4;c.beginPath();c.arc(rx,y,2.2,0,Math.PI*2);c.stroke();c.globalAlpha=1;if(ramp[i]){c.fillStyle=BCOL[ramp[i]];c.beginPath();c.arc(rx,y,2.2,0,Math.PI*2);c.fill()}}
      c.fillStyle=C.mute;c.font='600 2.3px JetBrains Mono, monospace';c.fillText('RAMP',rx,22.4);c.fillText(ramp.length+'/9',rx,73.5)});
    c.fillStyle='rgba(255,255,255,.25)';[60,84,108].forEach(y=>{c.fillRect(12,y+3.2,17,.5);c.fillRect(F-29,y+3.2,17,.5)});
    c.fillStyle='#1a1f27';c.fillRect(60,-12,24,9);c.strokeStyle=C.accent;c.lineWidth=.5;c.strokeRect(60,-12,24,9);
    G.motif.split('').forEach((m,i)=>{c.fillStyle=BCOL[m];c.fillRect(62+i*7.3,-10,6,5)});
    c.fillStyle=C.mute;c.font='600 2.3px JetBrains Mono, monospace';c.fillText('OBELISK · MOTIF',72,-1.2);c.fillText('AUDIENCE',72,F+4);
  },
  drawOver(){}
};

/* ===== BIOBUZZ =====
   Layout simplified from the 2026-27 manual: HIVE frame (49.5 x 39 in) in the center holding a red and a blue HIVE,
   each with 2 CELLS 18.8 in apart (one faces up). 4 FLOWERS on the walls, GARDENS in opposite corners,
   23 x 11 in LOADING ZONES at the alliance walls (red left, blue right). Exact positions are approximations. */
const HF=[72-24.73,72-19.48,49.46,38.95];
const HIVEX={red:72-12.4,blue:72+12.4},CELLY=[72-9.4,72+9.4],CELLW=20,CELLD=12;
const FLOWERS=[[36,0],[108,0],[36,F],[108,F]];
const GARDEN={red:[[0,0],[23,0],[0,23]],blue:[[F,F],[F-23,F],[F,F-23]]};
const BLZ={red:[0,F-23,11,23],blue:[F-11,0,11,23]};
const TIP_LOAD=10,PW={Y:1,R:3,B:3};
const nectarOf=al=>al==='blue'?'B':'R';
const inFrame=(x,y)=>inRect(x,y,HF);
const cellRect=(al,i)=>[HIVEX[al]-CELLW/2,CELLY[i]-CELLD/2,CELLW,CELLD];
const BUZ={
  endgame:60,fHelp:'place in a flower / drop',circles:FLOWERS.map(([x,y])=>[x,y,4.5]),
  start(al,b){return al==='blue'?{x:F-b.halfH-.1,y:44,th:-Math.PI/2}:{x:b.halfH+.1,y:F-44,th:Math.PI/2}},
  init(G){
    G.hive={};['blue','red'].forEach(al=>{G.hive[al]={up:0,cells:[[nectarOf(al),nectarOf(al),nectarOf(al)],[]],tips:0};G.sc[al]={leave:0,aPark:0,tPark:0,tips:0,cell:0,flower:0,bottom:0,garden:0,foul:0}});
    G.nectar={blue:{staged:5,avail:0},red:{staged:5,avail:0}};G.flowers=FLOWERS.map(()=>[]);
    const pts=[[24,40],[24,104],[120,40],[120,104],[72,22],[72,122],[30,72],[114,72]];
    pts.forEach(([x,y])=>[[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]].forEach(([dx,dy])=>G.balls.push({x:x+dx,y:y+dy,vx:0,vy:0,c:'Y',r:1.4,air:0})));
    G.robots.forEach(r=>{r.hold=Array(Math.min(4,r.b.capacity||0)).fill('Y')});
  },
  intro:()=>'AUTO: launch preloaded pollen into your HIVE\'s upward CELL to tip it (20 pts).',
  canTake(r,b){return !(b.c==='R'||b.c==='B')||b.c===nectarOf(r.al)},
  canLaunch(r){return inFrame(r.x,r.y)?{block:true,msg:'Too close — back out from under the HIVE to launch up into the CELL.'}:{}},
  target(r){const h=G.hive[r.al];return{x:HIVEX[r.al],y:CELLY[h.up],over:0}},
  inFlight:()=>false,
  land(b){
    for(const al of ['blue','red']){const h=G.hive[al];if(inRect(b.x,b.y,cellRect(al,h.up))){h.cells[h.up].push(b.c);sfx('score');
      const load=h.cells[h.up].reduce((s,c)=>s+PW[c],0);if(load>=TIP_LOAD)BUZ.tip(al);return true}}
    return false;
  },
  tip(al){const h=G.hive[al],old=h.up;h.tips++;G.sc[al].tips++;
    h.cells[old].forEach(c=>G.balls.push({x:HIVEX[al]+(Math.random()-.5)*14,y:CELLY[old]+(Math.random()-.5)*8,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,c,r:BR[c],air:0}));
    h.cells[old]=[];h.up=1-old;
    if(G.nectar[al].staged>G.nectar[al].avail)G.nectar[al].avail++;
    toast(`${al.toUpperCase()} HIVE TIPPED! +20 · one NECTAR can enter at the loading zone.`);sfx('gate')},
  actF(r){
    if(!r.hold.length)return;
    const fi=FLOWERS.findIndex(([x,y])=>rectDist(r,x,y)<8);
    if(fi>=0){
      const i=r.b.sorter?Math.min(r.sel,r.hold.length-1):0,c=r.hold[i];
      if((c==='R'||c==='B')&&TOTAL-G.t>60){toast('NECTAR can only go into a FLOWER in the last minute.');return}
      if(G.flowers[fi].length>=7){toast('That FLOWER is full.');return}
      takeSel(r);G.flowers[fi].push(c);sfx('score');toast(`Placed ${c==='Y'?'POLLEN':'NECTAR'} in a FLOWER.`);return;
    }
    const c=takeSel(r);const[x,y]=toWorld(r,0,-r.b.halfH-BR[c]-.5);
    G.balls.push({x:Math.max(2,Math.min(F-2,x)),y:Math.max(2,Math.min(F-2,y)),vx:r.vx,vy:r.vy,c,r:BR[c],air:0});sfx('pick');
  },
  robotObst(){},ballObst(b){BUZ.circles.forEach(([cx,cy,rad])=>{const dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy),m=rad+b.r;if(d<m&&d>.01){b.x=cx+dx/d*m;b.y=cy+dy/d*m}})},
  tick(G,dt){
    if(G.phase==='tele'&&TOTAL-G.t<60&&!G.flags.min){G.flags.min=1;['blue','red'].forEach(al=>G.nectar[al].avail=G.nectar[al].staged);toast('1:00 LEFT — FLOWERS open for NECTAR, all NECTAR released.');sfx('buzz')}
    if(G.phase==='tele'&&TOTAL-G.t<15&&!G.flags.park){G.flags.park=1;toast('15 s left — PARK in your LOADING ZONE.')}
    if(G.phase!=='tele')return;
    ['blue','red'].forEach(al=>{if(G.opt.kind==='solo'&&al==='red')return;const n=G.nectar[al];G.hpT[al]-=dt;const z=BLZ[al];
      if(G.hpT[al]<=0&&n.avail>0&&G.balls.filter(b=>!b.air&&inRect(b.x,b.y,z)).length<2){G.hpT[al]=3;n.avail--;n.staged--;G.balls.push({x:z[0]+3+Math.random()*5,y:z[1]+4+Math.random()*15,vx:0,vy:0,c:nectarOf(al),r:1.8,air:0})}});
  },
  prefer(r,b){const last=TOTAL-G.t<75;return b.c===nectarOf(r.al)?(last?.35:.8):(inGarden(r.al,b)?3:1)},
  ai(r,dt){
    const b=r.b,rem=G.phase==='auto'?AUTO-G.t:TOTAL-G.t,z=BLZ[r.al];
    const lzTarget=()=>[r.al==='blue'?z[0]-b.halfW+4:z[0]+z[2]+b.halfW-4,z[1]+z[3]/2];
    if(G.phase==='auto'&&rem<6||G.phase==='tele'&&rem<5+Math.hypot(lzTarget()[0]-r.x,lzTarget()[1]-r.y)/Math.max(20,b.top)*1.6){const[tx,ty]=lzTarget();goTo(r,tx,ty,r.al==='blue'?-Math.PI/2:Math.PI/2,6);return}
    const mine=nectarOf(r.al),last=G.phase==='tele'&&rem<60;
    if(last&&r.hold.includes(mine)){
      let best=0,bd=1e9;FLOWERS.forEach(([x,y],i)=>{if(G.flowers[i].length>=7)return;const top=[...G.flowers[i]].reverse().find(c=>c!=='Y');const d=Math.hypot(x-r.x,y-r.y)+(top===mine?60:0);if(d<bd){bd=d;best=i}});
      const[fx,fy]=FLOWERS[best];const ty=fy===0?b.halfH+5:F-b.halfH-5;goTo(r,fx,ty,fy===0?0:Math.PI,8);
      if(rectDist(r,fx,fy)<8){r.sel=r.hold.indexOf(mine);BUZ.actF(r)}return;
    }
    const tg=BUZ.target(r);const shootable=r.hold.filter(c=>c==='Y'||c===mine).length;
    const wantShoot=b.shooter&&shootable&&(r.hold.length>=b.capacity||!pickTarget(r));
    if(wantShoot||(!b.intakes.length&&r.hold.length)){
      if(last&&r.hold.length&&r.hold.every(c=>c===mine))return;
      const side=r.al==='blue'?1:-1;const sx=Math.max(b.halfW+6,Math.min(F-b.halfW-6,tg.x+side*44)),sy=tg.y;
      const d=goTo(r,sx,sy,b.turret?null:headTo(r.x,r.y,tg.x,tg.y),10);
      if(d<16&&aimShot(r,tg,.05)){if(b.sorter){const i=r.hold.indexOf('Y');r.sel=i<0?0:i}shoot(r)}return;
    }
    if(b.intakes.length&&r.hold.length<b.capacity){if(!aiCollect(r,dt))goTo(r,r.al==='blue'?110:34,72,null)}
  },
  endAuto(G){if(G.flags.autoDone)return;G.flags.autoDone=1;G.robots.forEach(r=>{if(!touchingWall(r))G.sc[r.al].leave=3;if(corners(r).some(p=>inRect(p[0],p[1],BLZ[r.al])))G.sc[r.al].aPark=5})},
  endMatch(G){
    G.robots.forEach(r=>{G.sc[r.al].tPark=corners(r).some(p=>inRect(p[0],p[1],BLZ[r.al]))?5:0});
    const t=BUZ.tally(G);['blue','red'].forEach(al=>Object.assign(G.sc[al],t[al]));
  },
  tally(G){const o={blue:{cell:0,flower:0,bottom:0,garden:0},red:{cell:0,flower:0,bottom:0,garden:0}};
    ['blue','red'].forEach(al=>{const h=G.hive[al];o[al].cell=h.cells[h.up].length*2});
    G.flowers.forEach(st=>{const nect=st.map((c,i)=>[c,i]).filter(([c])=>c!=='Y');if(!nect.length)return;
      const top=nect[nect.length-1][0],bot=nect[0][0];o[top==='B'?'blue':'red'].flower+=st.length*2;o[bot==='B'?'blue':'red'].bottom+=5});
    G.balls.forEach(b=>{if(b.air)return;['blue','red'].forEach(al=>{if(inGarden(al,b))o[al].garden+=1})});return o},
  total:s=>s.leave+s.aPark+s.tPark+s.tips*20+s.cell+s.flower+s.bottom+s.garden+s.foul,
  live(G,al){const s=G.sc[al];if(G.done)return BUZ.total(s);const t=BUZ.tally(G)[al];return s.leave+s.aPark+s.tips*20+s.foul+t.cell+t.flower+t.bottom+t.garden},
  rows:s=>[['LEAVE (auto)',s.leave],['PARK at end of auto',s.aPark],[`HIVE TIPS × ${s.tips}`,s.tips*20],['Pieces left in upward CELL',s.cell],['Pieces in owned FLOWERS',s.flower],['Bottom NECTAR bonus',s.bottom],['Pieces in GARDEN',s.garden],['PARK at end of match',s.tPark],['Foul points from opponent',s.foul]],
  drawUnder(c){
    ['blue','red'].forEach(al=>{const col=al==='blue'?C.blue:C.red,g=GARDEN[al],z=BLZ[al];
      c.beginPath();c.moveTo(...g[0]);c.lineTo(...g[1]);c.lineTo(...g[2]);c.closePath();c.fillStyle=al==='blue'?'rgba(74,134,255,.16)':'rgba(255,90,82,.16)';c.fill();c.strokeStyle=col;c.lineWidth=1;c.beginPath();c.moveTo(...g[1]);c.lineTo(...g[2]);c.stroke();
      c.fillStyle=col;c.font='600 2.6px JetBrains Mono, monospace';c.fillText('GARDEN',al==='red'?8:F-8,al==='red'?8:F-6);
      c.strokeStyle=col;c.setLineDash([2,1.5]);c.lineWidth=.8;c.strokeRect(...z);c.setLineDash([]);c.fillStyle=al==='blue'?'rgba(74,134,255,.1)':'rgba(255,90,82,.1)';c.fillRect(...z);
      c.save();c.translate(z[0]+z[2]/2,z[1]+z[3]/2);c.rotate(-Math.PI/2);c.fillStyle=col;c.fillText('LOADING',0,1);c.restore();
      // alliance area labels and staged nectar
      const ax=al==='red'?-MX/2:F+MX/2;c.save();c.translate(ax,72);c.rotate(al==='red'?-Math.PI/2:Math.PI/2);c.fillStyle=col;c.font='700 3.4px Chakra Petch, sans-serif';c.fillText(al.toUpperCase()+' ALLIANCE',0,-2);
      c.font='600 2.4px JetBrains Mono, monospace';c.fillStyle=C.mute;c.fillText(`NECTAR STAGED ${G.nectar[al].staged} · READY ${G.nectar[al].avail}`,0,3);c.restore();
    });
    c.fillStyle=C.mute;c.font='600 2.4px JetBrains Mono, monospace';c.fillText('AUDIENCE',72,F+4.5);
  },
  drawOver(c){
    // flowers
    FLOWERS.forEach(([x,y],i)=>{const st=G.flowers[i];const nect=st.filter(c=>c!=='Y');const own=nect.length?(nect[nect.length-1]==='B'?C.blue:C.red):'#56606c';
      c.fillStyle='#1d2a1f';c.beginPath();c.arc(x,y,4.5,0,Math.PI*2);c.fill();c.strokeStyle=own;c.lineWidth=1.1;c.stroke();
      for(let p=0;p<5;p++){const a=p/5*Math.PI*2;c.fillStyle='rgba(245,214,58,.55)';c.beginPath();c.arc(x+Math.cos(a)*3.2,y+Math.sin(a)*3.2,1.1,0,Math.PI*2);c.fill()}
      c.fillStyle='#0b0e12';c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill();
      const yy=y===0?8.5:F-7;c.fillStyle=C.fg;c.font='600 2.4px JetBrains Mono, monospace';c.fillText(`FLOWER ${st.length}/7`,x,yy);
      st.forEach((cc,k)=>{c.fillStyle=BCOL[cc];c.beginPath();c.arc(x-7+k*2.3,y===0?11.2:F-11,0.9,0,Math.PI*2);c.fill()})});
    // hive frame (overhead, drawn translucent)
    c.fillStyle='rgba(20,24,30,.45)';c.fillRect(...HF);c.strokeStyle='#c8ced8';c.lineWidth=1;c.strokeRect(...HF);
    c.fillStyle=C.fg;c.font='700 3px Chakra Petch, sans-serif';c.fillText('HIVE',72,HF[1]-1.4);
    ['blue','red'].forEach(al=>{const h=G.hive[al],col=al==='blue'?C.blue:C.red;
      [0,1].forEach(i=>{const R=cellRect(al,i),up=h.up===i;c.fillStyle=up?(al==='blue'?'rgba(74,134,255,.32)':'rgba(255,90,82,.32)'):'rgba(0,0,0,.25)';c.fillRect(...R);
        c.strokeStyle=col;c.lineWidth=up?1.1:.5;c.setLineDash(up?[]:[1.5,1.2]);c.strokeRect(...R);c.setLineDash([]);
        if(up){const load=h.cells[i].reduce((s,cc)=>s+PW[cc],0);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(R[0],R[1]+R[3]-1.2,R[2]*Math.min(1,load/TIP_LOAD),1.2);
          h.cells[i].slice(0,12).forEach((cc,k)=>{c.fillStyle=BCOL[cc];c.beginPath();c.arc(R[0]+2.5+(k%6)*3,R[1]+3+Math.floor(k/6)*3,1.1,0,Math.PI*2);c.fill()});
          c.fillStyle='#fff';c.font='600 2.2px JetBrains Mono, monospace';c.fillText('UP',R[0]+R[2]-3,R[1]+R[3]-2.2)}});
      c.fillStyle=col;c.font='600 2.4px JetBrains Mono, monospace';c.fillText(`${al.toUpperCase()} · ${h.tips} TIPS`,HIVEX[al],HF[1]+HF[3]+3)});
  }
};
const MODES={decode:DEC,biobuzz:BUZ};
function inGarden(al,b){return inTri([b.x,b.y],GARDEN[al])}

/* ===== RESULTS ===== */
function pctile(x,ss){const z=(x-ss.mean)/ss.sd;const t=1/(1+.3275911*Math.abs(z)/Math.SQRT2);const y=1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z/2);return Math.round(Math.max(1,Math.min(99,50*(1+Math.sign(z)*y))))}
function breakdown(md,s){return `<table>${md.rows(s).map(([k,v])=>`<tr><td>${k}</td><td class="n">${v}</td></tr>`).join('')}<tr><th>Total</th><th class="n">${md.total(s)}</th></tr></table>`}
function distro(score,ss){let h='';for(let x=0;x<=200;x+=10){const z=(x+5-ss.mean)/ss.sd,v=Math.exp(-z*z/2);h+=`<i style="height:${Math.max(4,v*100)}%" class="${score>=x&&score<x+10?'you':''}" title="${x}–${x+9}"></i>`}return `<div class="distro">${h}</div><div class="row mono" style="justify-content:space-between;font-size:11px;color:var(--mute)"><span>0</span><span>100</span><span>200+ pts</span></div>`}
function showResults(stopped){
  const md=MODES[G.season.id],ss=G.season,b=G.sc.blue,r=G.sc.red,tb=md.total(b),tr=md.total(r),two=G.opt.kind==='2p';
  const tm=Math.min(TOTAL,G.t),head=two?(tb===tr?'Tie match':tb>tr?'Blue wins':'Red wins'):(stopped?'Match stopped':'Match complete');const p=pctile(tb,ss);
  $('#results').innerHTML=`
   <div class="res-top"><div><div class="eyebrow">${ss.name} · ${two?'Blue vs Red':G.opt.sim?'Simulated solo':'Solo drive'} · ${stopped?'stopped at '+Math.floor(tm/60)+':'+String(Math.floor(tm%60)).padStart(2,'0'):'full match'}${G.motif?' · motif '+G.motif:''}</div><h2 style="font-size:34px">${head}</h2></div>
     <div style="text-align:right"><div class="big" style="color:var(--blue)">${tb}${two?`<span style="color:var(--mute);font-size:32px"> – </span><span style="color:var(--red)">${tr}</span>`:''}</div></div></div>
   <div class="card" style="margin-bottom:14px"><div class="pct">${two?'Blue':'You'} beat <b style="color:var(--accent)">${p}%</b> of teams${two?` · Red beat <b style="color:var(--accent)">${pctile(tr,ss)}%</b>`:''}</div>
     <div style="font-size:12px;color:var(--mute)">Estimated against a modeled spread of single-robot ${ss.name} scores (centered near ${ss.mean} pts), not live competition data.</div>${distro(tb,ss)}</div>
   <div class="cols"><div class="card"><h3 style="font-size:16px;color:var(--blue);margin-bottom:6px">Blue · ${esc(G.robots[0].name)}</h3>${breakdown(md,b)}</div>
     ${two?`<div class="card"><h3 style="font-size:16px;color:var(--red);margin-bottom:6px">Red · ${esc(G.robots[1].name)}</h3>${breakdown(md,r)}</div>`:`<div class="card"><h3 style="font-size:16px;margin-bottom:8px">Save to leaderboard</h3><div class="row"><input type="text" id="lbName" maxlength="20" value="${esc(store.get('lastName','Team 00000'))}" aria-label="Team name"><button class="btn primary" id="lbSave">Save score</button></div><p id="lbMsg" style="color:var(--mute);font-size:13px"></p></div>`}</div>
   <div class="row" style="margin-top:18px;justify-content:flex-end"><button class="btn ghost" id="rEdit">Edit robot</button><button class="btn" id="rAgain">Play again</button><button class="btn primary" id="rHome">Back to home</button></div>`;
  show('results');const opt=G.opt;
  $('#rHome').onclick=()=>show('home');$('#rEdit').onclick=()=>show('studio');$('#rAgain').onclick=()=>startMatch(opt);
  if(two){const bw=tb>=tr;addLB((bw?'Blue · ':'Red · ')+G.robots[bw?0:1].name,bw?tb:tr,'2P winner',G.robots[bw?0:1].name)}
  else $('#lbSave').onclick=()=>{const n=$('#lbName').value.trim()||'Team';store.set('lastName',n);addLB(n,tb,opt.sim?'Sim':'Drive',bot.name);$('#lbSave').disabled=true;$('#lbMsg').textContent='Saved. Open Leaderboard from the home screen.'};
}
function addLB(name,score,mode,botName){const k='lb.'+S.id,lb=store.get(k,[]);lb.push({name,score,mode,bot:botName,date:new Date().toISOString().slice(0,10)});lb.sort((a,b)=>b.score-a.score);store.set(k,lb.slice(0,20))}
function showLB(){const lb=store.get('lb.'+S.id,[]);
  $('#infoSheet').innerHTML=`<div class="eyebrow">${S.name} · best scores on this device</div><h2>Leaderboard</h2>
   ${lb.length?`<table><tr><th>#</th><th>Team</th><th>Robot</th><th>Mode</th><th class="n">Score</th></tr>${lb.slice(0,10).map((e,i)=>`<tr><td class="mono">${i+1}</td><td>${esc(e.name)}</td><td>${esc(e.bot||'')}</td><td>${e.mode}</td><td class="n">${e.score}</td></tr>`).join('')}</table>`:`<p style="color:var(--mute)">No ${S.name} scores yet. Finish a solo match and save your score to appear here.</p>`}
   <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn primary" id="iX">Close</button></div>`;modal('infoModal',true);$('#iX').onclick=()=>modal('infoModal',false)}
function showInfo(kind){
  const help={decode:`<ul class="list tip">
    <li><b>AUTO (0:30)</b> runs your robot's program. Finish off the launch lines to earn LEAVE (3).</li>
    <li><b>Shoot</b> artifacts into your goal from inside a white launch zone. Each lands on your RAMP: CLASSIFIED (3) until it holds 9, then OVERFLOW (1). Launching outside a zone is a foul.</li>
    <li><b>Pattern</b>: each ramp slot matching the obelisk MOTIF scores 2, at the end of AUTO and at the end of the match. With a sorter servo, <kbd>C</kbd> picks the color.</li>
    <li><b>Gate</b>: drive into your GATE zone and press <kbd>F</kbd> to empty a full ramp.</li>
    <li><b>Endgame</b>: park fully in your BASE for 10 (partly for 5).</li></ul>`,
   biobuzz:`<ul class="list tip">
    <li><b>Pieces</b>: yellow POLLEN (2.8 in) is shared. NECTAR (3.6 in) comes in red and blue — your intake ignores the other alliance's nectar. You may hold 4 pieces.</li>
    <li><b>Tip the HIVE</b>: launch pollen or your nectar into your hive's <i>upward</i> CELL. When it's heavy enough it tips (20 pts), the old cell dumps its pieces, and one NECTAR can enter your loading zone.</li>
    <li><b>FLOWERS</b>: press <kbd>F</kbd> next to a flower to drop a piece in the top. NECTAR only goes in during the last minute. The alliance with the top-most nectar owns the flower: 2 per piece in it. Bottom-most nectar earns 5.</li>
    <li><b>GARDEN</b>: pieces in your corner garden score 1 each. <kbd>F</kbd> away from a flower drops a piece where you are.</li>
    <li><b>PARK</b>: be partly in your LOADING ZONE at the end of AUTO (5) and the end of the match (5). Leave the wall in AUTO for LEAVE (3).</li></ul>`};
  $('#infoSheet').innerHTML=kind==='credits'?`<div class="eyebrow">Credits</div><h2>FTC Bot Lab</h2>
   <p>A fan-made FTC practice sandbox. Design, physics, fields and music made for this project with Claude.</p>
   <p style="color:var(--mute)">DECODE (2025–26) and BIOBUZZ (2026–27) are <i>FIRST</i>® Tech Challenge games. <i>FIRST</i>, FTC, DECODE and BIOBUZZ are trademarks of <i>FIRST</i>; this sim is not affiliated with or endorsed by them. Fields are simplified from the Competition Manuals. Part weights, speeds and launch ranges are gameplay estimates, not spec-sheet values.</p>
   <p style="color:var(--mute)">Rules applied: 18 in starting size; DECODE 8 motors / 10 servos / 3 artifacts; BIOBUZZ 8 motors / 8 servos / 4 pieces; exactly 1 robot controller and 1 main battery.</p>
   <div class="row" style="justify-content:flex-end"><button class="btn primary" id="iX">Close</button></div>`:
  `<div class="eyebrow">How to play · ${S.name}</div><h2>${S.name} in 60 seconds</h2>
   <p style="color:var(--mute)">Build in the Bot Studio first. Parts power what they touch: a motor next to a wheel drives it; a fast motor next to the flywheel spins it. Every match is 0:30 AUTO, 0:08 transition, 2:00 TELEOP.</p>${help[S.id]}
   <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" id="iX">Close</button></div>`;
  modal('infoModal',true);$('#iX').onclick=()=>modal('infoModal',false);
}

/* ===== AUDIO ===== */
let AC=null,music=null;
const ac=()=>{if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC};
function tone(f,d,type='square',v=.05,t0=0){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;const t=a.currentTime+t0;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.02)}
function sfx(k){if(!AC)return;({shoot:()=>{tone(620,.08,'square',.04);tone(330,.1,'triangle',.05,.02)},score:()=>{tone(880,.09,'square',.04);tone(1320,.14,'square',.04,.08)},ovf:()=>tone(520,.12,'triangle',.05),pick:()=>tone(240,.05,'triangle',.04),foul:()=>tone(110,.3,'sawtooth',.05),gate:()=>{tone(300,.1,'square',.04);tone(200,.15,'square',.04,.1)},buzz:()=>tone(140,.5,'sawtooth',.045),start:()=>{tone(660,.1,'square',.04);tone(990,.18,'square',.04,.12)}})[k]?.()}
const SONG={bass:[45,45,52,45,43,43,50,43,41,41,48,41,43,43,47,50],lead:[69,0,72,74,76,0,74,72,69,0,67,69,72,0,0,0,69,0,72,74,76,79,76,74,72,0,74,72,69,0,0,0]};
const mtof=n=>440*Math.pow(2,(n-69)/12);
function toggleMusic(){const a=ac();if(!a)return;if(music){clearInterval(music);music=null;$('#bMusic').textContent='♪ Music: off';return}
  let i=0;music=setInterval(()=>{const b=SONG.bass[Math.floor(i/2)%16];if(i%2===0)tone(mtof(b),.22,'triangle',.07);const l=SONG.lead[i%32];if(l)tone(mtof(l),.16,'square',.025);if(i%4===2)tone(2000,.02,'square',.008);i++},115);
  $('#bMusic').textContent='♪ Music: on'}

/* ===== WIRING ===== */
$('#bSolo').onclick=()=>{ac();setup('solo')};$('#b2p').onclick=()=>{ac();setup('2p')};
$('#bStudio').onclick=()=>{ac();show('studio')};$('#bLb').onclick=showLB;
$('#bHelp').onclick=()=>showInfo('help');$('#bCredits').onclick=()=>showInfo('credits');$('#bMusic').onclick=toggleMusic;
$('#botName').value=bot.name;renderList();show('home');
window.__ftc={compile,STARTER,SEASONS,setS:id=>{S=SEASONS[id]},startMatch,get G(){return G},step:dt=>step(dt)};
})();
