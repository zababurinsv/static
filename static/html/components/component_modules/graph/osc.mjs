let object = {}

object['component'] = {}
object['element'] = (obj)=>{
    object['dom'] = {}
    object['dom']['visualizer'] = {}
    object['dom']['control'] = {}
    object['dom']['playBtnEl'] = obj['this']['shadowRoot'].getElementById('playButton');
    object['dom']['playEl'] = obj['this']['shadowRoot'].querySelector('.svg-audio-btn__play');
    object['dom']['pauseEl'] = obj['this']['shadowRoot'].querySelector('.svg-audio-btn__pauseGrp');
    object['dom']['visualizer']['this'] = obj['this']['shadowRoot'].querySelector('#visualizer');
    object['dom']['visualizer']['vCtx'] = object['dom']['visualizer']['this'].getContext('2d');
    object['dom']['control']['waveCtrl1El'] = obj['this']['shadowRoot'].getElementById('wave1Control');
    object['dom']['volumeControl'] = obj['this']['shadowRoot'].getElementById('volumeControl');

    return obj
}
object['ToggleButton'] = class ToggleButton {

    constructor(options = {}) {
        this.on = options.on || "⏸";
        this.off = options.off || "▶️";
        options.startOn ?
            this.current = "on" :
            this.current = "off";
    }
    toggle() {
        this.current === "on" ?
            this.current = "off" :
            this.current = "on";
        return this[this.current];
    }}
object['AudioPlayer'] = {}

object['AudioPlayer']['class'] = class AudioPlayer  {
    /**
     * @param {Object} opts - (required)
     * @param {Object} opts.ctx - (required) The AudioContext Object
     * @param {number} [opts.volume=0.5] - the overall volume
     * @param {number} [opts.f1=130.81] - the frequency of wave 1
     * @param {number} [opts.f2=164.81] - the frequency of wave 2
     * @param {number} [opts.f3=196.00] - the frequency of wave 3
     * @returns {Object.<AudioPlayer>}
     */
    constructor(opts) {
        // AudioContext
        this.ctx = opts.ctx;

        // Effects Nodes
        this.gainNode1 = this.ctx.createGain();
        // this.gainNode2 = this.ctx.createGain();
        // this.gainNode3 = this.ctx.createGain();
        this.f1Analyzer = this.ctx.createAnalyser({
            fftSize: 256 });

        // this.f2Analyzer = this.ctx.createAnalyser({
        //     fftSize: 256 });
        // this.f3Analyzer = this.ctx.createAnalyser({
        //     fftSize: 256 });

        opts.f1 = 130.81
        // member Variables
        this.mF1 = opts.f1 || 130.81;
        // this.mF2 = opts.f2 || 164.81;
        // this.mF3 = opts.f3 || 196.00;
        this.mPlaying = false;
        this.mVolume = opts.volume || 0.5;
        this.mVolume = 0.33 * this.mVolume; // adjust for 3 gains

        // set the Gain
        this.gainNode1.gain.value = this.mVolume;
        // this.gainNode2.gain.value = this.mVolume;
        // this.gainNode3.gain.value = this.mVolume;

        // Connect the Graph of Nodes in the Ctx
        this.gainNode1.connect(this.ctx.destination);
        // this.gainNode2.connect(this.ctx.destination);
        // this.gainNode3.connect(this.ctx.destination);

        // allow chaining
        return this;
    }

    // PRIVATE Helper Methods

    /**
     * Creates and starts Oscillators. Must be re-created each
     * time as they do not have a 'paused' state
     * @private
     * @returns {undefined}
     */
    _startOscillators() {
        console.log('starting oscillators');
        this.oscNode1 = this.ctx.createOscillator();
        this.oscNode1.type = 'sine';
        this.oscNode1.frequency.value = this.mF1;
        this.oscNode1.connect(this.gainNode1);
        this.oscNode1.connect(this.f1Analyzer);

        // this.oscNode2 = this.ctx.createOscillator();
        // this.oscNode2.type = 'sine';
        // this.oscNode2.frequency.value = this.mF2;
        // this.oscNode2.connect(this.gainNode2);
        // this.oscNode2.connect(this.f2Analyzer);

        // this.oscNode3 = this.ctx.createOscillator();
        // this.oscNode3.type = 'sine';
        // this.oscNode3.frequency.value = this.mF3;
        // this.oscNode3.connect(this.gainNode3);
        // this.oscNode3.connect(this.f3Analyzer);

        this.oscNode1.start();
        // this.oscNode2.start();
        // this.oscNode3.start();

        this.mPlaying = true;
    }

