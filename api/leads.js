const crypto=require('node:crypto');
const CATALOG=require('../catalog.js');
const interests=new Set([...CATALOG.collections.flatMap(c=>[c.name,...c.products.map(p=>p[0])]),'Other / bespoke project']);
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 const send=(code,body)=>res.status(code).json(body);
 if(req.method!=='POST'){res.setHeader('Allow','POST');return send(405,{error:'Method not allowed.'});}
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return send(415,{error:'Please submit the form as JSON.'});
 if(Number(req.headers['content-length']||0)>12000)return send(413,{error:'Your message is too long.'});
 const origin=req.headers.origin;
 const host=req.headers.host;
 if(origin){try{if(new URL(origin).host!==host)return send(403,{error:'Please use the form on our website.'});}catch{return send(403,{error:'Invalid origin.'});}}
 let b=req.body;try{if(typeof b==='string')b=JSON.parse(b);}catch{return send(400,{error:'Invalid request.'});}
 if(!b||typeof b!=='object'||Array.isArray(b))return send(400,{error:'Invalid request.'});
 const limits={name:100,email:200,phone:30,projectType:30,interest:120,message:3000,requestId:40};
 for(const [key,max]of Object.entries(limits)){if(typeof b[key]!=='string'||!b[key].trim()||b[key].length>max)return send(400,{error:'Please complete all required fields with valid details.'});b[key]=b[key].trim();}
 if(b.website)return send(400,{error:'Unable to submit this request.'});
 if(b.consent!=='on'||!/^\S+@\S+\.\S+$/.test(b.email)||/[\r\n]/.test(b.email)||!/^\+?[\d () .-]{7,30}$/.test(b.phone)||b.message.length<10||!['Residential','Commercial','Hospitality','Other'].includes(b.projectType)||!interests.has(b.interest)||!/^[0-9a-f-]{36}$/i.test(b.requestId))return send(400,{error:'Please check your email, phone number and project details.'});
 if(!process.env.RESEND_API_KEY||!process.env.LEAD_FROM_EMAIL)return send(503,{error:'Online enquiries are not available yet. Please contact us on WhatsApp or email Lmsteeldesigns@gmail.com.'});
 const text=`New LM Steel Designs project enquiry\n\nName: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone}\nProject type: ${b.projectType}\nProduct / collection: ${b.interest}\nMessage:\n${b.message}\n\nSubmitted at (UTC): ${new Date().toISOString()}\nConsent to reply: Yes`;
 const key=crypto.createHash('sha256').update(JSON.stringify([b.requestId,b.name,b.email,b.phone,b.projectType,b.interest,b.message])).digest('hex');
 try{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`lm-lead-${key}`},body:JSON.stringify({from:process.env.LEAD_FROM_EMAIL,to:['Lmsteeldesigns@gmail.com'],reply_to:b.email,subject:'New project enquiry | LM Steel Designs',text}),signal:AbortSignal.timeout(12000)});const result=await response.json();if(!response.ok||!result.id)return send(502,{error:'Your request could not be sent. Please try again or contact us on WhatsApp.'});return send(200,{ok:true});}catch{return send(502,{error:'Unable to reach our email service. Please try again or contact us on WhatsApp.'});}
};
