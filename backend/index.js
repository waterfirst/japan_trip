'use strict';
const express=require('express'),cors=require('cors'),axios=require('axios'),TTS=require('@google-cloud/text-to-speech');
const app=express(),tts=new TTS.TextToSpeechClient();
const voices={ko:{languageCode:'ko-KR',name:'ko-KR-Chirp3-HD-Aoede'},ja:{languageCode:'ja-JP',name:'ja-JP-Chirp3-HD-Aoede'}};
app.use(cors({origin:['https://waterfirst.github.io','http://localhost:8000']}));app.use(express.json({limit:'8kb'}));
app.get('/',(_q,r)=>r.json({status:'ok',tts:'Google Chirp 3: HD'}));
app.post('/interpret',async(q,r)=>{const{text,source,target}=q.body||{};if(!text||text.length>500||!voices[source]||!voices[target]||source===target)return r.status(400).json({error:'Invalid request'});try{const x=await axios.get('https://translate.googleapis.com/translate_a/single',{timeout:8000,params:{client:'gtx',sl:source,tl:target,dt:'t',q:text}});const translation=(x.data?.[0]||[]).map(v=>v?.[0]||'').join('').trim();if(!translation)throw Error('Empty translation');const[speech]=await tts.synthesizeSpeech({input:{text:translation},voice:voices[target],audioConfig:{audioEncoding:'MP3'}});r.json({translation,audioContent:Buffer.from(speech.audioContent).toString('base64')})}catch(e){console.error('Interpretation failed:',e.message);r.status(502).json({error:'Interpretation unavailable'})}});
app.listen(process.env.PORT||8080,()=>console.log('Interpreter API ready'));