    /**
     * Stops Oscillators
     * @private
     * @returns {undefined}
     */
    _stopOscillators() {
        console.log('stopping oscillators');
        this.oscNode1.stop();
        // this.oscNode2.stop();
        // this.oscNode3.stop();
        this.mPlaying = false;
    }

    // Public Methods

    /**
     * Adjusts the overall volume
     * @param {number} volume - between (0.0, 1.0)
     * @returns {undefined}
     */
    changeGain(volume) {
        this.mVolume = 0.33 * volume;
        this.gainNode1.gain.value = this.mVolume;
        // this.gainNode2.gain.value = this.mVolume;
        // this.gainNode3.gain.value = this.mVolume;
    }

    /**
     * Adjusts the value of a frequency.
     * @param {number} f - (1, 3). The frequency to change.
     * @param {number} df - the amount to change the frequency
     * @returns {undefined}
     */
    changeFrequency(f, dF) {
        switch (f) {
            case 1:
                this.oscNode1.frequency.value = this.mF1 + dF;
                break;
            // case 2:
            //     this.oscNode2.frequency.value = this.mF2 + dF;
            //     break;
            // case 3:
            //     this.oscNode3.frequency.value = this.mF3 + dF;
            //     break;
            default:break;}

    }

    /**
     * Returns 1/2 the FFT value for a given source. Represents the number of
     * data values for visualization in the frequency domain.
     * Use to assign the length of an unsigned 8-bit array (ie: Uint8Array [binCount])
     * @param {number} f - The frequency (1, 3) to obtain the bin count
     * @returns {number}
     */
    getAnalyzerBinCount(f) {
        switch (f) {
            case 1:return this.f1Analyzer.frequencyBinCount;
            // case 2:return this.f2Analyzer.frequencyBinCount;
            // case 3:return this.f3Analyzer.frequencyBinCount;
            default:return 0;}

    }

    /**
     * Returns the fftSize which is an unsigned long value
     * and represents the window size in samples that is used
     * when performing a Fast Fourier Transform.
     * @param {number} f - The frequency (1, 3) for which to get
     * the FFT size.
     * @returns {number} - an unsigned long
     */
    getAnalyzerFFTSize(f) {
        switch (f) {
            case 1:return this.f1Analyzer.fftSize;
            // case 2:return this.f2Analyzer.fftSize;
            // case 3:return this.f3Analyzer.fftSize;
            default:return 0;}

    }

    /**
     * Copies the current time domain data into the
     * provided array. Must be of type Uint8Array.
     * @param {number} f - The frequency (1, 3) to get the time btyes
     * @param {Uint8Array} dataArray
     * @returns {undefined}
     */
    getAnalyzerTimeBytes(f, dataArray) {
        switch (f) {
            case 1:this.f1Analyzer.getByteTimeDomainData(dataArray);
                break;
            // case 2:this.f2Analyzer.getByteTimeDomainData(dataArray);
            //     break;
            // case 3:this.f3Analyzer.getByteTimeDomainData(dataArray);
            //     break;
            default:break;}

    }

    /**
     * Starts or stops the audio player.
     * @returns {undefined}
     */
    togglePlay() {
        this.mPlaying ?
            this._stopOscillators() :
            this._startOscillators();
    }}


object['component']['left'] = (obj)=>{
    return `  
    <div class="panel">
                <button>line</button>
                <button>hilbert</button>
                <button>IO</button>
    </div>
`
}
object['component']['right'] = (obj)=>{
    return `  
    <div class="panel">
                <button>video settings</button>
                <button>audio setting</button>
                <button>exit</button>
    </div>
`
}

object['component']['busUp']= (obj)=>{
    return `  
        <progress value="52" max="100"></progress>
         <div class="bus">
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>6</button>
                <button>7</button>
                <button>8</button>
        </div>
        <progress value="2" max="100"></progress>
`
}

object['component']['busDown']= (obj)=>{
    return `  
        <progress value="32" max="100"></progress>
        <div class="bus">
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>6</button>
                <button>7</button>
                <button>8</button>
        </div>
        <progress value="12" max="100"></progress>
`
}

object['component']['head'] = (obj)=>{
    return `  
            <div class="name">
                <h1>${obj['name']}</h1>
            </div>
`
}


object['component']['graph'] = (obj)=>{
    return `
         <canvas id="visualizer" />
`
}

