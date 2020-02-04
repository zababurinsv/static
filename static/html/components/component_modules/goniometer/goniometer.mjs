export default (dat, FPSMeter)=>{


}
(function(dat, FPSMeter) {
    "use strict";

    let MATH = ('exp pow tan tg:tan atan arctg:atan log sin asin arcsin:asin cos'
        + ' acos arccos:acos sqrt E e:E PI pi:PI floor ceil round sign abs'
        + ' rand:random random')
        .split(/\s+/)
        .map(function(e) { return e.split(':') })
        .reduce(function(res, e) {
            return res + 'let ' + e[0] + ' = Math.' + (e[1] || e[0]) + ';';
        }, '');

    function squ(m) { return sign(sin(m)) }
    function saw(m) { m *= .5; return 2 * (m - floor(.5 + m)) }
    function tri(m) { return 1 - 2 * abs(saw(m)) }

    MATH += squ.toString();
    MATH += saw.toString();
    MATH += tri.toString();

    function compile(source) {
        try {
            let fn = new Function(
                MATH +
                'return function(t, m, s) {\n' +
                '  let phi = m * PI;\n' +
                '  return (' + source + ');\n' +
                '};')();

            // Avoid things like `42 + sin`.
            if (isNaN(fn(0, 0, 0)) && isNaN(fn(42, 1, 1)))
                return null;

            return fn;
        } catch (e) {
            return null;
        }
    }

    function Oscilloscope() {
        this.x = 'cos(3*phi + tri(t))';
        this.y = 'sin(2*phi + t)';
        this.w = 'cos(3*phi*tri(t))';
        this.speed = 1;
        this.step = 0.01;
        this.thickness = 2;
        this.color = '#77ccff';
        this.running = true;

        this.prev = Date.now();
        this.time = 0;

        this.audio = null;
    }

    Oscilloscope.prototype = {
        get x() { return this._x },
        set x(v) {
            let fn = compile(v);
            if (fn) {
                this.xfn = fn;
                this._x = v;
            }
        },

        get y() { return this._y },
        set y(v) {
            let fn = compile(v);
            if (fn) {
                this.yfn = fn;
                this._y = v;
            }
        },

        get w() { return this._w },
        set w(v) {
            let fn = compile(v);
            if (fn) {
                this.wfn = fn;
                this._w = v;
            }
        },

        get recording() { return !!this.audio },
        set recording(v) {
            v ? this.startRecording() : this.stopRecording();
        },

        startRecording: function() {
            if (this.audio)
                return;

            let self = this;

            navigator.getUserMedia(
                {audio: true, video: false},

                function(stream) {
                    let audio = self.audio = {};
                    audio.stream = stream;
                    audio.context = new AudioContext();
                    audio.analyser = audio.context.createAnalyser();
                    audio.analyser.smoothingTimeConstant = 0;

                    audio.source = audio.context.createMediaStreamSource(stream);
                    audio.source.connect(audio.analyser);

                    audio.buffer = new Float32Array(audio.analyser.frequencyBinCount);
                    audio.lastSample = audio.buffer.length - 1;
                },

                function(err) {
                    throw err;
                }
            );
        },

        stopRecording: function() {
            if (this.audio) {
                this.audio.stream.stop();
                this.audio = null;
            }
        },

        toggle: function() {
            this.running = !this.running;
            this.prev = Date.now();
        },

        update: function() {
            if (this.running) {
                let now = Date.now();
                this.time += (now - this.prev) * this.speed;
                this.prev = now;
            }
        },

        render: function(ctx) {
            if (!this.running)
                return;

            let w = ctx.canvas.width, hw = w/2,
                h = ctx.canvas.height, hh = h/2;

            ctx.clearRect(0, 0, w, h);
            ctx.lineWidth = this.thickness;
            ctx.strokeStyle = this.color;

            if (this.audio && this.audio.buffer) {
                let record = this.audio.buffer;
                let last = this.audio.lastSample;
                this.audio.analyser.getFloatTimeDomainData(record);
            }

            let xfn = this.xfn,
                yfn = this.yfn,
                wfn = this.wfn,
                step = this.step;

            let t = this.time / 1000;
            let px = xfn(t, -1, record ? record[0] : 0),
                py = yfn(t, -1, record ? record[0] : 0);

            for (let m = -1, e = 1+step/2; m < e; m += step) {
                if (m > 1)
                    m = 1;

                let s = record ? record[last * (m+1)/2 +.5|0] : 0;

                let x = xfn(t, m, s),
                    y = yfn(t, m, s);

                ctx.globalAlpha = wfn(t, m, s);
                ctx.save();
                ctx.setTransform(hw, 0, 0, -hh, hw, hh);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.restore();
                ctx.stroke();

                px = x;
                py = y;
            }
        },

        constructor: Oscilloscope
    };

    window.onload = function() {
        let osc = new Oscilloscope;

        let canvas = document.querySelector('#area');
        let ctx = canvas.getContext('2d');

        let gui = new dat.GUI();
        gui.add(osc, 'x').name('x(t, m, phi, s)');
        gui.add(osc, 'y').name('y(t, m, phi, s)');
        gui.add(osc, 'w').name('w(t, m, phi, s)');
        gui.add(osc, 'recording').name('record (s param)').listen();
        gui.add(osc, 'speed', -25, 25);
        gui.add(osc, 'step', 0.001, 0.05);
        gui.add(osc, 'thickness', 0.2, 10);
        gui.addColor(osc, 'color');
        gui.add(canvas, 'width', 100);
        gui.add(canvas, 'height', 100);

        let toggle = gui.add(osc, 'toggle').name('pause (space)')
            .onChange(updateToggle);

        function updateToggle() {
            toggle.name(osc.running ? 'resume' : 'pause');
            osc.running ? meter.hide() : meter.show();
        }

        addEventListener('keypress', function(e) {
            if (e.charCode === 32 /*space*/
                && e.target.tagName !== 'INPUT') {
                updateToggle();
                osc.toggle();
                e.preventDefault();
            }
        }, false);

        let meter = new FPSMeter();
        let nextTick = requestAnimationFrame;

        (function loop() {
            meter.tickStart();
            osc.update();
            osc.render(ctx);
            nextTick(loop);
            meter.tick();
        })();
    };


    navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.msGetUserMedia;
})(dat, FPSMeter);