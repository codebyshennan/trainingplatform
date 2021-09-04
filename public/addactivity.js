
document.addEventListener('DOMContentLoaded', ()=>{
    
  const startdate = document.querySelector('#startdate');
  const datecontainer = document.getElementById('datecontainer');
  const activitytype = document.getElementById('activitytype');
  const activitylist = document.getElementById('activitylist');
  const rangevalue = document.getElementById('rangevalue');
  const perceivedexertion = document.getElementById('perceivedexertion');
  const feelingvalue = document.getElementById('feelingvalue');
  const smileys = document.querySelectorAll('input.smiley')
  const plannedavgpace = document.getElementById('plannedavgpace');
  const timetaken = document.getElementById('timetaken');
  const plannedtime = document.getElementById('plannedtime');
  const actualavgpace = document.getElementById('actualavgpace');
  const distancevalue = document.getElementById('distancevalue');
  const planneddistance = document.getElementById('planneddistance');
  const workoutcard = document.getElementById('workoutcard');
  const formentry = document.getElementById('formentry');
  const meridiem = ['am','pm']
  const interval = ['00','15','30','45'];
  const timelist = document.getElementById('timelist');
  const actualtimetaken = document.getElementById('actualtimetaken');
  const avgpace = document.getElementById('avgpace');
  const trainingfile = document.getElementById('trainingfile');
  const filepath = document.getElementById('filepath');
  const actualdistance = document.getElementById('actualdistance');

  startdate.addEventListener('focus', (e) => {
    e.target.type='date';
    if(e.target.value) {
      e.target.value = e.target.datavalue;
    }
  }, true)

  startdate.addEventListener('blur', (e) => {
      e.target.type = 'text';
  }, true)

  startdate.addEventListener('change', (e)=> {
      let temp = e.target.value;
      e.target.placeholder = (new Date(e.target.value)).toString().substr(0,15);
      e.target.datavalue = temp;
      datecontainer.value = temp;
      e.target.value = "";
      e.target.type='text';
  }, true)

  for(let j=0;j<2;j++){
    for(let i = 0; i<12; i++){
      for(int in interval) {
        
        timelist.add(new Option
        ((i==0?12:i).toString() + ':'+ interval[int] + ' '+ meridiem[j], 
        i.toString() + ':' + interval[int]))
      }
    }
  }

  activitylist.addEventListener('change', (e)=>{
    const value = e.target.value;
    switch (value) {
      case "swimming":
        activitytype.innerHTML = `<i class="fas fa-swimmer" style="font-size: 3rem"></i>`
        break;

      case "running":
        activitytype.innerHTML = `<i class="fas fa-running" style="font-size: 3rem"></i>`
        break;

      case "cycling":
        activitytype.innerHTML = `<i class="fas fa-biking" style="font-size: 3rem"></i>`
        break;

      case "gym":
        activitytype.innerHTML = `<i class="fas fa-dumbbell" style="font-size: 3rem"></i>`
        break;

      default:
        break;
    }
  })

  perceivedexertion.addEventListener('change', (e)=>{
    switch (e.target.value) {
      case '1':
      case '2':
      case '3':
        rangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is easy.`;
        break;
      
      case '4':
      case '5':
      case '6':
        rangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is moderate.`;
        break;

      case '7':
      case '8':
      case '9':
        rangevalue.innerText = `Your RPE is ${e.target.value}. You feel that the training intensity is high.`;
        break;

      case '10':
        rangevalue.innerText = `Your RPE is ${e.target.value}. You feel like dying.`;
        break;
    
      default:
        rangevalue.innerText = `Select a range value.`;
        break;
    }
    
  })

  smileys.forEach((x)=>
    x.addEventListener('click',(ev)=> {
      feelingvalue.innerHTML = ev.target.nextElementSibling.outerHTML;
    }
    ))

  plannedtime.addEventListener('change', (ev)=>{
      const durationarray = ev.target.value.split(':')
      if(durationarray.length===1){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
        timetaken.innerText = ev.target.value;
      } else if (durationarray.length == 2){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
        timetaken.innerText = ev.target.value;
      } else {
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
        timetaken.innerText = ev.target.value;
      }
    })

  actualtimetaken.addEventListener('change', (ev)=>{
      const durationarray = ev.target.value.split(':')
      if(durationarray.length===1){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
        timetaken.innerText = ev.target.value;
      } else if (durationarray.length == 2){
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
        timetaken.innerText = ev.target.value;
      } else {
        ev.target.value = (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
        timetaken.innerText = ev.target.value;
      }
    })
  
  planneddistance.addEventListener('change', (ev)=>{
      const num = Number(ev.target.value);
      ev.target.value = num.toFixed(2)
      distancevalue.innerText = ev.target.value;
      } );

  actualdistance.addEventListener('change', (ev)=>{
      const num = Number(ev.target.value);
      ev.target.value = num.toFixed(2)
      distancevalue.innerText = ev.target.value;
      } );

  formentry.addEventListener('change',(ev)=>{

    const plantimearray = plannedtime.value.split(':')
    const actualtimearray = actualtimetaken.value.split(':')
    const gettime = (array) => {
      const hours = +array[0] * 60 * 60;
      const minutes = +array[1] * 60;
      const seconds = +array[2];
      return hours+minutes+seconds;
    }
    
    const plantimevalue = gettime(plantimearray)
    const actualtimevalue = gettime(actualtimearray)

    if(planneddistance.value && plantimevalue) {
      const plannedpacevalue = (+planneddistance.value * 60 * 60 / plantimevalue).toFixed(2)
      plannedavgpace.value = isNaN(plannedpacevalue) ? 0: plannedpacevalue;
    }

    if(actualdistance.value && actualtimevalue) {
      const actualpacevalue = (+actualdistance.value * 60 * 60 / actualtimevalue).toFixed(2)
      actualavgpace.value = isNaN(actualpacevalue) ? 0 : actualpacevalue;
      avgpace.value = isNaN(actualpacevalue) ? 0 : actualpacevalue;
    }

    if(plannedavgpace.value && actualavgpace.value){
       const comparepace = Math.abs(Number(plannedavgpace.value) - Number(actualavgpace.value)) / Number(plannedavgpace.value);

       console.log(comparepace)

      switch (true) {
        case comparepace <= 0.2:
          workoutcard.style.backgroundColor = 'rgb(127,192,98)';
          break;
        case comparepace <= 0.5:
          workoutcard.style.backgroundColor = 'rgb(253,202,46)';
          break;
        case comparepace <= 0.9:
          workoutcard.style.backgroundColor = 'rgb(253,148,44)';
          break;
        
        case comparepace == 1:
          workoutcard.style.backgroundColor = 'rgb(211,10,38)';
          break;
      
        default:
          workoutcard.style.backgroundColor = 'rgb(210,210,210)';
          break;
      }
    }
  })

trainingfile.addEventListener('change', (ev)=> {
  filepath.innerText = ev.target.value;
})


})