object['component']['synth'] = (obj)=>{
    return `
    <svg
        id="playButton"
        height="200"
        width="200"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg">
        <!-- .svg-audio-btn main group -->
        <g class="svg-audio-btn">
            <!-- bg -->
            <circle
                cx="50%"
                cy="50%"
                r="47.5%"
                fill="transparent"
                stroke-width="5%"/>
            <!-- play triangle -->
            <path
                class="svg-audio-btn__play"
                d="M 80 50
                 L 80 150
                 L 133.33 100"/>
            <!-- pause group -->
            <g class="svg-audio-btn__pauseGrp hidden">
                <rect
                    class="svg-audio-btn__pause"
                    height="50%"
                    width="5%"
                    x="40%"
                    y="25%"/>
                <rect
                    class="svg-audio-btn__pause"
                    height="50%"
                    width="5%"
                    x="55%"
                    y="25%"/>
            </g>
        </g>
    </svg>
`
}

object['component']['freqOsc'] = (obj)=>{
    return`
           <div class="s12">
                    <input
                            data-f="3"
                            id="wave3Control"
                            name="wave3Control"
                            type="range"
                            min="-100.0"
                            max="100.0"
                            step="0.1"
                            value="0.0"/>
                </div>
    `
}
/*
<div class="s12">
    <input
        data-f="2"
        id="wave2Control"
        name="wave2Control"
        type="range"
        min="-100.0"
        max="100.0"
        step="0.1"
        value="0.0"/>
</div>
<div class="s12">
    <input
data-f="3"
id="wave3Control"
name="wave3Control"
type="range"
min="-100.0"
max="100.0"
step="0.1"
value="0.0"/>
    </div>
 */
object['component']['control'] = (obj)=>{
    return `
                <div class="waveControl">
                    <input
                            data-f="1"
                            id="wave1Control"
                            name="wave1Control"
                            type="range"
                            min="-100.0"
                            max="100.0"
                            step="0.1"
                            value="0.0"/>
                </div>
                <div class="globalControl">
                     <input
                            id="volumeControl"
                            name="volumeControl"
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.1"
                            value="0.5"/>
                </div>
`
}
object['AudioPlayer']['ctx'] = new (window.AudioContext || window.webkitAudioContext)();
object['AudioPlayer']['playBtnStates'] = new object['ToggleButton']({
    on: 'pause',
    off: 'play' });
object['AudioPlayer']['dF'] = 0.0; // inital delta frequency
object['AudioPlayer']['volume'] = 0.5; // initial Volume -> (0.0, 1.0)
object['AudioPlayer']['opts'] = {
    ctx: object['AudioPlayer']['ctx'],
    volume: object['AudioPlayer']['volume'],
    f1: {}
}
object['AudioPlayer']['player'] = new object['AudioPlayer']['class'](object['AudioPlayer']['opts']);
object['AudioPlayer']['data'] = {}

object['AudioPlayer']['drawBoard'] = () =>{
    for (let x = 0; x <= bw; x += 40) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }


    for (let x = 0; x <= bh; x += 40) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "black";
    context.stroke();
}


object['draw'] = () => {
    let WIDTH =  object['dom']['visualizer']['this'].width;
    let HEIGHT =  object['dom']['visualizer']['this'].height;

    // loop this
    window.requestAnimationFrame(object['draw']);

    // get the current Data (gets placed into array arg)
    object['AudioPlayer']['player'].getAnalyzerTimeBytes(1,  object['AudioPlayer']['data']['f1visualData']);
    // player.getAnalyzerTimeBytes(2, f2visualData);
    // player.getAnalyzerTimeBytes(3, f3visualData);

    // set the canvas style
    // object['dom']['visualizer']['vCtx'].fillStyle = '#EEE';
    object['dom']['visualizer']['vCtx'].fillStyle = 'transparent'
    object['dom']['visualizer']['vCtx'].fillRect(0, 0, WIDTH, HEIGHT);
    object['dom']['visualizer']['vCtx'].lineWidth = 2;

    // now that we have the current Data for each wave, loop
    // through each and draw each point value

    drawWave(object['AudioPlayer']['player'].getAnalyzerFFTSize(1), '#26a69a', object['AudioPlayer']['data']['f1visualData']);
    // drawWave(player.getAnalyzerFFTSize(2), '#ec407a', f2visualData);
    // drawWave(player.getAnalyzerFFTSize(3), '#29b6f6', f3visualData);

