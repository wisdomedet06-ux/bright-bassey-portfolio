import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const fallback = {
  profile: { name:'Bright Bassey', title:'Virtual Assistant · Administrative Assistant · Operations Support Specialist', intro:'I optimize complex operations by providing proactive administrative, research, documentation, and coordination support, enabling organizations to increase efficiency and achieve key objectives.', about_lead:'I bring clarity, structure, and reliable support to busy people and growing businesses.', about_body:'I have remote experience in administration, customer support, research, documentation, and workflow coordination. From managing communications and schedules to organizing information, maintaining systems, and coordinating day-to-day operations, I help turn busy workflows into organized, efficient processes. I don’t just manage tasks. I create the structure that helps work move forward.', availability:'Available', status_text:'OPEN TO REMOTE', location:'Lagos · Open to Remote', email:'brightbekanem@gmail.com', phone:'+2349060228340', linkedin:'', footer:'Operations · Administration · Customer Support'},
  stats:[{value:'5+',label:'Years Experience'},{value:'80%',label:'Response Turnaround'},{value:'10+',label:'Tools & Platforms'},{value:'Multi-Channel',label:'Support'}],
  chips:['Administrative Support','Calendar & Inbox Management','Data Entry','Client Communication','Team Coordination','AI-Assisted Productivity','Workflow Automation','Reporting & Documentation'],
  experience:[
    {role:'Remote Data Entry Specialist', company:'Conduent · New Jersey, US', period:'Feb. 2024 – Jun. 2026', bullets:['Entered and updated information accurately across spreadsheets and databases.','Reviewed data for accuracy, identifying and correcting errors to maintain data integrity.','Maintained and organized digital records, ensuring information remained accessible and up to date.','Managed customer and administrative information, supporting recordkeeping across departments.','Researched and verified information as needed to ensure completeness and accuracy of records.','Used Microsoft Excel and Google Sheets to organize, track, and maintain large volumes of data.']},
    {role:'Remote Customer Service Representative', company:'Alorica · California, US', period:'Sep. 2022 – Jan. 2024', bullets:['Responded to customer inquiries through email, chat, and other digital channels.','Resolved customer concerns and escalated issues when necessary to maintain service quality.','Maintained accurate records of customer interactions and account information using CRM and helpdesk systems.','Followed up on customer requests to ensure timely resolution and a positive experience.','Managed multiple customer inquiries simultaneously while maintaining professionalism and accuracy.','Used Zoho CRM, Freshdesk, and Zendesk to track and respond to customer interactions.']},
    {role:'Virtual Assistant', company:'Codekago · Uyo, Nigeria', period:'May. 2021 – Jul. 2022', bullets:['Provided administrative support including calendar management, email correspondence and document preparation.','Managed scheduling and coordinated tasks across multiple priorities.','Conducted internet research and organized findings into clear, usable documents.','Created professional documents and presentations using Microsoft Office and Google Workspace.','Designed visual content with Canva, Photoshop and Illustrator.','Supported workflow automation using Zapier and Make.com.']}
  ],
  skills:[
    {category:'Administrative & Operations', tags:'Task Coordination · Project Coordination · Workflow Management', icon:'◌'},
    {category:'Data & Research', tags:'Data Entry · Data Management · Spreadsheet Management · Research', icon:'⌁'},
    {category:'Productivity Platforms', tags:'Microsoft 365 · Google Workspace', icon:'◫'},
    {category:'Project Management', tags:'Asana · Trello · Notion · ClickUp', icon:'✦'},
    {category:'Communication & Scheduling', tags:'Slack · Zoom · Microsoft Teams · Calendly', icon:'⌁'},
    {category:'CRM Platforms', tags:'Contact Management · CRM Data Entry · Helpdesk', icon:'◎'},
    {category:'Automation', tags:'Zapier · Make.com · n8n · App Integrations', icon:'↯'},
    {category:'Design & Visuals', tags:'Canva · Adobe Photoshop · Presentation Design', icon:'◒'},
    {category:'AI & Digital Tools', tags:'ChatGPT · Claude · Gemini · AI-Assisted Research', icon:'✧'}
  ],
  projects:[
    {name:'Inbox Management', category:'Operations Sample', description:'A before-and-after sample showing how I organize and manage a busy inbox so priority emails are handled first.', url:'https://app.notion.com/p/Inbox-Management-Sample-8bfaba617b278212b1a08171f591b629?source=copy_link', tech:'Inbox triage · Prioritization · Documentation'},
    {name:'Calendar Management', category:'Coordination Sample', description:'A weekly calendar workflow covering scheduling, focus time, conflict resolution and coordination across multiple time zones.', url:'https://app.notion.com/p/Calendar-Management-Sample-8d2aba617b278251addb81a2da4251ef?source=copy_link', tech:'Scheduling · Time zones · Coordination'},
    {name:'Travel Itinerary', category:'Research Sample', description:'Detailed travel planning covering flights, accommodation, ground transport and meeting schedules for domestic and international trips.', url:'https://app.notion.com/p/Travel-Itinerary-Sample-372aba617b2783b2b3ec8141c81024e1?source=copy_link', tech:'Research · Logistics · Documentation'},
    {name:'Report / Presentation', category:'Executive Support Sample', description:'Reports and presentations including executive summaries, competitor analysis and operational reporting.', url:'https://app.notion.com/p/Report-Presentation-Sample-02faba617b27828e878001ee58e3f2d5?source=copy_link', tech:'Reporting · Analysis · Presentation'}
  ],
  education:[{title:'Bachelor of Science (B.Sc.)', body:'University of Uyo · 2024', type:'Education'}],
  resume:[{type:'PDF',name:'Bright_Bassey_Resume.pdf',url:'resumes/Bright_Bassey_Resume.pdf'},{type:'DOCX',name:'Bright_Bassey_Resume.docx',url:'resumes/Bright_Bassey_Resume.docx'}]
};

