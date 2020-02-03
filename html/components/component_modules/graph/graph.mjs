/**
 * Web Audio API Example with Material Design
 *
 * Written By Vapurrmaid aka Grey B. You may use the code herein so long
 * as you reference me/give credit.
 *
 * email - vapurrmaid@gmail.com
 * github - https://github.com/vapurrmaid
 * blog - https://medium.com/@vapurrmaid
 *
 * Heavily based off of the MDN documentation examples.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Controlling_multiple_parameters_with_ConstantSourceNode
 *
 * Demo/Example from MDN docs:
 * https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js
 */

/**
 * Class representing an audio player with volume
 * control. A constant cord is emitted.
 *
 * Written by Vapurrmaid aka Grey B
 *
 * https://github.com/vapurrmaid
 * https://medium.com/@vapurrmaid
 *
 * vapurrmaid@gmail.com
 */
class AudioPlayer {
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


        // member Variables
        this.mF1 = opts.f1 || 130.81;
        this.mF2 = opts.f2 || 164.81;
        this.mF3 = opts.f3 || 196.00;
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

/**
 * class representing a button with two states
 *
 * Written by Vapurrmaid aka Grey B
 *
 * https://github.com/vapurrmaid
 * https://medium.com/@vapurrmaid
 *
 * vapurrmaid@gmail.com
 */
class ToggleButton {
    /**
     * @param {Object} [options={}]
     * @param {string} [options.on="⏸"] - state to show when 'on'
     * @param {string} [options.off="▶️"] - state to shown when 'off'
     * @param {boolean} [options.startOn=false] - if true, starts in
     'on' state. Else starts in 'off' state
     * @returns {undefined}
     */
    constructor(options = {}) {
        this.on = options.on || "⏸";
        this.off = options.off || "▶️";
        options.startOn ?
            this.current = "on" :
            this.current = "off";
    }

    /**
     * Toggles the state and returns the matching string
     * representation of the new state.
     * @returns {string}
     */
    toggle() {
        this.current === "on" ?
            this.current = "off" :
            this.current = "on";
        return this[this.current];
    }}


//////////////////////////////////////////////////////////////

let object = {}
object['dom'] = async (obj)=>{
    obj['dom'] = {}
    obj['dom']['visualizer'] = {}
    obj['dom']['control'] = {}
    obj['dom']['playBtnEl'] = obj['this']['shadowRoot'].getElementById('playButton');
    obj['dom']['playEl'] = obj['this']['shadowRoot'].querySelector('.svg-audio-btn__play');
    obj['dom']['pauseEl'] = obj['this']['shadowRoot'].querySelector('.svg-audio-btn__pauseGrp');
    obj['dom']['visualizer']['this'] = obj['this']['shadowRoot'].getElementById('visualizer');
    obj['dom']['visualizer']['vCtx'] = obj['dom']['visualizer']['this'].getContext('2d');
    obj['dom']['control']['waveCtrl1El'] = obj['this']['shadowRoot'].getElementById('wave1Control');
    obj['dom']['control']['waveCtrl2El'] = obj['this']['shadowRoot'].getElementById('wave2Control');
    obj['dom']['control']['waveCtrl3El'] = obj['this']['shadowRoot'].getElementById('wave3Control');
    obj['dom']['volumeControl'] = obj['this']['shadowRoot'].getElementById('volumeControl');

