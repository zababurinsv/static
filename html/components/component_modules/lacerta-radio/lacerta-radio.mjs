let radio={};async function init(t){return console.log(`a{['radio'])init-${t}`,t),radio.this.start_button=t.this.querySelector("#start"),radio.this.radios=t.this.querySelectorAll('input[name="radio-selection"]'),radio.this.radios_length=radio.this.radios.length,radio.this.analyser=radio.this.audioContext.createAnalyser(),radio.this.masterGain.connect(radio.this.analyser),radio.this.waveform=new Float32Array(radio.this.analyser.frequencyBinCount),radio.this.analyser.getFloatTimeDomainData(radio.this.waveform),radio.func.audioSetup(),radio}radio.this={},radio.this.audioSetup={},radio.func={},radio.func.analyser={},radio.func.updateWaveForm={},radio.func.drawOscilloscope={},radio.func.audioSetup=function(t){radio.this.source={},t.this.audioContext=new(window.AudioContext||window.webkitAudioContext),t.this.masterGain=t.this.audioContext.createGain(),t.this.masterGain.connect(t.this.audioContext.destination);for(var i=0,o=t.this.radios_length;i<o;i++)!0===t.this.radios[i].checked&&(t.this.source=t.this.radios[i].value);t.this.song=new Audio(t.this.source),t.this.songSource=t.this.audioContext.createMediaElementSource(song),t.this.songPlaying=!1,t.this.song.crossOrigin="anonymous",t.this.songSource.connect(t.this.masterGain);for(i=0,o=t.this.radios_length;i<o;i++)t.this.radios[i].addEventListener("change",function(){t.this.songPlaying&&(t.this.song.pause(),t.this.start_button.innerHTML="Start Audio",t.this.songPlaying=!t.this.songPlaying),t.this.song=new Audio(t.this.value),t.this.songSource=t.this.audioContext.createMediaElementSource(t.this.song),t.this.song.crossOrigin="anonymous",t.this.songSource.connect(t.this.masterGain)});t.this.start_button.addEventListener("click",function(){t.this.songPlaying?(t.this.song.pause(),t.this.start_button.innerHTML="Start Audio"):(t.this.song.play(),t.func.drawOscilloscope(),t.func.updateWaveForm(),t.this.start_button.innerHTML="Stop Audio"),t.this.songPlaying=!t.this.songPlaying})},radio.func.updateWaveForm=function(t){t.func.requestAnimationFrame(t.this.updateWaveForm),t.this.analyser.getFloatTimeDomainData(t.this.waveform)},radio.func.drawOscilloscope=function(t){t.func.requestAnimationFrame(t.func.drawOscilloscope),t.this.scopeCanvas=t.this.getElementById("oscilloscope"),t.this.scopeContext=t.this.scopeCanvas.getContext("2d"),t.this.scopeCanvas.width=t.this.waveform.length,t.this.scopeCanvas.height=200,t.this.scopeContext.clearRect(0,0,t.this.scopeCanvas.width,t.this.scopeCanvas.height),t.this.scopeContext.beginPath();for(let i=0;i<t.this.waveform.length;i++){const o=i,s=(.5+t.this.waveform[i]/2)*t.this.scopeCanvas.height;0===i?t.this.scopeContext.moveTo(o,s):t.this.scopeContext.lineTo(o,s)}t.this.scopeContext.strokeStyle="#5661FA",t.this.scopeContext.lineWidth=2,t.this.scopeContext.stroke()};export default{init:t=>init(t)};