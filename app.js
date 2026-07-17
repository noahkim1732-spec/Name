const AI_FACTORS = [
  {name:"Large-scale information processing", terms:["data","research","records","documents","information","review","reports","database"]},
  {name:"Routine written content", terms:["write","writing","email","content","copy","documentation","reports","forms"]},
  {name:"Pattern finding in structured data", terms:["analyze","analysis","trends","patterns","metrics","statistics","diagnostic","forecast"]},
  {name:"Sorting, tagging, and categorizing", terms:["sort","classify","categorize","tag","organize","inventory","filing"]},
  {name:"Summarizing and condensing", terms:["summarize","brief","digest","review","research","notes"]},
  {name:"Repetitive digital tasks", terms:["routine","repetitive","data entry","processing","scheduling","administrative","digital"]},
  {name:"Standardized quantitative analysis", terms:["calculate","financial","accounting","quantitative","pricing","audit","spreadsheet","budget"]},
  {name:"Searching large document sets", terms:["legal research","compliance","documents","search","records","literature"]},
  {name:"Straightforward translation", terms:["translate","translation","interpreter","localization","language"]},
  {name:"First drafts and templates", terms:["draft","template","proposal","presentation","design variations","code"]},
  {name:"Data cleaning and prediction", terms:["clean data","forecast","predict","model","machine learning","data scientist","analyst"]}
];
const HUMAN_FACTORS = [
  {name:"Relationships and trust", terms:["patient","client","customer","student","coach","counsel","relationship","care","community","teach"]},
  {name:"Persuasion and influence", terms:["sell","sales","negotiate","persuade","advocate","fundraise","marketing"]},
  {name:"Judgment under uncertainty", terms:["diagnose","emergency","judgment","investigate","decision","risk","clinical","attorney"]},
  {name:"Leadership and motivation", terms:["lead","manage","supervise","mentor","director","executive","captain","project manager"]},
  {name:"Framing messy problems", terms:["strategy","consult","complex","discover","research question","architect","entrepreneur"]},
  {name:"Ambiguity and changing goals", terms:["adapt","dynamic","field","unexpected","crisis","startup","coordinate"]},
  {name:"Ethical and contextual judgment", terms:["ethical","legal","safety","welfare","policy","medical","security","social worker"]},
  {name:"Team and stakeholder coordination", terms:["team","stakeholder","collaborate","coordinate","cross-functional","project"]},
  {name:"Long-term strategy", terms:["strategy","long-term","vision","planning","executive","founder","investment"]},
  {name:"Sensitive or emotional situations", terms:["emotional","therapy","counsel","grief","conflict","mental health","nurse","social"]},
  {name:"Physical or in-person work", terms:["install","repair","build","operate","drive","lift","field","hands-on","electrician","plumber","technician","construction","chef","dentist"]}
];

const ROLE_HINTS = [
  {match:/account|bookkeep|payroll|teller/, ai:72, a:[6,5,2], h:[6,2]},
  {match:/data|actuar|statistic|financial analyst|business analyst/, ai:68, a:[0,2,6,10], h:[2,4]},
  {match:/software|developer|programmer|web engineer/, ai:58, a:[0,8,9], h:[4,5,7]},
  {match:/writer|translator|copywriter|editor|content/, ai:70, a:[1,4,8,9], h:[1,4]},
  {match:/nurse|doctor|physician|therap|counsel|psycholog|social worker/, ai:28, a:[0,4], h:[0,2,6,9]},
  {match:/teacher|professor|coach|trainer/, ai:32, a:[1,4,9], h:[0,3,5,9]},
  {match:/electric|plumb|carpenter|mechanic|construction|hvac|welder/, ai:22, a:[0,5], h:[2,5,10]},
  {match:/driver|pilot|operator|delivery/, ai:47, a:[5,10], h:[2,5,10]},
  {match:/manager|executive|director|founder|entrepreneur/, ai:37, a:[0,4,9], h:[0,3,4,7,8]},
  {match:/lawyer|attorney|paralegal|legal/, ai:50, a:[0,4,7,9], h:[1,2,6]},
  {match:/sales|recruit|public relations|fundrais/, ai:39, a:[0,1,9], h:[0,1,5,7]},
  {match:/security|police|firefighter|paramedic|military/, ai:27, a:[0,2], h:[2,5,6,10]},
  {match:/artist|designer|architect|musician|photograph|film/, ai:44, a:[1,8,9], h:[4,5,6]},
  {match:/scientist|researcher|chemist|biologist/, ai:48, a:[0,2,4,10], h:[2,4,6]},
  {match:/chef|server|barber|stylist|massage/, ai:20, a:[5], h:[0,5,10]},
  {match:/marketing|advertis/, ai:55, a:[0,1,2,8,9], h:[1,4,7]},
];