    return obj
}
export default async (obj)=>{

        // module constants
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const dF = 0.0; // inital delta frequency
        const volume = 0.5; // initial Volume -> (0.0, 1.0)
        const player = new AudioPlayer({ ctx, volume });
        const f1visualData = new Uint8Array(player.getAnalyzerFFTSize(1));
        const f2visualData = new Uint8Array(player.getAnalyzerFFTSize(2));
        const f3visualData = new Uint8Array(player.getAnalyzerFFTSize(3));
        const playBtnStates = new ToggleButton({
            on: 'pause',
            off: 'play' });

        obj = await object['dom'](obj)
        obj['dom']['control']['waveCtrl1El'].value = dF;
        // obj['dom']['control']['waveCtrl2El'].value = dF;
        // obj['dom']['control']['waveCtrl3El'].value = dF;
        obj['dom']['volumeControl'].value = volume;

        // unlock on mobile - credit to Pavle Goloskokovic
        // https://hackernoon.com/unlocking-web-audio-the-smarter-way-8858218c0e09
        if (ctx.state === 'suspended' && 'ontouchstart' in window) {
            const unlock = _ => {
                ctx.resume();
            };
            document.body.addEventListener('touchstart', unlock, false);
            document.body.addEventListener('touchend', unlock, false);
        }

        // Play Button click handler
        obj['dom']['playBtnEl'].addEventListener('click', function () {
            // console.assert(false)
            if (playBtnStates.toggle() === 'pause') {// play was pressed
                // reset each frequency
                obj['dom']['control']['waveCtrl1El'].value = dF;
                // obj['dom']['control']['waveCtrl2El'].value = dF;
                // obj['dom']['control']['waveCtrl3El'] .value = dF;
                obj['dom']['volumeControl'].value = volume; // reset vol knob
                obj['dom']['playEl'].classList.add('hidden');
                obj['dom']['pauseEl'].classList.remove('hidden');
            } else {// pause was pressed
                // reset each frequency
                obj['dom']['control']['waveCtrl1El'].value = dF;
                // obj['dom']['control']['waveCtrl2El'].value = dF;
                // obj['dom']['control']['waveCtrl3El'].value = dF;
                obj['dom']['volumeControl'].value = volume; // reset vol knob
                obj['dom']['playEl'].classList.remove('hidden');
                obj['dom']['pauseEl'].classList.add('hidden');
            }

            player.togglePlay();
        })

        // wave input handlers - make sure to map attribute
        // vals to Numbers, as that's what AudioPlayer expects
        ;[
        obj['dom']['control']['waveCtrl1El'],
        obj['dom']['control']['waveCtrl2El'],
        obj['dom']['control']['waveCtrl3El']].
        forEach(ctrl => {
            ctrl.addEventListener('input', function (e) {
                if (playBtnStates.current === 'on') {
                    player.changeFrequency(
                        Number(this.dataset.f), // attr data-f -> (1, 3)
                        Number(this.value));

                }
            });
        });

        // Volume input handler
    obj['dom']['volumeControl'].addEventListener('input', function (e) {
            if (playBtnStates.current === 'on') {
                player.changeGain(Number(this.value));
            }
        });

        // visualizer animation largely based off of MDN example:
        // https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js
        function draw() {
            let WIDTH =  obj['dom']['visualizer']['this'].width;
            let HEIGHT =  obj['dom']['visualizer']['this'].height;

            // loop this
            window.requestAnimationFrame(draw);

            // get the current Data (gets placed into array arg)
            player.getAnalyzerTimeBytes(1, f1visualData);
            // player.getAnalyzerTimeBytes(2, f2visualData);
            // player.getAnalyzerTimeBytes(3, f3visualData);

            // set the canvas style
            obj['dom']['visualizer']['vCtx'].fillStyle = '#EEE';
            obj['dom']['visualizer']['vCtx'].fillRect(0, 0, WIDTH, HEIGHT);
            obj['dom']['visualizer']['vCtx'].lineWidth = 2;

            // now that we have the current Data for each wave, loop
            // through each and draw each point value
            drawWave(player.getAnalyzerFFTSize(1), '#26a69a', f1visualData);
            // drawWave(player.getAnalyzerFFTSize(2), '#ec407a', f2visualData);
            // drawWave(player.getAnalyzerFFTSize(3), '#29b6f6', f3visualData);

            function drawWave(bufferLength, color, dataArray) {
                // draw the path - loop through
                // the Uint8Array and draw each pt
                obj['dom']['visualizer']['vCtx'].beginPath();
                obj['dom']['visualizer']['vCtx'].strokeStyle = color;

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
                        obj['dom']['visualizer']['vCtx'].moveTo(x, y) :
                        obj['dom']['visualizer']['vCtx'].lineTo(x, y);

                    x += sliceWidth;
                });

                obj['dom']['visualizer']['vCtx'].lineTo(WIDTH, HEIGHT / 2);
                obj['dom']['visualizer']['vCtx'].stroke();
            }
        }

        draw();

};