    function drawWave(bufferLength, color, dataArray) {
        // draw the path - loop through
        // the Uint8Array and draw each pt
        object['dom']['visualizer']['vCtx'].clearRect(0, 0, WIDTH,HEIGHT)
        object['dom']['visualizer']['vCtx'].beginPath();
        object['dom']['visualizer']['vCtx'].strokeStyle = color;

        // space between each point
        let sliceWidth = WIDTH * 0.75 / bufferLength;

        // x position to draw current pt
        // incremented by sliceWidth
        let x = 0;

        dataArray.forEach(soundVal => {
            // (0, 255) / 256.0 -> (0.0, 1.0]
            let y = dataArray[soundVal] / 256.0 * HEIGHT;

            // on first value, go to beginning
            soundVal === 0 ?
                object['dom']['visualizer']['vCtx'].moveTo(x, y) :
                object['dom']['visualizer']['vCtx'].lineTo(x, y);

            x += sliceWidth;
        });

        object['dom']['visualizer']['vCtx'].lineTo(WIDTH, HEIGHT / 2);
        object['dom']['visualizer']['vCtx'].stroke();
    }
}
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['class'] = class App {
            constructor(self) {

                self['this']['shadowRoot'].querySelector('#player').insertAdjacentHTML('afterbegin',object['component']['synth']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#left').insertAdjacentHTML('afterbegin',object['component']['left']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#manifest').insertAdjacentHTML('afterbegin', object['component']['head']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#busUp').insertAdjacentHTML('afterbegin', object['component']['busUp']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#graph').insertAdjacentHTML('afterbegin', object['component']['graph']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#control').insertAdjacentHTML('afterbegin', object['component']['control']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#busDown').insertAdjacentHTML('afterbegin', object['component']['busDown']({name:'Rington'}))
                self['this']['shadowRoot'].querySelector('#right').insertAdjacentHTML('afterbegin',object['component']['right']({name:'Rington'}))
                object['element'](self)
                this.init = this.init.bind(this)

            }

            init (obj){
                object['AudioPlayer']['data']['f1visualData'] = new Uint8Array(object['AudioPlayer']['player'] .getAnalyzerFFTSize(1));

                object['dom']['control']['waveCtrl1El'].value = object['AudioPlayer']['dF'];
                object['dom']['volumeControl'].value = object['AudioPlayer']['volume'];

                if (object['AudioPlayer']['ctx'].state === 'suspended' && 'ontouchstart' in window) {
                    const unlock = _ => {
                        object['AudioPlayer']['ctx'].resume();
                    };
                    document.body.addEventListener('touchstart', unlock, false);
                    document.body.addEventListener('touchend', unlock, false);
                }

                // Play Button click handler
                object['dom']['playBtnEl'].addEventListener('click', function () {
                    // console.assert(false)
                    if (object['AudioPlayer']['playBtnStates'].toggle() === 'pause') {// play was pressed
                        // reset each frequency
                        object['dom']['control']['waveCtrl1El'].value = object['AudioPlayer']['dF'];
                        // obj['dom']['control']['waveCtrl2El'].value = dF;
                        // obj['dom']['control']['waveCtrl3El'] .value = dF;
                        object['dom']['volumeControl'].value = object['AudioPlayer']['volume']; // reset vol knob
                        object['dom']['playEl'].classList.add('hidden');
                        object['dom']['pauseEl'].classList.remove('hidden');
                    } else {// pause was pressed
                        // reset each frequency
                        object['dom']['control']['waveCtrl1El'].value = object['AudioPlayer']['dF'];
                        // obj['dom']['control']['waveCtrl2El'].value = dF;
                        // obj['dom']['control']['waveCtrl3El'].value = dF;
                        // console.assert(false, object['dom'])
                        object['dom']['volumeControl'].value = object['AudioPlayer']['volume']; // reset vol knob
                        object['dom']['playEl'].classList.remove('hidden');
                        object['dom']['pauseEl'].classList.add('hidden');
                    }

                    object['AudioPlayer']['player'].togglePlay();
                })


                ;[
                    object['dom']['control']['waveCtrl1El'],
                    object['dom']['control']['waveCtrl2El'],
                    object['dom']['control']['waveCtrl3El']].
                forEach(ctrl => {
                    if(ctrl === undefined){

                    }else{
                        ctrl.addEventListener('input', function (e) {
                            if (object['AudioPlayer']['playBtnStates'].current === 'on') {
                                object['AudioPlayer']['player'].changeFrequency(
                                    Number(this.dataset.f), // attr data-f -> (1, 3)
                                    Number(this.value));

                            }
                        });
                    }
                });

                object['dom']['volumeControl'].addEventListener('input', function (e) {
                    if (object['AudioPlayer']['playBtnStates'].current === 'on') {
                        object['AudioPlayer']['player'].changeGain(Number(this.value));
                    }
                });

                object['draw']()
            }

            get self() {
                return object
            }
        }
        resolve(object)
    })
}