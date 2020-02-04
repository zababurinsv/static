let radio = {}
radio['this'] = {}
radio['this']['audioSetup'] = {}
radio['func'] = {}

radio['func']['analyser'] = {}
radio['func']['updateWaveForm'] = {}
radio['func']['drawOscilloscope'] = {}

radio['func']['audioSetup'] = function (obj) {
  radio['this']['source'] = {}

  obj['this']['audioContext'] = new (window.AudioContext || window.webkitAudioContext)()
  obj['this']['masterGain'] = obj['this'].audioContext.createGain()
  obj['this'].masterGain.connect(obj['this'].audioContext.destination)

  for (var i = 0, max = obj['this'].radios_length; i < max; i++) {
    if (obj['this'].radios[i].checked === true) {
      obj['this'].source = obj['this'].radios[i].value
    }
  }

  obj['this'].song = new Audio(obj['this'].source)

  obj['this'].songSource = obj['this'].audioContext.createMediaElementSource(song)

  obj['this'].songPlaying = false

  obj['this'].song.crossOrigin = 'anonymous'
  obj['this'].songSource.connect(obj['this'].masterGain)

  for (var i = 0, max = obj['this'].radios_length; i < max; i++) {
    obj['this'].radios[i].addEventListener('change', function () {
      if (obj['this'].songPlaying) {
        obj['this'].song.pause()
        obj['this'].start_button.innerHTML = 'Start Audio'
        obj['this'].songPlaying = !obj['this'].songPlaying
      }

      // Without these lines the oscilloscope won't update
      // when a new selection is made via radio inputs
      obj['this'].song = new Audio(obj['this'].value)
      obj['this'].songSource = obj['this'].audioContext.createMediaElementSource(obj['this'].song),
      obj['this'].song.crossOrigin = 'anonymous'
      obj['this'].songSource.connect(obj['this'].masterGain)
    })
  }

  obj['this'].start_button.addEventListener('click', function () {
    if (obj['this'].songPlaying) {
      obj['this'].song.pause()
      obj['this'].start_button.innerHTML = 'Start Audio'
    } else {
      obj['this'].song.play()
      obj['func'].drawOscilloscope()
      obj['func'].updateWaveForm()
      obj['this'].start_button.innerHTML = 'Stop Audio'
    }

    obj['this'].songPlaying = !obj['this'].songPlaying
  })
}

radio['func']['updateWaveForm'] = function (obj) {
  obj['func'].requestAnimationFrame(obj['this'].updateWaveForm)
  obj['this'].analyser.getFloatTimeDomainData(obj['this'].waveform)
}

radio['func'].drawOscilloscope = function (obj) {
  obj['func'].requestAnimationFrame(obj['func'].drawOscilloscope)

  obj['this'].scopeCanvas = obj['this'].getElementById('oscilloscope')
  obj['this'].scopeContext = obj['this'].scopeCanvas.getContext('2d')

  obj['this'].scopeCanvas.width = obj['this'].waveform.length
  obj['this'].scopeCanvas.height = 200

  obj['this'].scopeContext.clearRect(0, 0, obj['this'].scopeCanvas.width, obj['this'].scopeCanvas.height)
  obj['this'].scopeContext.beginPath()

  for (let i = 0; i < obj['this'].waveform.length; i++) {
    const x = i
    const y = (0.5 + (obj['this'].waveform[i] / 2)) * obj['this'].scopeCanvas.height

    if (i === 0) {
      obj['this'].scopeContext.moveTo(x, y)
    } else {
      obj['this'].scopeContext.lineTo(x, y)
    }
  }

  obj['this'].scopeContext.strokeStyle = '#5661FA'
  obj['this'].scopeContext.lineWidth = 2
  obj['this'].scopeContext.stroke()
}

async function init (obj) {
  console.log(`a{['radio'])init-${obj}`, obj)
  radio['this']['start_button'] = obj['this'].querySelector('#start')
  radio['this']['radios'] = obj['this'].querySelectorAll('input[name="radio-selection"]')
  radio['this']['radios_length'] = radio['this']['radios'].length
  radio['this']['analyser'] = radio['this']['audioContext'].createAnalyser()
  radio['this']['masterGain'].connect(radio['this']['analyser'])
  radio['this']['waveform'] = new Float32Array(radio['this']['analyser'].frequencyBinCount)
  radio['this']['analyser'].getFloatTimeDomainData(radio['this']['waveform'])
  radio['func'].audioSetup()

  return radio
}

export default {
  init: obj => { return init(obj) }
}
