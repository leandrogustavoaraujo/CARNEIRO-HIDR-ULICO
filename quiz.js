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
  {title:'Qual dessas situações você mais quer resolver?', options:['A conta de luz está ficando cara demais','Quando falta luz, meus aparelhos param','Preciso de energia num lugar onde a rede não chega']},
  {title:'Quais aparelhos você quer usar com menos preocupação com a conta de luz?', options:['Lâmpadas','TV e internet','Geladeira/freezer','Bomba d’água','Ventilador','Máquina de lavar','Ferramentas elétricas','Equipamentos da criação ou da produção','Outros'], multiple:true},
  {title:'O preço da energia solar já fez você adiar esse plano?', options:['Sim, já pedi orçamento e achei caro','Sim, nem pedi orçamento porque acho que não cabe no bolso','Ainda não sei quanto custa para o que eu preciso','O preço não é o problema; tenho outras dúvidas']},
  {title:'Qual dúvida você precisa resolver para dar o primeiro passo?', options:['Tenho medo de gastar com peças erradas','Não sei por onde começar','Não sei se uma bateria de carro atende ao que preciso','Tenho receio de fazer uma instalação insegura']}
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
    });wrap.append(input,text);$('options').append(wrap);
  });
  $('continue').hidden=!q.multiple;$('continue').disabled=answers[step].length===0;
  $('back').hidden=step===0;
  $('question-title').focus({preventScroll:true});window.scrollTo(0,0);
}
function next(){
  if(!answers[step].length)return;
  if(step<questions.length-1){step++;render();}else showResult();
}
function selected(i){return answers[i].map(n=>questions[i].options[n]).join(', ');}
function showResult(){
  if(answers.some(a=>!a.length))return;
  $('question-screen').hidden=true;$('result-screen').hidden=false;
  $('summary').replaceChildren();
  ['Local','Conta mensal','Sua dor','Aparelhos','Investimento','Sua dúvida'].forEach((label,i)=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=selected(i);row.append(dt,dd);$('summary').append(row);});
  const url=new URL(CONFIG.landingUrl,window.location.href);
  // Leva os parâmetros do anúncio até a landing, sem enviar as respostas pessoais.
  new URLSearchParams(window.location.search).forEach((value,key)=>url.searchParams.set(key,value));
  $('landing-link').href=url.href;
  setupCarousel();
  $('result-title').focus({preventScroll:true});window.scrollTo(0,0);
}
let carouselTimer, photoIndex=0, slides=[];
function stopCarousel(){clearInterval(carouselTimer);}
function startCarousel(){
  stopCarousel();
  if(slides.length>1&&!document.hidden&&!$('result-screen').hidden){carouselTimer=setInterval(()=>showPhoto(photoIndex+1),CONFIG.carouselInterval);}
}
function showPhoto(index){
  if(!slides.length)return;
  photoIndex=(index+slides.length)%slides.length;
  slides.forEach((img,i)=>{img.hidden=i!==photoIndex;});
}
async function setupCarousel(){
  stopCarousel();slides=[];$('client-slides').replaceChildren();$('client-result').hidden=true;$('photo-placeholder').hidden=false;
  const loaded=await Promise.all(CONFIG.clientImages.map(item=>new Promise(resolve=>{
    const img=new Image();img.alt=item.alt||'Contas de energia antes e depois de um cliente';img.hidden=true;img.decoding='async';
    img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=item.src;
  })));
  slides=loaded.filter(Boolean);
  if(!slides.length)return;
  $('client-slides').append(...slides);$('client-result').hidden=false;$('photo-placeholder').hidden=true;
  showPhoto(0);startCarousel();
}
document.addEventListener('visibilitychange',startCarousel);
$('continue').addEventListener('click',next);
$('back').addEventListener('click',()=>{if(step>0){step--;render();}});
$('edit').addEventListener('click',()=>{step=0;render();});
render();
