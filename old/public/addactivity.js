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
  


  const removeValue = (xvalue, yvalue) => {
    
    const indexOfvalue = util.findIndex(element => element.x == xvalue && element.y == yvalue);
    util.splice(indexOfvalue,1);

    // TODO: change scaling due to removal
  }

  const getCurrentX = () => {
    return util[util.length-1].x;
  }

  // console.log(getCurrentX());

  // addValue(1617262000000, 100);
  // addValue(1617264000000, 100);

  //mandatory to update chart after addition or removal
  // myLineChart.update();

  // TODO: make min and max the min and max values of the data



  // Helper functions
  const gettime = (timeelem) => {
    let timearray = [];
    if(typeof timeelem == 'object') {
      timearray = timeelem.value.split(':')
    } else if (typeof timeelem == 'string') {
      timearray = timeelem.split(':');
    } else {
      return 0;
    }
    if(timearray.length === 0 || timearray[0]=== '') return 0;
    const hours = +timearray[0] * 60 * 60;
    const minutes = +timearray[1] * 60;
    const seconds = +timearray[2];

    const sum = hours+minutes+seconds
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
      if(durationarray.length===1){
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':00:00';
      } else if (durationarray.length == 2){
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' +
        (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) +':00';
      } else {
        return (durationarray[0].length == 1 ? '0' + durationarray[0] : (durationarray[0] || '00')) + ':' + (durationarray[1].length == 1 ? '0' + durationarray[1] : (durationarray[1] || '00')) + ':' +(durationarray[2].length == 1 ? '0' + durationarray[2] : (durationarray[2] || '00'));
      }
  }