const form=document.querySelector("#risk-form"),results=document.querySelector("#results");
document.querySelectorAll("[data-job]").forEach(b=>b.addEventListener("click",()=>{document.querySelector("#job-title").value=b.dataset.job;document.querySelector("#job-description").focus()}));

function matches(text,factor){return factor.terms.reduce((n,term)=>n+(text.includes(term)?1:0),0)}
function uniqueFactors(indices,list){return [...new Set(indices)].slice(0,4).map(i=>list[i])}
function analyze(job,description){
  const text=(job+" "+description).toLowerCase();
  const hint=ROLE_HINTS.find(r=>r.match.test(text));
  const aiHits=AI_FACTORS.map((f,i)=>({i,n:matches(text,f)})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
  const humanHits=HUMAN_FACTORS.map((f,i)=>({i,n:matches(text,f)})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
  let base=hint?hint.ai:50;
  if(description.trim().length>15){
    const aiTotal=aiHits.reduce((s,x)=>s+x.n,0),humanTotal=humanHits.reduce((s,x)=>s+x.n,0);
    if(aiTotal+humanTotal) base=.55*base+.45*(100*aiTotal/(aiTotal+humanTotal));
  }
  const score=Math.max(8,Math.min(92,Math.round(base)));
  const aiIdx=[...aiHits.map(x=>x.i),...(hint?.a||[]),0,5];
  const humanIdx=[...humanHits.map(x=>x.i),...(hint?.h||[]),2,0];
  return {score,ai:uniqueFactors(aiIdx,AI_FACTORS),human:uniqueFactors(humanIdx,HUMAN_FACTORS),confidence:description.trim().length>30?"Higher confidence · task details included":hint?"Moderate confidence · based mainly on job title":"Early estimate · add task details for greater accuracy"};
}
function labelFor(score){if(score<30)return["Lower task exposure","#dff3e8","#1f6a50"];if(score<50)return["Moderate-low task exposure","#e8f0dc","#557235"];if(score<70)return["Moderate task exposure","#fff0dc","#a55e22"];return["Higher task exposure","#fde4db","#a8472b"]}
function renderFactors(target,factors,type){target.innerHTML=factors.map((f,i)=>`<div class="factor"><strong>${f.name}</strong><small>${type==="ai"?(i===0?"Likely to be accelerated by AI tools":"A task area AI can assist with"):(i===0?"A strong source of human value":"Harder to automate fully")}</small></div>`).join("")}
form.addEventListener("submit",e=>{e.preventDefault();const job=document.querySelector("#job-title").value.trim(),desc=document.querySelector("#job-description").value;const r=analyze(job,desc),label=labelFor(r.score);form.hidden=true;results.hidden=false;document.querySelector("#result-title").textContent=job;document.querySelector("#risk-score").textContent=r.score;document.querySelector("#confidence").textContent=r.confidence;const ring=document.querySelector("#score-ring");ring.style.setProperty("--score",r.score);ring.style.setProperty("--ring",label[2]);const badge=document.querySelector("#risk-label");badge.textContent=label[0];badge.style.background=label[1];badge.style.color=label[2];document.querySelector("#result-summary").textContent=r.score>=70?"Many tasks in this role are structured or digital, so AI may substantially reshape how the work gets done. Human judgment and relationships remain important.":r.score>=50?"AI will likely handle or speed up several tasks in this role, while people continue to lead work involving context, responsibility, and collaboration.":"This career depends strongly on human presence, judgment, relationships, or hands-on work. AI is more likely to assist than replace the role.";document.querySelector("#ai-bar").style.width=r.score+"%";document.querySelector("#ai-percent").textContent=r.score+"% AI-suited";renderFactors(document.querySelector("#ai-factors"),r.ai,"ai");renderFactors(document.querySelector("#human-factors"),r.human,"human");results.scrollIntoView({behavior:"smooth",block:"center"})});
document.querySelector("#reset-button").addEventListener("click",()=>{results.hidden=true;form.hidden=false;form.reset();document.querySelector("#job-title").focus()});