let data = structuredClone(fallback);
const q = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setText(id,v){const el=q(id); if(el) el.textContent=v;}

async function load(){
  const tables=['profile','stats','chips','experience','skills','projects','education','resume'];
  for(const table of tables){
    try{ const {data:rows,error}=await supabase.from(table).select('*').order('sort_order',{ascending:true}); if(!error && rows?.length) data[table]=rows; }catch{}
  }
  render();
}

function render(){
  const p=data.profile;
  setText('navAvailability',p.availability||'Available'); setText('heroStatus',p.status_text||'OPEN TO REMOTE'); setText('heroTitle',p.title); setText('heroIntro',p.intro); setText('aboutLead',p.about_lead); setText('aboutBody',p.about_body); setText('contactTag','Available for remote roles in operations, administrative and customer support.'); setText('resumeName',p.name); setText('resumeSub',p.title); setText('year',new Date().getFullYear());
  q('#heroStats').innerHTML=data.stats.map(s=>`<div class="stat-circle"><div class="stat-num">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join('');
  q('#skillChips').innerHTML=data.chips.map((s,i)=>`<span class="chip c${i%4}">${esc(typeof s==='string'?s:s.name)}</span>`).join('');
  q('#experienceTrack').innerHTML=data.experience.map((e,i)=>`<article class="exp-card"><div class="exp-index">0${i+1}</div><div class="exp-role">${esc(e.role)}</div><div class="exp-company">${esc(e.company)}</div><div class="exp-period">${esc(e.period)}</div><ul>${(e.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></article>`).join('');
  q('#expTotal').textContent=String(data.experience.length).padStart(2,'0');
  q('#expDots').innerHTML=data.experience.map((_,i)=>`<button class="dot ${i===0?'on':''}" data-i="${i}" aria-label="Show experience ${i+1}"></button>`).join('');
  q('#skillsBento').innerHTML=data.skills.map((s,i)=>`<div class="skill-card s${i%4}"><div class="skill-icon">${esc(s.icon||'✦')}</div><div class="skill-name">${esc(s.category||s.name)}</div><div class="skill-tags">${esc(s.tags||'')}</div></div>`).join('');
  q('#projectsGrid').innerHTML=data.projects.map((x,i)=>`<article class="project-card p${i%4}"><div class="project-art"><span>${String(i+1).padStart(2,'0')}</span></div><div class="project-body"><div class="project-cat">${esc(x.category)}</div><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="project-pills">${String(x.tech||'').split('·').map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div><a href="${esc(x.url)}" target="_blank" rel="noopener">Open sample ↗</a></div></article>`).join('');
  q('#educationGrid').innerHTML=data.education.map((e,i)=>`<article class="credential-card c${i%4}"><div class="credential-mark">${esc(e.type||'Credential')}</div><h3>${esc(e.title)}</h3><p>${esc(e.body)}</p></article>`).join('');
  const stats=(data.stats||[]).slice(0,4); q('#resumeStats').innerHTML=stats.map(s=>`<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('');
  q('#resumeButtons').innerHTML=data.resume.map(r=>`<a class="resume-btn ${r.type==='PDF'?'pdf':'docx'}" href="${esc(r.url)}" target="_blank" download><b>${esc(r.type)}</b><span>Download</span> ↗</a>`).join('');
  q('#contactChips').innerHTML=`<a href="mailto:${esc(p.email)}">✉ <span>Email</span><b>${esc(p.email)}</b></a><a href="tel:${esc(p.phone)}">☎ <span>Phone</span><b>${esc(p.phone)}</b></a>${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank">in <span>LinkedIn</span><b>Connect</b></a>`:''}<div>⌖ <span>Location</span><b>${esc(p.location)}</b></div>`;
  initExperience();
}
let expIndex=0;
function initExperience(){ const track=q('#experienceTrack'); if(!track) return; const dots=[...document.querySelectorAll('#expDots .dot')]; const go=n=>{expIndex=Math.max(0,Math.min(n,data.experience.length-1)); track.style.transform=`translateX(-${expIndex*100}%)`; setText('expCurrent',String(expIndex+1).padStart(2,'0'));dots.forEach((d,i)=>d.classList.toggle('on',i===expIndex));}; q('#prevExp').onclick=()=>go(expIndex-1); q('#nextExp').onclick=()=>go(expIndex+1); dots.forEach(d=>d.onclick=()=>go(+d.dataset.i)); let sx=0; track.ontouchstart=e=>sx=e.touches[0].clientX; track.ontouchend=e=>{const dx=sx-e.changedTouches[0].clientX;if(Math.abs(dx)>40)go(expIndex+(dx>0?1:-1));}; go(0); }

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08}); document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
let mx=0,my=0; addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY; document.documentElement.style.setProperty('--mx',`${mx}px`);document.documentElement.style.setProperty('--my',`${my}px`)});
addEventListener('scroll',()=>{q('#nav')?.classList.toggle('scrolled',scrollY>20); const img=q('.hero-media img'); if(img) img.style.transform=`translateY(${scrollY*.10}px) scale(1.06)`;});

const cv=q('#bg'),ctx=cv.getContext('2d'); let W,H; function resize(){W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);} resize();addEventListener('resize',resize);
const pts=Array.from({length:65},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+.4}));
function bg(t){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(79,141,247,.20)';ctx.fill();}for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<110){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(170,115,195,${.08*(1-d/110)})`;ctx.lineWidth=.6;ctx.stroke();}}requestAnimationFrame(bg);}requestAnimationFrame(bg);

load();
