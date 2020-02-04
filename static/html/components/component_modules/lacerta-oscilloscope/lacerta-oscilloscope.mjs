(function (dat, FPSMeter) {
  'use strict'

  var MATH = ('exp pow tan tg:tan atan arctg:atan log sin asin arcsin:asin cos' +
        ' acos arccos:acos sqrt E e:E PI pi:PI floor ceil round sign abs' +
        ' rand:random random')
    .split(/\s+/)
    .map(function (e) { return e.split(':') })
    .reduce(function (res, e) {
      return res + 'var ' + e[0] + ' = Math.' + (e[1] || e[0]) + ';'
    }, '')

  function squ (m) { return sign(sin(m)) }
  function saw (m) { m *= 0.5; return 2 * (m - floor(0.5 + m)) }
  function tri (m) { return 1 - 2 * abs(saw(m)) }

  MATH += squ.toString()
  MATH += saw.toString()
  MATH += tri.toString()

  function compile (source) {
    try {
      var fn = new Function(
        MATH +
                'return function(t, m, s) {\n' +
                '  var phi = m * PI;\n' +
                '  return (' + source + ');\n' +
                '};')()

      // Avoid things like `42 + sin`.
      if (isNaN(fn(0, 0, 0)) && isNaN(fn(42, 1, 1))) { return null }

      return fn
    } catch (e) {
      return null
    }
  }

  function Oscilloscope () {
    this.x = 'cos(3*phi + tri(t))'
    this.y = 'sin(2*phi + t)'
    this.w = 'cos(3*phi*tri(t))'
    this.speed = 1
    this.step = 0.01
    this.thickness = 2
    this.color = '#77ccff'
    this.running = true

    this.prev = Date.now()
    this.time = 0

    this.audio = null
  }

  Oscilloscope.prototype = {
    get x () { return this._x },
    set x (v) {
      var fn = compile(v)
      if (fn) {
        this.xfn = fn
        this._x = v
      }
    },

    get y () { return this._y },
    set y (v) {
      var fn = compile(v)
      if (fn) {
        this.yfn = fn
        this._y = v
      }
    },

    get w () { return this._w },
    set w (v) {
      var fn = compile(v)
      if (fn) {
        this.wfn = fn
        this._w = v
      }
    },

    get recording () { return !!this.audio },
    set recording (v) {
      v ? this.startRecording() : this.stopRecording()
    },

    startRecording: function () {
      if (this.audio) { return }

      var self = this

      navigator.getUserMedia(
        {audio: true, video: false},

        function (stream) {
          var audio = self.audio = {}
          audio.stream = stream
          audio.context = new AudioContext()
          audio.analyser = audio.context.createAnalyser()
          audio.analyser.smoothingTimeConstant = 0

          audio.source = audio.context.createMediaStreamSource(stream)
          audio.source.connect(audio.analyser)

          audio.buffer = new Float32Array(audio.analyser.frequencyBinCount)
          audio.lastSample = audio.buffer.length - 1
        },

        function (err) {
          throw err
        }
      )
    },

    stopRecording: function () {
      if (this.audio) {
        this.audio.stream.stop()
        this.audio = null
      }
    },

    toggle: function () {
      this.running = !this.running
      this.prev = Date.now()
    },

    update: function () {
      if (this.running) {
        var now = Date.now()
        this.time += (now - this.prev) * this.speed
        this.prev = now
      }
    },
    render: function (ctx) {
      if (!this.running) { return }

      var w = ctx.canvas.width; var hw = w / 2

      var h = ctx.canvas.height; var hh = h / 2

      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = this.thickness
      ctx.strokeStyle = this.color

      if (this.audio && this.audio.buffer) {
        var record = this.audio.buffer
        var last = this.audio.lastSample
        this.audio.analyser.getFloatTimeDomainData(record)
      }

      var xfn = this.xfn

      var yfn = this.yfn

      var wfn = this.wfn

      var step = this.step

      var t = this.time / 1000
      var px = xfn(t, -1, record ? record[0] : 0)

      var py = yfn(t, -1, record ? record[0] : 0)

      for (var m = -1, e = 1 + step / 2; m < e; m += step) {
        if (m > 1) { m = 1 }

        var s = record ? record[last * (m + 1) / 2 + 0.5 | 0] : 0

        var x = xfn(t, m, s)

        var y = yfn(t, m, s)

        ctx.globalAlpha = wfn(t, m, s)
        ctx.save()
        ctx.setTransform(hw, 0, 0, -hh, hw, hh)
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(x, y)
        ctx.restore()
        ctx.stroke()

        px = x
        py = y
      }
    },

    constructor: Oscilloscope
  }

  window.onload = function () {
    var osc = new Oscilloscope()

    var canvas = document.querySelector('#area')
    var ctx = canvas.getContext('2d')

    var gui = new dat.GUI()
    gui.add(osc, 'x').name('x(t, m, phi, s)')
    gui.add(osc, 'y').name('y(t, m, phi, s)')
    gui.add(osc, 'w').name('w(t, m, phi, s)')
    gui.add(osc, 'recording').name('record (s param)').listen()
    gui.add(osc, 'speed', -25, 25)
    gui.add(osc, 'step', 0.001, 0.05)
    gui.add(osc, 'thickness', 0.2, 10)
    gui.addColor(osc, 'color')
    gui.add(canvas, 'width', 100)
    gui.add(canvas, 'height', 100)

    var toggle = gui.add(osc, 'toggle').name('pause (space)')
      .onChange(updateToggle)

    function updateToggle () {
      toggle.name(osc.running ? 'resume' : 'pause')
      osc.running ? meter.hide() : meter.show()
    }

    addEventListener('keypress', function (e) {
      if (e.charCode === 32 && /* space */
                e.target.tagName !== 'INPUT') {
        updateToggle()
        osc.toggle()
        e.preventDefault()
      }
    }, false)

    var meter = new FPSMeter()
    var nextTick = requestAnimationFrame;

    (function loop () {
      meter.tickStart()
      osc.update()
      osc.render(ctx)
      nextTick(loop)
      meter.tick()
    })()
  }

  navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
})(dat, FPSMeter)