let templateoptions = [];
  // takes in an array of objects
  const constructTemplate = (options) => {

    options.forEach(obj => {

      const {repeats} = obj;

      if(repeats > 1) {
        const fieldset = document.createElement('fieldset')
        const label = document.createElement('label')
      }


      const templatelistitem = document.createElement('li')
        const templatelink = document.createElement('a');
        templatelink.classList.add('list-group-item', 'list-group-item-action');
          const templatedetails = document.createElement('div')
          templatedetails.classList.add('d-flex','w-100','mb-1','justify-content-between');
          const templateblockheader = document.createElement('h5');
          templateblockheader.classList.add('templateblockheader');
          templateblockheader.textContent = obj.header;
          const templateremove = document.createElement('small');
          templateremove.classList.add('templateremove');
          templateremove.textContent = 'x'
          templatedetails.appendChild(templateblockheader)
          templatedetails.appendChild(templateremove);

          const templateblockdetails = document.createElement('span');
          templateblockdetails.classList.add('templateblockdetails', 'd-flex', 'row', 'w-100', 'mb-1');
          const templatetime = document.createElement('span')
          templatetime.classList.add('col-2');
          const inputtime = document.createElement('input');
          inputtime.classList.add('templatetime')
          inputtime.value = obj.time;
          templatetime.appendChild(inputtime)

          const templateminhr = document.createElement('span')
          templateminhr.classList.add('col-1');
          const inputminhr = document.createElement('input');
          inputminhr.classList.add('templateminhr')
          inputminhr.value = obj.minhr;
          templateminhr.appendChild(inputminhr)

          const spacer = document.createElement('span');
          spacer.classList.add('col-1')
          spacer.style.textAlign='center';
          spacer.innerHTML = `<strong> - </strong>`

          const templatemaxhr = document.createElement('span')
          templatemaxhr.classList.add('col-1');
          const inputmaxhr = document.createElement('input');
          inputmaxhr.classList.add('templatemaxhr')
          inputmaxhr.value = obj.maxhr;
          templatemaxhr.appendChild(inputmaxhr)

          const templatehrpercentage = document.createElement('span');
          templatehrpercentage.classList.add('col-4');
          templatehrpercentage.innerHTML = `<strong> % of Maximum Heart Rate </strong>`;
          const templatehr = document.createElement('p')
          templatehr.classList.add('templatehr')
          templatehr.textContent = obj.hrrange + 'bpm'

          templatehrpercentage.appendChild(templatehr)

          templatelink.appendChild(templatedetails)
          templatelink.appendChild(templateblockdetails)
          templatelink.appendChild(templatetime)
          templatelink.appendChild(templateminhr)
          templatelink.appendChild(spacer);
          templatelink.appendChild(templatemaxhr);
          templatelink.appendChild(templatehrpercentage);

        templatelistitem.appendChild(templatelink)

      templatecontainer.appendChild(templatelistitem);
    })
  }

  const updateChart = () => {

    console.log('Updating charts...');

    // reset the chart
    draggablechart.destroy();

    // get the max time
    let starttime = 0;

    // get the recently added item's maxhr
    const hr = templateoptions[templateoptions.length-1].maxhr;

    if(chartdata.length === 1) {
      starttime = chartdata.reduce((acc, current)=> {
        return Math.max(acc, current.x)
      }, 0)
      chartdata[0].y = hr;
    }

    starttime = chartdata.reduce((acc, current)=> {
        return Math.max(acc, current.x)
      }, 0)

    const endtime = starttime + gettime(templateoptions[templateoptions.length-1].time);
    
    const firstdatainput = {x: starttime, y:hr}
    const seconddatainput = {x: endtime, y: hr};
    chartdata.push(firstdatainput, seconddatainput);

    draggablechart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Training Duration Splits by % of Max HR',
          data: chartdata,
          fill:true,
          stepped:true}
      ]
    },
    options: config
});

  }

  warmuptemplate.addEventListener('click', (ev)=>{ 
    
    const warmupdata = [{header: 'Warm-up', time:'0:20:00', minhr:'60', maxhr:'80', hrrange:'106-120', repeats:0}]
    console.log('insert warmup');

      warmupdata.forEach(data => {
        templateoptions.push(data);
      })
      updateChart();

    const injecthtml = async ()=> {
      templatecontainer.innerHTML = ''
      constructTemplate(templateoptions);
    ;}

    injecthtml().then((val)=> {
      const templatetime = [...document.getElementsByClassName('templatetime')];
      let newtime = 0;
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })
  })

  activetemplate.addEventListener('click', (ev)=>{

    const activedata = [{header: 'Active', time:'0:10:00', minhr:'89', maxhr:'98', hrrange:'157-172', repeats:0}]
    console.log('insert active');

      activedata.forEach( data => {
        templateoptions.push(data);
      })
      updateChart();

    const injecthtml = async ()=> {
      templatecontainer.innerHTML = ''
      constructTemplate(templateoptions);
    ;}

    injecthtml().then((val)=> {
      const templatetime = [...document.getElementsByClassName('templatetime')];
      let newtime = 0;
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  recoverytemplate.addEventListener('click', (ev)=>{


    const recoverydata = [{header: 'Recovery', time:'0:05:00', minhr:'50', maxhr:'60', hrrange:'88-106', repeats:0}]
    console.log('insert recovery');

      recoverydata.forEach( data => {
        templateoptions.push(data);
      })
      updateChart();

    const injecthtml = async ()=> {
      templatecontainer.innerHTML = ''
      constructTemplate(templateoptions);
    ;}

    injecthtml().then((val)=> {
      const templatetime = [...document.getElementsByClassName('templatetime')];
      let newtime = 0;
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })
  })

  cooldowntemplate.addEventListener('click', (ev)=>{

    const cooldowndata = [{header: 'Cool-down', time:'0:10:00', minhr:'40', maxhr:'50', hrrange:'70-88', repeats:0}]
    console.log('insert cooldown');

      cooldowndata.forEach( data => {
        templateoptions.push(data);
      })
      updateChart();

    const injecthtml = async ()=> {
      templatecontainer.innerHTML = ''
      constructTemplate(templateoptions);
    ;}

    injecthtml().then((val)=> {
      const templatetime = [...document.getElementsByClassName('templatetime')];
      let newtime = 0;
      for(let x=0; x<templatetime.length;x++){
        newtime += gettime(templatetime[x])
      }
      plannedtime.value = validateTime(toTimeStr(newtime));
      timetaken.innerText = plannedtime.value;
    })

  })

  twosteptemplate.addEventListener('click', (ev)=>{
    const injecthtml = async ()=> {
      templatecontainer.innerHTML +=
        `<fieldset>
            <div class='d-flex w-100 mb-1 justify-content-between'>
              <legend class="col-form-label">Repeat 4 times</legend>
            </div>
            
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
            </span>
          </a>
        </fieldset>`}
    
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
        `
          <fieldset>
            <div class='d-flex w-100 mb-1 justify-content-between'>
              <legend class="col-form-label">Repeat 3 times</legend>
            </div>
        
            <a href='#' class='list-group-item list-group-item-action'>
              <div class='d-flex w-100 mb-1 justify-content-between'>
                <h5 class='templateblockheader'>Hard</h5>
                <small class='templateremove'>Remove block</small>
              </div>
              <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
                <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
                <span class="col-1"><input type='text' class='templateminhr' value="75" style='border:none;font-size:2rem;width:50px'></span> 
                <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
                <span class="col-1"><input type='text' class='templatemaxhr' value="85" style='border:none;font-size:2rem;width:50px'></span>
                <span class="col-4"> 
                  <strong>% of Maximum Heart Rate</strong>
                  <p class='templatehr'>132-150bpm</p>
                </span>
              </span>
            </a>

            <a href='#' class='list-group-item list-group-item-action'>
              <div class='d-flex w-100 mb-1 justify-content-between'>
                <h5 class='templateblockheader'>Harder</h5>
                <small class='templateremove'>Remove block</small>
              </div>
              <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
                <span class="col-2"><input type='text' class='templatetime' value="0:01:00" style='border:none;font-size:2rem;width:100px'></span>
                <span class="col-1"><input type='text' class='templateminhr' value="90" style='border:none;font-size:2rem;width:50px'></span> 
                <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
                <span class="col-1"><input type='text' class='templatemaxhr' value="100" style='border:none;font-size:2rem;width:50px'></span>
                <span class="col-4"> 
                  <strong>% of Maximum Heart Rate</strong>
                  <p class='templatehr'>158-176bpm</p>
                </span>
              </span>
            </a>
          
            <a href='#' class='list-group-item list-group-item-action'>
              <div class='d-flex w-100 mb-1 justify-content-between'>
                <h5 class='templateblockheader'>Easy</h5>
                <small class='templateremove'>Remove block</small>
              </div>
              <span class='d-flex row w-100 mb-1" class='templateblockdetails'>
                <span class="col-2"><input type='text' class='templatetime' value="0:03:00" style='border:none;font-size:2rem;width:100px'></span>
                <span class="col-1"><input type='text' class='templateminhr' value="50" style='border:none;font-size:2rem;width:50px'></span> 
                <span class="col-1" style="font-size:2rem; text-align:center"><strong>-</strong></span> 
                <span class="col-1"><input type='text' class='templatemaxhr' value="60" style='border:none;font-size:2rem;width:50px'></span>
                <span class="col-4"> 
                  <strong>% of Maximum Heart Rate</strong>
                  <p class='templatehr'>88-106bpm</p>
                </span>
              </span>
            </a>
          </fieldset>`}
    
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
    
    const injecthtml = async ()=> {
      templatecontainer.innerHTML +=
        `<fieldset>
          <div class='d-flex w-100 mb-1 justify-content-between'>
            <legend class="col-form-label">Repeat 4 times<legend>
          </div>
        
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
            </span>
          </a>
        </fieldset>`
    ;}
    
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
    
    const injecthtml = async ()=> {
      templatecontainer.innerHTML +=
        `<fieldset>
          <div class='d-flex w-100 mb-1 justify-content-between'>
            <legend>Repeat 4 times</legend>
          </div>
        
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
            </span>
          </a>
        </fieldset>`  
          ;}
    
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

  activitylist.addEventListener('change', (e)=>{
    console.log('change')
    const value = e.target.value;
    switch (value) {
      case "Swimming":
        activitytype.innerHTML = `<i class="fas fa-swimmer" style="font-size: 3rem"></i>`
        break;

      case "Running":
        activitytype.innerHTML = `<i class="fas fa-running" style="font-size: 3rem"></i>`
        break;

      case "Cycling":
        activitytype.innerHTML = `<i class="fas fa-biking" style="font-size: 3rem"></i>`
        break;

      case "Gym":
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

const freezeFields = document.querySelectorAll('input')
const freezetextareas = document.querySelector('textarea')
const freezeSelect =document.querySelectorAll('select')

trainingfile.addEventListener('change', (ev)=> {
  filepath.innerText = ev.target.value;
  freezeFields.forEach((inputfield) => {
    inputfield.setAttribute('readonly', true)
    }
  )

  freezeSelect.forEach((selectfield) => {
    selectfield.setAttribute('disabled', true)
    }
  )
  freezetextareas.setAttribute('readonly',true)
  
})


})
