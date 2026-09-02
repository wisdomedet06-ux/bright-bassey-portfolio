import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';
const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const $=s=>document.querySelector(s); const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults={profile:{name:'Bright Bassey',title:'Virtual Assistant · Administrative Assistant · Operations Support Specialist',intro:'I optimize complex operations by providing proactive administrative, research, documentation, and coordination support, enabling organizations to increase efficiency and achieve key objectives.',about_lead:'I bring clarity, structure, and reliable support to busy people and growing businesses.',about_body:'I have remote experience in administration, customer support, research, documentation, and workflow coordination. From managing communications and schedules to organizing information, maintaining systems, and coordinating day-to-day operations, I help turn busy workflows into organized, efficient processes. I don’t just manage tasks. I create the structure that helps work move forward.',availability:'Available',status_text:'OPEN TO REMOTE',location:'Lagos · Open to Remote',email:'brightbekanem@gmail.com',phone:'+2349060228340',linkedin:''}};
let cache={};
function toast(m,ok=true){const el=$('#toast');el.textContent=m;el.className='toast show '+(ok?'ok':'bad');setTimeout(()=>el.className='toast',2600)}
async function isAdmin(){const {data:{user}}=await supabase.auth.getUser();if(!user)return false;const {data}=await supabase.from('site_admins').select('user_id').eq('user_id',user.id).maybeSingle();return !!data;}
async function boot(){const {data:{session}}=await supabase.auth.getSession(); if(session && await isAdmin()) showApp(); else showLogin();}
function showLogin(){$('#loginView').classList.remove('hidden');$('#appView').classList.add('hidden')}
function showApp(){$('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');loadAll()}
$('#loginForm').onsubmit=async e=>{e.preventDefault();$('#loginMsg').textContent='';const {error}=await supabase.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});if(error){$('#loginMsg').textContent=error.message;return}if(!await isAdmin()){await supabase.auth.signOut();$('#loginMsg').textContent='This account is not authorized as an admin.';return}showApp()};
$('#signOut').onclick=async()=>{await supabase.auth.signOut();showLogin()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===t));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===t.dataset.tab));});
async function table(name,opts='*'){let q=supabase.from(name).select(opts);if(name!=='profile')q=q.order('sort_order',{ascending:true});const {data,error}=await q;if(error) throw error;return data||[]}
async function loadAll(){try{cache.profile=(await table('profile'))[0]||defaults.profile;cache.stats=await table('stats');cache.chips=await table('chips');cache.experience=await table('experience');cache.skills=await table('skills');cache.projects=await table('projects');cache.education=await table('education');cache.resume=await table('resume');renderProfile();renderExperience();renderSkills();renderProjects();renderEducation();renderResumes();$('#overviewStats').innerHTML=[['Profile','1'],['Experience',cache.experience.length],['Skills',cache.skills.length],['Projects',cache.projects.length],['Education',cache.education.length],['Resume files',cache.resume.length]].map(x=>`<div class="stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')}catch(e){toast(e.message,false)}}
function formField(label,key,value,wide=false){return `<label class="field ${wide?'wide':''}"><span>${esc(label)}</span><input name="${esc(key)}" value="${esc(value)}"></label>`}
function renderProfile(){const p=cache.profile||defaults.profile;$('#profileForm').innerHTML=formField('Full name','name',p.name)+formField('Title','title',p.title,true)+formField('Hero intro','intro',p.intro,true)+formField('About lead','about_lead',p.about_lead,true)+formField('About body','about_body',p.about_body,true)+formField('Availability','availability',p.availability)+formField('Status text','status_text',p.status_text)+formField('Location','location',p.location)+formField('Email','email',p.email)+formField('Phone','phone',p.phone)+formField('LinkedIn','linkedin',p.linkedin)+`<div class="wide action-row"><button type="submit">Save profile</button></div>`;$('#profileForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const obj=Object.fromEntries(fd.entries());const {error}=await supabase.from('profile').upsert({id:p.id||1,...obj});if(error)toast(error.message,false);else{toast('Profile saved');cache.profile=obj}}}
function itemEditor(title,fields,onSave,onDelete){const key=(f)=>String(f.value??'').replace(/"/g,'&quot;');return `<div class="item"><div class="item-title"><b>${esc(title)}</b><div><button class="secondary save-item">Save</button><button class="danger delete-item">Delete</button></div></div><div class="form-grid">${fields.map(f=>`<label class="field ${f.wide?'wide':''}"><span>${esc(f.label)}</span>${f.textarea?`<textarea name="${esc(f.key)}">${esc(f.value??'')}</textarea>`:`<input name="${esc(f.key)}" value="${key(f)}">`}</label>`).join('')}</div></div>`}
function renderExperience(){const el=$('#experienceList');el.innerHTML=cache.experience.map(x=>itemEditor(x.role,[{label:'Role',key:'role',value:x.role},{label:'Company',key:'company',value:x.company},{label:'Period',key:'period',value:x.period},{label:'Bullets (one per line)',key:'bullets',value:(x.bullets||[]).join('\n'),textarea:true,wide:true}],async obj=>{obj.bullets=obj.bullets.split('\n').map(s=>s.trim()).filter(Boolean);const {error}=await supabase.from('experience').upsert({id:x.id,...obj,sort_order:x.sort_order});if(error)throw error;toast('Experience saved');loadAll()},async()=>{await supabase.from('experience').delete().eq('id',x.id);toast('Experience deleted');loadAll()})).join('')}
function renderSkills(){const el=$('#skillsList');el.innerHTML=cache.skills.map(x=>itemEditor(x.category,[{label:'Category',key:'category',value:x.category},{label:'Tags',key:'tags',value:x.tags,wide:true},{label:'Icon',key:'icon',value:x.icon}],async obj=>{const {error}=await supabase.from('skills').upsert({id:x.id,...obj,sort_order:x.sort_order});if(error)throw error;toast('Skill saved');loadAll()},async()=>{await supabase.from('skills').delete().eq('id',x.id);toast('Skill deleted');loadAll()})).join('')}
function renderProjects(){const el=$('#projectsList');el.innerHTML=cache.projects.map(x=>itemEditor(x.name,[{label:'Name',key:'name',value:x.name},{label:'Category',key:'category',value:x.category},{label:'URL',key:'url',value:x.url,wide:true},{label:'Description',key:'description',value:x.description,textarea:true,wide:true},{label:'Tags separated by ·',key:'tech',value:x.tech,wide:true}],async obj=>{const {error}=await supabase.from('projects').upsert({id:x.id,...obj,sort_order:x.sort_order});if(error)throw error;toast('Project saved');loadAll()},async()=>{await supabase.from('projects').delete().eq('id',x.id);toast('Project deleted');loadAll()})).join('')}
function renderEducation(){const el=$('#educationList');el.innerHTML=cache.education.map(x=>itemEditor(x.title,[{label:'Title',key:'title',value:x.title},{label:'Body',key:'body',value:x.body,wide:true},{label:'Type',key:'type',value:x.type}],async obj=>{const {error}=await supabase.from('education').upsert({id:x.id,...obj,sort_order:x.sort_order});if(error)throw error;toast('Credential saved');loadAll()},async()=>{await supabase.from('education').delete().eq('id',x.id);toast('Credential deleted');loadAll()})).join('')}
function renderResumes(){const el=$('#resumeList');el.innerHTML=cache.resume.map(r=>`<div class="resume-row"><div><b>${esc(r.type)}</b><span>${esc(r.name)}</span></div><div><a href="${esc(r.url)}" target="_blank">Open</a><button class="danger" data-id="${r.id}">Delete</button></div></div>`).join('');el.querySelectorAll('.danger').forEach(b=>b.onclick=async()=>{const r=cache.resume.find(x=>String(x.id)===String(b.dataset.id));if(!r)return;if(r.storage_path)await supabase.storage.from('resumes').remove([r.storage_path]);await supabase.from('resume').delete().eq('id',r.id);toast('Resume deleted');loadAll()})}
$('#profileForm')
function wireDelegation(containerId){const el=$(containerId);el.addEventListener('click',async e=>{if(e.target.classList.contains('save-item')){try{const item=e.target.closest('.item');const name=item.querySelector('.item-title b').textContent;const source=[...cache.experience,...cache.skills,...cache.projects,...cache.education].find(x=>[x.role,x.category,x.name,x.title].includes(name));const obj={}; item.querySelectorAll('input[name],textarea[name]').forEach(f=>obj[f.name]=f.value);if(source.role){obj.bullets=obj.bullets.split('\n').map(s=>s.trim()).filter(Boolean);await supabase.from('experience').upsert({id:source.id,...obj,sort_order:source.sort_order})}else if(source.category){await supabase.from('skills').upsert({id:source.id,...obj,sort_order:source.sort_order})}else if(source.name){await supabase.from('projects').upsert({id:source.id,...obj,sort_order:source.sort_order})}else {await supabase.from('education').upsert({id:source.id,...obj,sort_order:source.sort_order})}toast('Saved');loadAll()}catch(err){toast(err.message,false)}} if(e.target.classList.contains('delete-item')){const item=e.target.closest('.item');const name=item.querySelector('.item-title b').textContent;const source=[...cache.experience,...cache.skills,...cache.projects,...cache.education].find(x=>[x.role,x.category,x.name,x.title].includes(name));if(!source)return;const tableName=source.role?'experience':source.category?'skills':source.name?'projects':'education';await supabase.from(tableName).delete().eq('id',source.id);toast('Deleted');loadAll()}})}
wireDelegation('#experienceList');wireDelegation('#skillsList');wireDelegation('#projectsList');wireDelegation('#educationList');
$('#addExperience').onclick=async()=>{await supabase.from('experience').insert({role:'New Role',company:'Company',period:'YYYY – YYYY',bullets:['New responsibility'],sort_order:(cache.experience.length+1)*10});loadAll()};$('#addSkill').onclick=async()=>{await supabase.from('skills').insert({category:'New Skill Group',tags:'Tool · Skill',icon:'✦',sort_order:(cache.skills.length+1)*10});loadAll()};$('#addProject').onclick=async()=>{await supabase.from('projects').insert({name:'New Project',category:'Project',description:'Add project description.',url:'https://',tech:'Tag · Tag',sort_order:(cache.projects.length+1)*10});loadAll()};$('#addEducation').onclick=async()=>{await supabase.from('education').insert({title:'New Credential',body:'Institution · Year',type:'Education',sort_order:(cache.education.length+1)*10});loadAll()};
async function upload(kind,inputId){
  const f=$(inputId).files[0];
  if(!f){toast('Choose a file first',false);return}
  const allowed=kind==='PDF'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if(f.type && f.type!==allowed){toast(`Please choose a valid ${kind} file`,false);return}
  const ext=kind==='PDF'?'pdf':'docx';
  const path=`${kind.toLowerCase()}.${ext}`;
  const bucket=supabase.storage.from('resumes');

  // Replace the fixed-path file cleanly. This avoids the extra Storage
  // SELECT/UPDATE privileges required by upsert=true.
  const {error:removeErr}=await bucket.remove([path]);
  if(removeErr && !/not found|No such file/i.test(removeErr.message||'')){
    toast(removeErr.message,false);return;
  }

  const {error:uploadErr}=await bucket.upload(path,f,{upsert:false,contentType:allowed,cacheControl:'3600'});
  if(uploadErr){toast(uploadErr.message,false);return}

  const {data:pub}=bucket.getPublicUrl(path);
  const {error:dbErr}=await supabase.from('resume').upsert({
    type:kind,
    name:f.name,
    url:pub.publicUrl,
    storage_path:path,
    sort_order:kind==='PDF'?1:2
  },{onConflict:'type'});
  if(dbErr){
    // Keep Storage and DB consistent if the database update fails.
    await bucket.remove([path]);
    toast(dbErr.message,false);return;
  }
  $(inputId).value='';
  toast(`${kind} uploaded successfully`);
  await loadAll();
}
$('#uploadPdf').onclick=()=>upload('PDF','#pdfFile');$('#uploadDocx').onclick=()=>upload('DOCX','#docxFile');
boot();
