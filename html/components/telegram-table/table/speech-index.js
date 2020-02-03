import webSpeech from '/js/module/webSpeech.js'
let tmpl = document.createElement('template');
tmpl.innerHTML = `
<style>@import '/js/module/speech-index.css';</style>
<section id="speech">
   <h1 class="center" id="headline">
<!--     <a href="http://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html">Web Speech</a></h1>-->
   <div id="info">
     <p id="info_start">Click on the microphone icon and begin speaking.</p>
     <p id="info_speak_now">Speak now.</p>
     <p id="info_no_speech">No speech was detected. You may need to adjust your
       <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">
         microphone settings</a>.</p>
     <p id="info_no_microphone" style="display:none">
       No microphone was found. Ensure that a microphone is installed and that
       <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">
       microphone settings</a> are configured correctly.</p>
     <p id="info_allow">Click the "Allow" button above to enable your microphone.</p>
     <p id="info_denied">Permission to use microphone was denied.</p>
     <p id="info_blocked">Permission to use microphone is blocked. To change,
       go to chrome://settings/contentExceptions#media-stream</p>
     <p id="info_upgrade">Web Speech API is not supported by this browser.
        Upgrade to <a href="//www.google.com/chrome">Chrome</a>
        version 25 or later.</p>
   </div>
   <div class="right">
     <button id="start_button">
       <img id="start_img" src="/static/html/components/telegram-speech/images/mic.gif" alt="Start"></button>
   </div>
   <div id="results">
     <span id="final_span" class="final"></span>
     <span id="interim_span" class="interim"></span>
     <p>
   </div>
   <div class="center">
     <div class="sidebyside" style="text-align:right">
       <button id="copy_button" class="button">
         Copy and Paste</button>
       <div id="copy_info" class="info">
         Press Control-C to copy text.<br>(Command-C on Mac.)
       </div>
     </div>
     <div class="sidebyside">
       <button id="email_button" class="button">Create Email</button>
       <div id="email_info" class="info">
         Text sent to default email application.<br>
         (See chrome://settings/handlers to change.)
       </div>
     </div>
     <div id="div_language">
       <select id="select_language"></select>
       &nbsp;&nbsp;
       <select id="select_dialect"></select>
     </div>
   </div>
</section>
`

class speech extends HTMLElement {
    constructor() {
        super();
        // console.assert(false)
        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
//         this.querySelector('tbody').insertAdjacentHTML('beforeend', upload)

    }
    connectedCallback() {
    let self = this;
       (async ()=>{
          await webSpeech['get']({type:'speech', this:this, language: this.shadowRoot.querySelector('#select_language'), dialect:this.shadowRoot.querySelector('#select_dialect') })

       })()
    }
    disconnectedCallback() {}
    componentWillMount() {}
    componentDidMount() {}
    componentWillUnmount() {}
    componentDidUnmount() {}
}
window.customElements.define('speech-index', speech);
