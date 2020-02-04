// import dictionary from '/static/html/components/component_modules/speech/dictionary.mjs'
// import change from "/static/html/components/component_modules/speech/change.mjs"
let object = {}
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['synth'] = window.speechSynthesis;
        object['inputForm'] =obj['this']['shadowRoot'].querySelector('form');
        object['inputTxt'] =  obj['this']['shadowRoot'].querySelector('.txt');
        object['voiceSelect'] = obj['this']['shadowRoot'].querySelector('select');
        object['pitch'] = obj['this']['shadowRoot'].querySelector('#pitch');
        object['pitchValue']= obj['this']['shadowRoot'].querySelector('.pitch-value');
        object['rate']= obj['this']['shadowRoot'].querySelector('#rate');
        object['rateValue']= obj['this']['shadowRoot'].querySelector('.rate-value');
        object['selectedOption'] = {}
        object['option'] = {}
        object['utterThis'] = {}
        object['aname'] = {}
        object['bname'] = {}
        object['voices'] = []
        object['selectedIndex'] = {}

        function populateVoiceList() {
            console.log('~~~~speechSynthesis~~~~', object['synth'].getVoices())
            object['voices'] =  object['synth'].getVoices().sort(function (a, b) {
                object['aname'] = a.name.toUpperCase(), object['bname'] = b.name.toUpperCase();
                if ( object['aname'] < object['bname'] ) return -1;
                else if ( object['aname'] == object['bname'] ) return 0;
                else return +1;
            });
            object['selectedIndex'] =  object['voiceSelect'].selectedIndex < 0 ? 0 : object['voiceSelect'].selectedIndex;
            object['voiceSelect'].innerHTML = '';
            for(let i = 0; i < object['voices'].length ; i++) {
                object['option'] = document.createElement('option');
                object['option'].textContent = object['voices'][i].name + ' (' + object['voices'][i].lang + ')';

                if(object['voices'][i].default) {
                    object['option'].textContent += ' -- DEFAULT';
                }

                object['option'].setAttribute('data-lang', object['voices'][i].lang);
                object['option'].setAttribute('data-name', object['voices'][i].name);
                object['voiceSelect'].appendChild(object['option']);
            }
            object['voiceSelect'].selectedIndex = object['selectedIndex'];
        }

        populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        function speak(){
            if (object['synth'].speaking) {
                console.error('speechSynthesis.speaking');
                return;
            }
            if (object['inputTxt'].value !== '') {
                object['utterThis'] = new SpeechSynthesisUtterance(object['inputTxt'].value);
                object['utterThis'].onend = function (event) {
                    console.log('SpeechSynthesisUtterance.onend');
                }
                object['utterThis'].onerror = function (event) {
                    console.error('SpeechSynthesisUtterance.onerror');
                }
                object['selectedOption'] = object['voiceSelect'].selectedOptions[0].getAttribute('data-name');
                for(let i = 0; i < object['voices'].length ; i++) {
                    if(object['voices'][i].name === object['selectedOption']) {
                        object['utterThis'].voice = object['voices'][i];
                        break;
                    }
                }
                object['utterThis'].pitch = object['pitch'].value;
                object['utterThis'].rate = object['rate'].value;
                object['synth'].speak(object['utterThis']);
            }
        }

        object['inputForm'].onsubmit = function(event) {
            event.preventDefault();
            speak();
            object['inputTxt'].blur();
        }

        object['pitch'].onchange = function() {
            object['pitchValue'].textContent =  object['pitch'].value;
        }

        object['rate'].onchange = function() {
            object['rateValue'].textContent =  object['rate'].value;
        }

        object['voiceSelect'].onchange = function(){
            speak();
        }


        object['class'] = class Speech {
            constructor(name) {


            }
            self() {
                return object
            }
        }
        resolve(object)
    })
}