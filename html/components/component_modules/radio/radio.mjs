let object = {}
object['this'] = {}
object['this']['source'] ={}
object['func'] = {}
object['func']['analyser'] = {}
object['func']['drawOscilloscope'] = {}
object['func']['updateWaveForm'] = (obj) => {

    window.requestAnimationFrame(object['func']['updateWaveForm']);
    object['this'].analyser.getFloatTimeDomainData(object['this'].waveform)
}

object['func'].drawOscilloscope = (obj) => {
    object['this'].scopeContext = object['this'].scopeCanvas.getContext('2d')
    object['this'].scopeCanvas.width = object['this'].waveform.length
    object['this'].scopeCanvas.height = 200
    object['this'].scopeContext.clearRect(0, 0, object['this'].scopeCanvas.width, object['this'].scopeCanvas.height)
    object['this'].scopeContext.beginPath()

    for (let i = 0; i < object['this'].waveform.length; i++) {
        const x = i
        const y = (0.5 + (object['this'].waveform[i] / 2)) * object['this'].scopeCanvas.height

        if (i === 0) {
            object['this'].scopeContext.moveTo(x, y)
        } else {
            object['this'].scopeContext.lineTo(x, y)
        }
    }

    object['this'].scopeContext.strokeStyle = '#5661FA'
    object['this'].scopeContext.lineWidth = 2
    object['this'].scopeContext.stroke()
    window.requestAnimationFrame(object['func'].drawOscilloscope)
}

function fetchVideoAndPlay() {
   return  fetch('http://ice1.somafm.com/seventies-128-aac')
        .then(response => response.blob())
        .then(blob => {
            video.srcObject = blob;
            return video.play();
        })
        .then(_ => {
            // Video playback started ;)
        })
        .catch(e => {
            // Video playback failed ;(
        })
}
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['class'] = class Radio {
            constructor(self) {

                object['this']['scopeCanvas'] =self['this']['shadowRoot'].querySelector('#oscilloscope')
                object['this']['start_button'] = self['this']['shadowRoot'].querySelector('#start')
                object['this']['radios'] = self['this']['shadowRoot'].querySelectorAll('input[name="radio-selection"]')
                object['this']['radios_length'] = object['this']['radios'].length
                object['this']['ctx'] =  new (window.AudioContext || window.webkitAudioContext)();
                object['this']['analyser'] =  object['this']['ctx'].createAnalyser()
                object['this']['waveform'] = new Float32Array(object['this']['analyser'].frequencyBinCount)
                object['this']['analyser'].getFloatTimeDomainData(object['this']['waveform'])
                object['this']['masterGain'] = object['this']['ctx'].createGain()
                object['this']['masterGain'].connect(object['this']['ctx'].destination)
                object['this']['masterGain'].connect(object['this']['analyser'])

                for (let i = 0, max = object['this']['radios_length']; i < max; i++) {
                    if (object['this']['radios'][i].checked === true) {
                        object['this']['source'] = object['this']['radios'][i].value
                    }
                }

                object['this']['song'] = new Audio(object['this']['source'])
                object['this']['songSource'] =  object['this']['ctx'].createMediaElementSource(object['this']['song'])
                object['this']['songPlaying'] = false
                object['this']['song']['crossOrigin'] = 'anonymous'
                object['this']['songSource'].connect(object['this']['masterGain'])

                for (let i = 0, max = object['this']['radios_length']; i < max; i++) {
                    object['this']['radios'][i].addEventListener('change', function () {
                        if (object['this']['songPlaying']) {
                            object['this']['song'].pause()
                            object['this']['start_button'].innerHTML = 'Start Audio'
                            object['this']['songPlaying']  = !object['this']['songPlaying']
                        }
                        object['this']['song']= new Audio(object['this']['source'].value)
                        object['this']['songSource'] =  object['this']['ctx'].createMediaElementSource(object['this']['song']),
                            object['this']['song'].crossOrigin = 'anonymous'
                        object['this']['songSource'].connect(object['this']['masterGain'])
                    })
                }


                object['this']['start_button'].addEventListener('click', async () => {
                    // console.assert(false, object['this']['songPlaying'])
                    if (object['this']['songPlaying']) {
                      await  object['this']['song'].pause()
                        object['this']['start_button'].innerHTML = 'Start Audio'
                    } else {
                        console.log('<<~~~~~~~~~~~~~~~~~>>')
                        // await fetchVideoAndPlay()

                        object['func']['drawOscilloscope'](object)
                        object['func']['updateWaveForm'](object)
                        object['this']['start_button'].innerHTML = 'Stop Audio'
                        await object['this']['song'].play()

                    }
                    object['this']['songPlaying'] = !object['this']['songPlaying']
                })
            }
            get self() {
                return object
            }
        }
        resolve(object)
    })
}