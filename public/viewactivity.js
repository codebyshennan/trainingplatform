
document.addEventListener('DOMContentLoaded', ()=>{
    
  const infostartdate = document.querySelector('#infostartdate');
  const infodatecontainer = document.getElementById('infodatecontainer');
  const infoactivitytype = document.getElementById('infoactivitytype');
  const infoactivitylist = document.getElementById('infoactivitylist');
  const inforangevalue = document.getElementById('inforangevalue');
  const infoperceivedexertion = document.getElementById('infoperceivedexertion');
  const infofeelingvalue = document.getElementById('infofeelingvalue');
  const infosmileys = document.querySelectorAll('input.smiley')
  const infoplannedavgpace = document.getElementById('infoplannedavgpace');
  const infotimetaken = document.getElementById('infotimetaken');
  const infoplannedtime = document.getElementById('infoplannedtime');
  const infoactualavgpace = document.getElementById('infoactualavgpace');
  const infodistancevalue = document.getElementById('infodistancevalue');
  const infoplanneddistance = document.getElementById('infoplanneddistance');
  const infoworkoutcard = document.getElementById('infoworkoutcard');
  const infoformentry = document.getElementById('infoformentry');
  const meridiem = ['am','pm']
  const interval = ['00','15','30','45'];
  const infotimelist = document.getElementById('infotimelist');
  const infoactualtimetaken = document.getElementById('infoactualtimetaken');
  const infoavgpace = document.getElementById('infoavgpace');
  const infoactualdistance = document.getElementById('infoactualdistance');

  infostartdate.addEventListener('focus', (e) => {
    e.target.type='date';
    if(e.target.value) {
      e.target.value = e.target.datavalue;
    }
  }, true)

  infostartdate.addEventListener('blur', (e) => {
      e.target.type = 'text';
  }, true)

  infostartdate.addEventListener('change', (e)=> {
      let temp = e.target.value;
      e.target.placeholder = (new Date(e.target.value)).toString().substr(0,15);
      e.target.datavalue = temp;
      infodatecontainer.value = temp;
      e.target.value = "";
      e.target.type='text';
  }, true)

  for(let j=0;j<2;j++){
    for(let i = 0; i<12; i++){
      for(int in interval) {
        
        infotimelist.add(new Option
        ((i==0?12:i).toString() + ':'+ interval[int] + ' '+ meridiem[j], 
        i.toString() + ':' + interval[int]))
      }
    }
  }

 infoactivitylist.addEventListener('change', (e)=>{
    const value = e.target.value;
    switch (value) {
      case "swimming":
        infoactivitytype.innerHTML = `<i class="fas fa-swimmer" style="font-size: 3rem"></i>`
        break;

      case "running":
        infoactivitytype.innerHTML = `<i class="fas fa-running" style="font-size: 3rem"></i>`
        break;

      case "cycling":
        infoactivitytype.innerHTML = `<i class="fas fa-biking" style="font-size: 3rem"></i>`
        break;

      case "gym":
        infoactivitytype.innerHTML = `<i class="fas fa-dumbbell" style="font-size: 3rem"></i>`
        break;

      default:
        break;
    }
  })

  infoperceivedexertion.addEventListener('change', (e)=>{
    switch (e.target.value) {
      case '1':
      case '2':
      case '3':
        inforangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is easy.`;
        break;
      
      case '4':
      case '5':
      case '6':
        inforangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is moderate.`;
        break;

      case '7':
      case '8':
      case '9':
        inforangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is high.`;
        break;

      case '10':
        inforangevalue.innerText = `Your RPE is ${e.target.value}. You feel like dying.`;
        break;
    
      default:
        inforangevalue.innerText = `Select a range value.`;
        break;
    }
    
  })

  infosmileys.forEach((x)=>
    x.addEventListener('click',(ev)=> {
      infofeelingvalue.innerHTML = ev.target.nextElementSibling.outerHTML;
    }
    ))

  infoplannedtime.addEventListener('change', (ev)=>{
      const durationarray = ev.target.value.split(':')
      if(durationarray.length===1){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
        infotimetaken.innerText = ev.target.value;
      } else if (durationarray.length == 2){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
        infotimetaken.innerText = ev.target.value;
      } else {
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
        infotimetaken.innerText = ev.target.value;
      }
    })

  infoactualtimetaken.addEventListener('change', (ev)=>{
      const durationarray = ev.target.value.split(':')
      if(durationarray.length===1){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
        infotimetaken.innerText = ev.target.value;
      } else if (durationarray.length == 2){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
        infotimetaken.innerText = ev.target.value;
      } else {
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
        infotimetaken.innerText = ev.target.value;
      }
    })
  
  infoplanneddistance.addEventListener('change', (ev)=>{
      const num = Number(ev.target.value);
      ev.target.value = num.toFixed(2)
      infodistancevalue.innerText = ev.target.value;
      } );

  infoactualdistance.addEventListener('change', (ev)=>{
      const num = Number(ev.target.value);
      ev.target.value = num.toFixed(2)
      distancevalue.innerText = ev.target.value;
      } );

  infoformentry.addEventListener('change',(ev)=>{

    const plantimearray = infoplannedtime.value.split(':')
    const actualtimearray = infoactualtimetaken.value.split(':')
    const gettime = (array) => {
      const hours = +array[0] * 60 * 60;
      const minutes = +array[1] * 60;
      const seconds = +array[2];
      return hours+minutes+seconds;
    }
    
    const plantimevalue = gettime(plantimearray)
    const actualtimevalue = gettime(actualtimearray)

    if(infoplanneddistance.value && plantimevalue) {
      const plannedpacevalue = (+infoplanneddistance.value * 60 * 60 / plantimevalue).toFixed(2)
      infoplannedavgpace.value = isNaN(plannedpacevalue) ? 0: plannedpacevalue;
    }

    if(infoactualdistance.value && actualtimevalue) {
      const actualpacevalue = (+infoactualdistance.value * 60 * 60 / actualtimevalue).toFixed(2)
      infoactualavgpace.value = isNaN(actualpacevalue) ? 0 : actualpacevalue;
      infoavgpace.value = isNaN(actualpacevalue) ? 0 : actualpacevalue;
    }

    if(infoplannedavgpace.value && infoactualavgpace.value){
       const comparepace = Math.abs(Number(infoplannedavgpace.value) - Number(infoactualavgpace.value)) / Number(infoplannedavgpace.value);

       console.log(comparepace)

      switch (true) {
        case comparepace <= 0.2:
          infoworkoutcard.style.backgroundColor = 'rgb(127,192,98)';
          break;
        case comparepace <= 0.5:
          infoworkoutcard.style.backgroundColor = 'rgb(253,202,46)';
          break;
        case comparepace <= 0.9:
          infoworkoutcard.style.backgroundColor = 'rgb(253,148,44)';
          break;
        
        case comparepace == 1:
          infoworkoutcard.style.backgroundColor = 'rgb(211,10,38)';
          break;
      
        default:
          infoworkoutcard.style.backgroundColor = 'rgb(210,210,210)';
          break;
      }
    }
  })

})
