
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

  // templates
  const templatecontainer = document.getElementById('templatecontainer');
  const warmuptemplate = document.getElementById('warmuptemplate');
  const activetemplate = document.getElementById('activetemplate');
  const recoverytemplate = document.getElementById('recoverytemplate');
  const cooldowntemplate = document.getElementById('cooldowntemplate');
  const twosteptemplate = document.getElementById('twosteptemplate');
  const threesteptemplate = document.getElementById('threesteptemplate');
  const rampuptemplate = document.getElementById('rampuptemplate');
  const rampdowntemplate = document.getElementById('rampdowntemplate');

  const workoutbuilder = document.getElementById('workoutbuilder');

  // Helper functions
  const gettime = (timeelem) => {
    const array = timeelem.value.split(':');
    console.log(array)
    if(array.length === 0 || array[0]=== '') return 0;
    const hours = +array[0] * 60 * 60;
    const minutes = +array[1] * 60;
    const seconds = +array[2];

    const sum = hours+minutes+seconds
    console.log(sum)
    return sum;
  }

  const toTimeStr = (rawtime) => {
    console.log('Commencing time stringification...');
    const time = Number(rawtime)
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor((time - hours * 60 * 60) / 60);
    const seconds = Math.floor(time - 3600 * hours - 60 * minutes);
    return hours + ':' + minutes + ':' + seconds;
  }

  
  const validateTime = (elem) => {
    console.log('Commencing time validation...')
    const durationarray = elem.split(':')
    console.log('durationarray >> ', durationarray)
      if(durationarray.length===1){
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
      } else if (durationarray.length == 2){
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
      } else {
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
      }
  }

  warmuptemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {
      templatecontainer.innerHTML +=
        `<a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Warm-Up</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:20:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="60" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="80" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>106-120bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  activetemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Active</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:10:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="89" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="98" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>157-172bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  recoverytemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Recovery</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:05:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>88-106bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  cooldowntemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Cool-down</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:10:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="40" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="50" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>70-88bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  twosteptemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<div class='d-flex w-100 mb-1 justify-content-between'>Repeat 4 times</div>
        
        <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Hard</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:06:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="85" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="95" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>150-167bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Easy</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>88-106bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  threesteptemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<div class='d-flex w-100 mb-1 justify-content-between'>Repeat 3 times</div>
        
        <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Hard</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="75" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="85" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>132-150bpm</p>
        </span>
    </a>

    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Harder</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:01:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="90" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="100" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>158-176bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Easy</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>88-106bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  rampuptemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<div class='d-flex w-100 mb-1 justify-content-between'>Repeat 4 times</div>
        
        <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 1</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="55" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="65" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>97-114bpm</p>
        </span>
    </a>

    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 2</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="75" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="85" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>158-176bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 3</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="85" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="95" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>150-167bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 4</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>88-106bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  rampdowntemplate.addEventListener('click', (ev)=>{
    
    const injecthtml = async ()=> {templatecontainer.innerHTML +=
        `<div class='d-flex w-100 mb-1 justify-content-between'>Repeat 4 times</div>
        
        <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 1</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="55" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="65" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>97-114bpm</p>
        </span>
    </a>

    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 2</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="75" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="85" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>158-176bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 3</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="85" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="95" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>150-167bpm</p>
        </span>
    </a>
    
    <a href='#' class='list-group-item list-group-item-action'>
      <div class='d-flex w-100 mb-1 justify-content-between'>
        <h5 class='templateblockheader'>Step 4</h5>
        <small class='templateremove'>Remove block</small></div>
      <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
        <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
        <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
        <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
        <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
        <span class="col-4"> 
          <strong>% of Maximum Heart Rate</strong>
          <p class='templatehr'>88-106bpm</p>
        </span>
    </a>`;}
    
    injecthtml().then((val)=> {
      const templatetime = document.getElementsByClassName('templatetime');
      let newtime = gettime(plannedtime);
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })
  


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
      ev.target.value = validateTime(ev.target.value);
      timetaken.innerText = ev.target.value;
    })

  actualtimetaken.addEventListener('change', (ev)=>{
      ev.target.value = validateTime(ev.target.value);
      timetaken.innerText = ev.target.value;
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

    const plantimevalue = gettime(plannedtime)
    const actualtimevalue = gettime(actualtimetaken)

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
