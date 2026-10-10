'use strict';
// Insira apenas as fotos reais fornecidas pelo cliente; não há imagens de exemplo.
const CONFIG = {
  landingUrl: 'landing/index.html',
  clientImages: [
    {src:'assets/contas-antes-depois-1.webp', alt:'Comparação de contas de energia Copel, antes e depois'},
    {src:'assets/contas-antes-depois-2.webp', alt:'Comparação de contas de energia Enel, antes e depois'},
    {src:'assets/contas-antes-depois-3.webp', alt:'Comparação de contas de energia Energisa, antes e depois'},
    {src:'assets/contas-antes-depois-4.webp', alt:'Primeira comparação de contas de energia Cemig, antes e depois'},
    {src:'assets/contas-antes-depois-5.webp', alt:'Segunda comparação de contas de energia Cemig, antes e depois'}
  ],
  carouselInterval: 3000
};
const questions = [
  {title:'Onde a conta de luz está pesando mais no seu bolso?', options:['Na minha casa','No meu sítio ou chácara','Na minha fazenda']},
  {title:'Quanto você paga por mês na conta de luz hoje?', options:['Até R$150','R$151–300','R$301–500','Mais de R$500']},
  {title:'Quais aparelhos você quer usar com menos preocupação com a conta de luz?', options:['Lâmpadas','TV e internet','Geladeira/freezer','Bomba d’água','Ventilador','Máquina de lavar','Ferramentas elétricas','Equipamentos da criação ou da produção','Outros'], multiple:true}
];
const answers = questions.map(()=>[]);
let step=0, moving=false, timer;
const $=id=>document.getElementById(id);
function render(){
  stopCarousel();
  clearTimeout(timer); moving=false;
  $('question-screen').hidden=false; $('result-screen').hidden=true;
  const q=questions[step];
  $('first-question-photo').hidden=step!==0;
  $('question-title').textContent=q.title;
  $('question-help').textContent=q.multiple?'Marque uma ou mais opções e toque em Continuar.':'Toque em uma opção para continuar.';
  $('step-label').textContent=`Pergunta ${step+1} de ${questions.length}`;
  $('progress-fill').style.width=`${step/questions.length*100}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(step));
  $('options').replaceChildren();
  $('options').setAttribute('role','group');
  $('options').setAttribute('aria-labelledby','question-title');
  q.options.forEach((label,index)=>{
    const wrap=document.createElement('div');wrap.className='option';
    const input=document.createElement('input');input.type=q.multiple?'checkbox':'radio';input.name='answer';input.id=`answer-${index}`;input.checked=answers[step].includes(index);
    const text=document.createElement('label');text.htmlFor=input.id;text.textContent=label;
    input.addEventListener('change',()=>{
      if(moving)return;
      if(q.multiple){answers[step]=Array.from($('options').querySelectorAll('input')).flatMap((el,i)=>el.checked?[i]:[]);$('continue').disabled=answers[step].length===0;}
      else{answers[step]=[index];moving=true;timer=setTimeout(next,230);}
    });
    if(!q.multiple)input.addEventListener('click',()=>{if(!moving){answers[step]=[index];moving=true;timer=setTimeout(next,230);}});
    wrap.append(input,text);$('options').append(wrap);
  });
  $('continue').hidden=!q.multiple;$('continue').disabled=answers[step].length===0;
  $('back').hidden=step===0;
  $('question-title').focus({preventScroll:true});window.scrollTo(0,0);
}
function next(){
  if(!answers[step].length)return;
  if(step<questions.length-1){step++;render();if(step===1)loadPhoto(0);}else showResult();
}
function selected(i){return answers[i].map(n=>questions[i].options[n]).join(', ');}
function showResult(){
  if(answers.some(a=>!a.length))return;
  $('question-screen').hidden=true;$('result-screen').hidden=false;
  $('summary').replaceChildren();
  ['Local','Conta mensal','Aparelhos'].forEach((label,i)=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=selected(i);row.append(dt,dd);$('summary').append(row);});
  const url=new URL(CONFIG.landingUrl,window.location.href);
  // Leva os parâmetros do anúncio até a landing, sem enviar as respostas pessoais.
  new URLSearchParams(window.location.search).forEach((value,key)=>url.searchParams.set(key,value));
  $('landing-link').href=url.href;
  setupCarousel();
  $('result-title').focus({preventScroll:true});window.scrollTo(0,0);
}
let carouselTimer, photoIndex=-1, carouselEpoch=0;
const photos=new Map(), pendingPhotos=new Map(), failedPhotos=new Map();
function stopCarousel(){clearTimeout(carouselTimer);carouselEpoch++;}
function resultVisible(){return !document.hidden&&!$('result-screen').hidden;}
function loadPhoto(index){
  if(photos.has(index))return Promise.resolve(photos.get(index));
  if(pendingPhotos.has(index))return pendingPhotos.get(index);
  if(Date.now()-(failedPhotos.get(index)||0)<30000)return Promise.resolve(null);
  const item=CONFIG.clientImages[index];
  const promise=new Promise(resolve=>{
    const img=new Image();let settled=false;
    const finish=ok=>{
      if(settled)return;settled=true;clearTimeout(deadline);img.onload=img.onerror=null;
      pendingPhotos.delete(index);
      if(ok){photos.set(index,img);failedPhotos.delete(index);}else{failedPhotos.set(index,Date.now());img.removeAttribute('srcset');img.removeAttribute('src');}
      resolve(ok?img:null);
    };
    const deadline=setTimeout(()=>finish(false),20000);
    img.alt=item.alt;img.width=960;img.height=960;img.hidden=true;img.decoding='async';
    img.onload=async()=>{try{if(img.decode)await img.decode();finish(img.naturalWidth>0);}catch{finish(false);}};
    img.onerror=()=>finish(false);
    img.src=(window.matchMedia('(max-width: 620px)').matches?item.src.replace('.webp','-640.webp'):item.src)+'?v=3g-original-20261010';
  });
  pendingPhotos.set(index,promise);return promise;
}
async function showPhoto(index,epoch){
  const img=await loadPhoto(index);
  if(!img||epoch!==carouselEpoch||!resultVisible())return false;
  // Nunca apagar a foto anterior enquanto a próxima está baixando.
  if(!img.isConnected)$('client-slides').append(img);
  img.hidden=false;
  $('client-slides').querySelectorAll('img').forEach(other=>{if(other!==img)other.hidden=true;});
  photoIndex=index;$('photo-placeholder').hidden=true;
  return true;
}
function startCarousel(){
  clearTimeout(carouselTimer);
  if(!resultVisible()||photoIndex<0)return;
  const epoch=carouselEpoch;
  carouselTimer=setTimeout(async()=>{
    const previous=photoIndex;
    for(let offset=1;offset<CONFIG.clientImages.length;offset++){
      const index=(previous+offset)%CONFIG.clientImages.length;
      if(epoch!==carouselEpoch||!resultVisible())return;
      if(await showPhoto(index,epoch))break;
    }
    if(epoch===carouselEpoch&&resultVisible())startCarousel();
  },CONFIG.carouselInterval);
  // Adiantar somente a próxima foto, sem baixar as cinco simultaneamente.
  loadPhoto((photoIndex+1)%CONFIG.clientImages.length);
}
async function setupCarousel(){
  stopCarousel();const epoch=carouselEpoch;
  $('client-result').hidden=false;
  if(photoIndex>=0){startCarousel();return;}
  $('photo-placeholder').hidden=false;
  $('photo-status').textContent='Carregando fotos…';$('retry-photos').hidden=true;
  for(let index=0;index<CONFIG.clientImages.length;index++){
    if(await showPhoto(index,epoch)){startCarousel();return;}
    if(epoch!==carouselEpoch||!resultVisible())return;
  }
  $('photo-status').textContent='Não foi possível carregar as fotos. Tente novamente ou continue abaixo.';
  $('retry-photos').hidden=false;
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCarousel();else if(!$('result-screen').hidden){if(photoIndex<0)setupCarousel();else startCarousel();}});
$('retry-photos').addEventListener('click',()=>{failedPhotos.clear();setupCarousel();});
$('continue').addEventListener('click',next);
$('back').addEventListener('click',()=>{if(step>0){step--;render();}});
$('edit').addEventListener('click',()=>{step=0;render();});
render();
// Adianta a primeira conta enquanto a pessoa responde, depois da foto inicial.
const introPhoto=$('first-question-photo');
const warmFirstPhoto=()=>setTimeout(()=>loadPhoto(0),300);
if(introPhoto.complete&&introPhoto.naturalWidth)warmFirstPhoto();
else introPhoto.addEventListener('load',warmFirstPhoto,{once:true});
