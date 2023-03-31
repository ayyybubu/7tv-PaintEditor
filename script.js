const stopsContainer = document.getElementById('stops');
const addStopBtn = document.getElementById('add-stop-btn');
const angleInput = document.getElementById('angle-input');
const linearGradientRadio = document.getElementById('linear-gradient-radio');
const radialGradientRadio = document.getElementById('radial-gradient-radio');
const textInput = document.getElementById("text-input");
const text = document.getElementById("text");
const repeatGradientCheckbox = document.getElementById('repeat-checkbox');
const gradientInfo = document.getElementById('gradient-info');

textInput.oninput = function() {
  text.textContent = textInput.value;
};

let angle = 90;
let stops = [
  { position: 0, color: '#00ccff' },
  { position: 100, color: '#ee00ff' }
];

function renderStops() {
  stopsContainer.innerHTML = '';
  stops.forEach((stop, index) => {
    const div = document.createElement('div');
    div.classList.add('stop');
    div.innerHTML = `
      <div class="color-picker">
      <div class="color-picker-box">
        <input type="color" value="${stop.color}" data-index="${index}">
        <input type="text" value="${stop.color}" data-index="${index}">
        </div>
        <button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>
      </div>
      <input type="range" min="0" max="100" value="${stop.position}" data-index="${index}">
      <input type="text" value="${stop.position}" data-index="${index}">

    `;
    stopsContainer.appendChild(div);
  });
}

function updateGradient() {
  const gradientStops = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
  const gradientBox = document.querySelector('.gradient-box');
  const sampleText = document.querySelector('.text');
  const isRepeating = repeatGradientCheckbox.checked;
  const gradientType = linearGradientRadio.checked ? 'linear-gradient' : 'radial-gradient';
  let gradientStr = '';
  
  if (isRepeating) {
    if (linearGradientRadio.checked) {
      gradientStr = `repeating-linear-gradient(${angle}deg, ${gradientStops})`;
    } else {
      gradientStr = `repeating-radial-gradient(circle, ${gradientStops})`;
    }
  } else {
    if (linearGradientRadio.checked) {
      gradientStr = `linear-gradient(${angle}deg, ${gradientStops})`;
    } else {
      gradientStr = `radial-gradient(circle, ${gradientStops})`;
    }
  }
  
  gradientBox.style.background = gradientStr;
  sampleText.style.background = gradientStr;
  sampleText.style["-webkit-background-clip"] = "text";
  
  let gradientInfoStr = `Stops:\n`;
  stops.forEach(stop => {
    gradientInfoStr += `${stop.color} ${stop.position}%\n`;
  });
  gradientInfoStr += `Gradient Type: ${gradientType}\n`;
  gradientInfoStr += `Angle: ${angle}deg\n`;
  gradientInfoStr += `Repeating: ${isRepeating}`;
  
  gradientInfo.textContent = gradientInfoStr;
}


function addStop() {
  stops.push({ position: 50, color: '#ffffff' });
  renderStops();
  updateGradient();
}

function deleteStop(index) {
  stops.splice(index, 1);
  renderStops();
  updateGradient();
}

function handleColorChange(event) {
  const index = event.target.dataset.index;
  const value = event.target.value;
  stops[index].color = value;
  renderStops();
  updateGradient();
}
function handlePositionChange(event) {
  const index = event.target.dataset.index;
  const value = parseInt(event.target.value);
  stops[index].position = value;
  renderStops();
  updateGradient();
}

function handleAngleChange() {
  angle = parseInt(angleInput.value);
  updateGradient();
}

linearGradientRadio.addEventListener('change', updateGradient);
radialGradientRadio.addEventListener('change', updateGradient);
repeatGradientCheckbox.addEventListener('change', updateGradient);

addStopBtn.addEventListener('click', addStop);

stopsContainer.addEventListener('change', event => {
  const target = event.target;
  if (target.matches('input[type="color"]')) {
    handleColorChange(event);
  } else {
    handlePositionChange(event);
  }
});

stopsContainer.addEventListener('click', event => {
  const target = event.target;
  if (target.matches('.delete-btn')) {
    const index = target.dataset.index;
    deleteStop(index);
  }
});

angleInput.addEventListener('input', handleAngleChange);


renderStops();
updateGradient();
