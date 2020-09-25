require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./image_exports/png.coffee":[function(require,module,exports){
        var RSVP;

        RSVP = require('rsvp');

        module.exports = {
            toBase64: function() {
                var canvas, context, i, imageData, j, len, pixel, pixelData, ref;
                canvas = document.createElement('canvas');
                canvas.width = this.width();
                canvas.height = this.height();
                context = canvas.getContext('2d');
                imageData = context.getImageData(0, 0, this.width(), this.height());
                pixelData = imageData.data;
                ref = this.pixelData;
                for (i = j = 0, len = ref.length; j < len; i = ++j) {
                    pixel = ref[i];
                    pixelData[i] = pixel;
                }
                context.putImageData(imageData, 0, 0);
                return canvas.toDataURL('image/png');
            },
            toPng: function() {
                var dataUrl, image;
                dataUrl = this.toBase64();
                image = new Image();
                image.width = this.width();
                image.height = this.height();
                image.src = dataUrl;
                return image;
            },
            saveAsPng: function() {
                throw "Not available in the browser. Use toPng() instead.";
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvc2hpbXMvcG5nLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL3NoaW1zL3BuZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0FBRVAsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLFFBQUEsRUFBVSxTQUFBO0FBRVIsUUFBQTtJQUFBLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtJQUNULE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQUNmLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLElBQUMsQ0FBQSxNQUFELENBQUE7SUFDaEIsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO0lBRVYsU0FBQSxHQUFZLE9BQU8sQ0FBQyxZQUFSLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBM0IsRUFBcUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFyQztJQUNaLFNBQUEsR0FBWSxTQUFTLENBQUM7QUFFdEI7QUFBQSxTQUFBLDZDQUFBOztNQUFBLFNBQVUsQ0FBQSxDQUFBLENBQVYsR0FBZTtBQUFmO0lBRUEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsU0FBckIsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7V0FFQSxNQUFNLENBQUMsU0FBUCxDQUFpQixXQUFqQjtFQWRRLENBQVY7RUFnQkEsS0FBQSxFQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFELENBQUE7SUFHVixLQUFBLEdBQVEsSUFBSSxLQUFKLENBQUE7SUFDUixLQUFLLENBQUMsS0FBTixHQUFjLElBQUMsQ0FBQSxLQUFELENBQUE7SUFDZCxLQUFLLENBQUMsTUFBTixHQUFlLElBQUMsQ0FBQSxNQUFELENBQUE7SUFDZixLQUFLLENBQUMsR0FBTixHQUFZO1dBRVo7RUFUSyxDQWhCUDtFQTJCQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQU07RUFERyxDQTNCWCJ9

    },{"rsvp":112}],"./psd/init.coffee":[function(require,module,exports){
        var RSVP;

        RSVP = require('rsvp');

        module.exports = {
            extended: function(PSD) {
                this.fromURL = function(url) {
                    return new RSVP.Promise(function(resolve, reject) {
                        var xhr;
                        xhr = new XMLHttpRequest();
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function() {
                            var data, psd;
                            data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
                            psd = new PSD(data);
                            psd.parse();
                            return resolve(psd);
                        };
                        return xhr.send(null);
                    });
                };
                this.fromEvent = function(e) {
                    return new RSVP.Promise(function(resolve, reject) {
                        var file, reader;
                        file = e.dataTransfer.files[0];
                        reader = new FileReader();
                        reader.onload = function(e) {
                            var psd;
                            psd = new PSD(new Uint8Array(e.target.result));
                            psd.parse();
                            return resolve(psd);
                        };
                        reader.onerror = reject;
                        return reader.readAsArrayBuffer(file);
                    });
                };
                return this.fromDroppedFile = function(file) {
                    return new RSVP.Promise(function(resolve, reject) {
                        var reader;
                        reader = new FileReader();
                        reader.onload = function(e) {
                            var psd;
                            psd = new PSD(new Uint8Array(e.target.result));
                            psd.parse();
                            return resolve(psd);
                        };
                        reader.onerror = reject;
                        return reader.readAsArrayBuffer(file);
                    });
                };
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvc2hpbXMvaW5pdC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9zaGltcy9pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7QUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsUUFBQSxFQUFVLFNBQUMsR0FBRDtJQUNSLElBQUMsQ0FBQSxPQUFELEdBQVcsU0FBQyxHQUFEO2FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBVCxDQUFpQixTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2YsWUFBQTtRQUFBLEdBQUEsR0FBTSxJQUFJLGNBQUosQ0FBQTtRQUNOLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQixJQUFyQjtRQUNBLEdBQUcsQ0FBQyxZQUFKLEdBQW1CO1FBQ25CLEdBQUcsQ0FBQyxNQUFKLEdBQWEsU0FBQTtBQUNYLGNBQUE7VUFBQSxJQUFBLEdBQU8sSUFBSSxVQUFKLENBQWUsR0FBRyxDQUFDLFFBQUosSUFBZ0IsR0FBRyxDQUFDLHNCQUFuQztVQUNQLEdBQUEsR0FBTSxJQUFJLEdBQUosQ0FBUSxJQUFSO1VBQ04sR0FBRyxDQUFDLEtBQUosQ0FBQTtpQkFFQSxPQUFBLENBQVEsR0FBUjtRQUxXO2VBT2IsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFUO01BWGUsQ0FBakI7SUFEUztJQWNYLElBQUMsQ0FBQSxTQUFELEdBQWEsU0FBQyxDQUFEO2FBQ1gsSUFBSSxJQUFJLENBQUMsT0FBVCxDQUFpQixTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2YsWUFBQTtRQUFBLElBQUEsR0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQU0sQ0FBQSxDQUFBO1FBQzVCLE1BQUEsR0FBUyxJQUFJLFVBQUosQ0FBQTtRQUNULE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFNBQUMsQ0FBRDtBQUNkLGNBQUE7VUFBQSxHQUFBLEdBQU0sSUFBSSxHQUFKLENBQVEsSUFBSSxVQUFKLENBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUF4QixDQUFSO1VBQ04sR0FBRyxDQUFDLEtBQUosQ0FBQTtpQkFFQSxPQUFBLENBQVEsR0FBUjtRQUpjO1FBTWhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO2VBQ2pCLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixJQUF6QjtNQVZlLENBQWpCO0lBRFc7V0FhYixJQUFDLENBQUEsZUFBRCxHQUFtQixTQUFDLElBQUQ7YUFDakIsSUFBSSxJQUFJLENBQUMsT0FBVCxDQUFpQixTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2YsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLFVBQUosQ0FBQTtRQUNULE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFNBQUMsQ0FBRDtBQUNkLGNBQUE7VUFBQSxHQUFBLEdBQU0sSUFBSSxHQUFKLENBQVEsSUFBSSxVQUFKLENBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUF4QixDQUFSO1VBQ04sR0FBRyxDQUFDLEtBQUosQ0FBQTtpQkFFQSxPQUFBLENBQVEsR0FBUjtRQUpjO1FBTWhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO2VBQ2pCLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixJQUF6QjtNQVRlLENBQWpCO0lBRGlCO0VBNUJYLENBQVYifQ==

    },{"rsvp":112}],1:[function(require,module,exports){
        var BlendMode, Module,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        Module = require('coffeescript-module').Module;

        module.exports = BlendMode = (function(superClass) {
            var BLEND_MODES;

            extend(BlendMode, superClass);

            BlendMode.aliasProperty('blendingMode', 'mode');

            BLEND_MODES = {
                norm: 'normal',
                dark: 'darken',
                lite: 'lighten',
                hue: 'hue',
                sat: 'saturation',
                colr: 'color',
                lum: 'luminosity',
                mul: 'multiply',
                scrn: 'screen',
                diss: 'dissolve',
                over: 'overlay',
                hLit: 'hard_light',
                sLit: 'soft_light',
                diff: 'difference',
                smud: 'exclusion',
                div: 'color_dodge',
                idiv: 'color_burn',
                lbrn: 'linear_burn',
                lddg: 'linear_dodge',
                vLit: 'vivid_light',
                lLit: 'linear_light',
                pLit: 'pin_light',
                hMix: 'hard_mix',
                pass: 'passthru',
                dkCl: 'darker_color',
                lgCl: 'lighter_color',
                fsub: 'subtract',
                fdiv: 'divide'
            };

            function BlendMode(file) {
                this.file = file;
                this.blendKey = null;
                this.opacity = null;
                this.clipping = null;
                this.clipped = null;
                this.flags = null;
                this.mode = null;
                this.visible = null;
            }

            BlendMode.prototype.parse = function() {
                this.file.seek(4, true);
                this.blendKey = this.file.readString(4).trim();
                this.opacity = this.file.readByte();
                this.clipping = this.file.readByte();
                this.flags = this.file.readByte();
                this.mode = BLEND_MODES[this.blendKey];
                this.clipped = this.clipping === 1;
                this.visible = !((this.flags & (0x01 << 1)) > 0);
                return this.file.seek(1, true);
            };

            BlendMode.prototype.opacityPercentage = function() {
                return this.opacity * 100 / 255;
            };

            return BlendMode;

        })(Module);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ibGVuZF9tb2RlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvYmxlbmRfbW9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpQkFBQTtFQUFBOzs7QUFBQyxTQUFVLE9BQUEsQ0FBUSxxQkFBUjs7QUFJWCxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixNQUFBOzs7O0VBQUEsU0FBQyxDQUFBLGFBQUQsQ0FBZSxjQUFmLEVBQStCLE1BQS9COztFQUlBLFdBQUEsR0FBYztJQUNaLElBQUEsRUFBTSxRQURNO0lBRVosSUFBQSxFQUFNLFFBRk07SUFHWixJQUFBLEVBQU0sU0FITTtJQUlaLEdBQUEsRUFBTSxLQUpNO0lBS1osR0FBQSxFQUFNLFlBTE07SUFNWixJQUFBLEVBQU0sT0FOTTtJQU9aLEdBQUEsRUFBTSxZQVBNO0lBUVosR0FBQSxFQUFNLFVBUk07SUFTWixJQUFBLEVBQU0sUUFUTTtJQVVaLElBQUEsRUFBTSxVQVZNO0lBV1osSUFBQSxFQUFNLFNBWE07SUFZWixJQUFBLEVBQU0sWUFaTTtJQWFaLElBQUEsRUFBTSxZQWJNO0lBY1osSUFBQSxFQUFNLFlBZE07SUFlWixJQUFBLEVBQU0sV0FmTTtJQWdCWixHQUFBLEVBQU0sYUFoQk07SUFpQlosSUFBQSxFQUFNLFlBakJNO0lBa0JaLElBQUEsRUFBTSxhQWxCTTtJQW1CWixJQUFBLEVBQU0sY0FuQk07SUFvQlosSUFBQSxFQUFNLGFBcEJNO0lBcUJaLElBQUEsRUFBTSxjQXJCTTtJQXNCWixJQUFBLEVBQU0sV0F0Qk07SUF1QlosSUFBQSxFQUFNLFVBdkJNO0lBd0JaLElBQUEsRUFBTSxVQXhCTTtJQXlCWixJQUFBLEVBQU0sY0F6Qk07SUEwQlosSUFBQSxFQUFNLGVBMUJNO0lBMkJaLElBQUEsRUFBTSxVQTNCTTtJQTRCWixJQUFBLEVBQU0sUUE1Qk07OztFQStCRCxtQkFBQyxJQUFEO0lBQUMsSUFBQyxDQUFBLE9BQUQ7SUFFWixJQUFDLENBQUEsUUFBRCxHQUFZO0lBR1osSUFBQyxDQUFBLE9BQUQsR0FBVztJQUdYLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFHWixJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUdULElBQUMsQ0FBQSxJQUFELEdBQVE7SUFHUixJQUFDLENBQUEsT0FBRCxHQUFXO0VBbEJBOztzQkFxQmIsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLENBQWpCLENBQW1CLENBQUMsSUFBcEIsQ0FBQTtJQUNaLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUE7SUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO0lBQ1osSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQTtJQUVULElBQUMsQ0FBQSxJQUFELEdBQVEsV0FBWSxDQUFBLElBQUMsQ0FBQSxRQUFEO0lBQ3BCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLFFBQUQsS0FBYTtJQUV4QixJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsQ0FBQyxDQUFDLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxJQUFBLElBQVEsQ0FBVCxDQUFWLENBQUEsR0FBeUIsQ0FBMUI7V0FFWixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtFQWJLOztzQkFnQlAsaUJBQUEsR0FBbUIsU0FBQTtXQUFHLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBWCxHQUFpQjtFQUFwQjs7OztHQXpFb0IifQ==

    },{"coffeescript-module":82}],2:[function(require,module,exports){
        var ChannelImage, Image, ImageFormat, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        Image = require('./image.coffee');

        ImageFormat = require('./image_format.coffee');

        module.exports = ChannelImage = (function(superClass) {
            extend(ChannelImage, superClass);

            ChannelImage.includes(ImageFormat.LayerRAW);

            ChannelImage.includes(ImageFormat.LayerRLE);

            function ChannelImage(file, header, layer) {
                this.layer = layer;
                this._width = this.layer.width;
                this._height = this.layer.height;
                ChannelImage.__super__.constructor.call(this, file, header);
                this.channelsInfo = this.layer.channelsInfo;
                this.hasMask = _.any(this.channelsInfo, function(c) {
                    return c.id < -1;
                });
                this.opacity = this.layer.opacity / 255.0;
                this.maskData = [];
            }

            ChannelImage.prototype.skip = function() {
                var chan, i, len, ref, results;
                ref = this.channelsInfo;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    chan = ref[i];
                    results.push(this.file.seek(chan.length, true));
                }
                return results;
            };

            ChannelImage.prototype.width = function() {
                return this._width;
            };

            ChannelImage.prototype.height = function() {
                return this._height;
            };

            ChannelImage.prototype.channels = function() {
                return this.layer.channels;
            };

            ChannelImage.prototype.parse = function() {
                var chan, finish, i, len, ref, start;
                this.chanPos = 0;
                ref = this.channelsInfo;
                for (i = 0, len = ref.length; i < len; i++) {
                    chan = ref[i];
                    if (chan.length <= 0) {
                        this.parseCompression();
                        continue;
                    }
                    this.chan = chan;
                    if (chan.id < -1) {
                        this._width = this.layer.mask.width;
                        this._height = this.layer.mask.height;
                    } else {
                        this._width = this.layer.width;
                        this._height = this.layer.height;
                    }
                    this.length = this._width * this._height;
                    start = this.file.tell();
                    this.parseImageData();
                    finish = this.file.tell();
                    if (finish !== start + this.chan.length) {
                        this.file.seek(start + this.chan.length);
                    }
                }
                this._width = this.layer.width;
                this._height = this.layer.height;
                return this.processImageData();
            };

            ChannelImage.prototype.parseImageData = function() {
                this.compression = this.parseCompression();
                switch (this.compression) {
                    case 0:
                        return this.parseRaw();
                    case 1:
                        return this.parseRLE();
                    case 2:
                    case 3:
                        return this.parseZip();
                    default:
                        return this.file.seek(this.endPos);
                }
            };

            return ChannelImage;

        })(Image);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9jaGFubmVsX2ltYWdlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvY2hhbm5lbF9pbWFnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxtQ0FBQTtFQUFBOzs7QUFBQSxDQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7QUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSOztBQVFkLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7RUFDckIsWUFBQyxDQUFBLFFBQUQsQ0FBVSxXQUFXLENBQUMsUUFBdEI7O0VBQ0EsWUFBQyxDQUFBLFFBQUQsQ0FBVSxXQUFXLENBQUMsUUFBdEI7O0VBR2Esc0JBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxLQUFmO0lBQWUsSUFBQyxDQUFBLFFBQUQ7SUFHMUIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsS0FBSyxDQUFDO0lBQ2pCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQztJQUVsQiw4Q0FBTSxJQUFOLEVBQVksTUFBWjtJQUVBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFDdkIsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxZQUFQLEVBQXFCLFNBQUMsQ0FBRDthQUFPLENBQUMsQ0FBQyxFQUFGLEdBQU8sQ0FBQztJQUFmLENBQXJCO0lBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUI7SUFDNUIsSUFBQyxDQUFBLFFBQUQsR0FBWTtFQVhEOzt5QkFjYixJQUFBLEdBQU0sU0FBQTtBQUNKLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O21CQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQUksQ0FBQyxNQUFoQixFQUF3QixJQUF4QjtBQURGOztFQURJOzt5QkFLTixLQUFBLEdBQU8sU0FBQTtXQUFHLElBQUMsQ0FBQTtFQUFKOzt5QkFHUCxNQUFBLEdBQVEsU0FBQTtXQUFHLElBQUMsQ0FBQTtFQUFKOzt5QkFHUixRQUFBLEdBQVUsU0FBQTtXQUFHLElBQUMsQ0FBQSxLQUFLLENBQUM7RUFBVjs7eUJBSVYsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYO0FBQUEsU0FBQSxxQ0FBQTs7TUFDRSxJQUFHLElBQUksQ0FBQyxNQUFMLElBQWUsQ0FBbEI7UUFDRSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtBQUNBLGlCQUZGOztNQUlBLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFJUixJQUFHLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBQyxDQUFkO1FBQ0UsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BRnpCO09BQUEsTUFBQTtRQUlFLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQztRQUNqQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FMcEI7O01BT0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQTtNQUNyQixLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUE7TUFFUixJQUFDLENBQUEsY0FBRCxDQUFBO01BRUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBO01BRVQsSUFBRyxNQUFBLEtBQVksS0FBQSxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBN0I7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUF6QixFQURGOztBQXZCRjtJQTBCQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFDakIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDO1dBRWxCLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0VBL0JLOzt5QkFvQ1AsY0FBQSxHQUFnQixTQUFBO0lBQ2QsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtBQUVmLFlBQU8sSUFBQyxDQUFBLFdBQVI7QUFBQSxXQUNPLENBRFA7ZUFDYyxJQUFDLENBQUEsUUFBRCxDQUFBO0FBRGQsV0FFTyxDQUZQO2VBRWMsSUFBQyxDQUFBLFFBQUQsQ0FBQTtBQUZkLFdBR08sQ0FIUDtBQUFBLFdBR1UsQ0FIVjtlQUdpQixJQUFDLENBQUEsUUFBRCxDQUFBO0FBSGpCO2VBSU8sSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLE1BQVo7QUFKUDtFQUhjOzs7O0dBdEUwQiJ9

    },{"./image.coffee":7,"./image_format.coffee":9,"lodash":109}],3:[function(require,module,exports){
        var Util;

        Util = require('./util.coffee');

        module.exports = {
            cmykToRgb: function(c, m, y, k) {
                var b, g, r;
                r = Util.clamp((65535 - (c * (255 - k) + (k << 8))) >> 8, 0, 255);
                g = Util.clamp((65535 - (m * (255 - k) + (k << 8))) >> 8, 0, 255);
                b = Util.clamp((65535 - (y * (255 - k) + (k << 8))) >> 8, 0, 255);
                return [r, g, b];
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9jb2xvci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2NvbG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxNQUFNLENBQUMsT0FBUCxHQUdFO0VBQUEsU0FBQSxFQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUNULFFBQUE7SUFBQSxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEtBQUEsR0FBUSxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUEsR0FBTSxDQUFQLENBQUosR0FBZ0IsQ0FBQyxDQUFBLElBQUssQ0FBTixDQUFqQixDQUFULENBQUEsSUFBd0MsQ0FBbkQsRUFBc0QsQ0FBdEQsRUFBeUQsR0FBekQ7SUFDSixDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEtBQUEsR0FBUSxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUEsR0FBTSxDQUFQLENBQUosR0FBZ0IsQ0FBQyxDQUFBLElBQUssQ0FBTixDQUFqQixDQUFULENBQUEsSUFBd0MsQ0FBbkQsRUFBc0QsQ0FBdEQsRUFBeUQsR0FBekQ7SUFDSixDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEtBQUEsR0FBUSxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUEsR0FBTSxDQUFQLENBQUosR0FBZ0IsQ0FBQyxDQUFBLElBQUssQ0FBTixDQUFqQixDQUFULENBQUEsSUFBd0MsQ0FBbkQsRUFBc0QsQ0FBdEQsRUFBeUQsR0FBekQ7V0FDSixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtFQUpTLENBQVgifQ==

    },{"./util.coffee":63}],4:[function(require,module,exports){
        var Descriptor;

        module.exports = Descriptor = (function() {
            function Descriptor(file) {
                this.file = file;
                this.data = {};
            }

            Descriptor.prototype.parse = function() {
                var i, id, j, numItems, ref, ref1, value;
                this.data["class"] = this.parseClass();
                numItems = this.file.readInt();
                for (i = j = 0, ref = numItems; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    ref1 = this.parseKeyItem(), id = ref1[0], value = ref1[1];
                    this.data[id] = value;
                }
                return this.data;
            };

            Descriptor.prototype.parseClass = function() {
                return {
                    name: this.file.readUnicodeString(),
                    id: this.parseId()
                };
            };

            Descriptor.prototype.parseId = function() {
                var len;
                len = this.file.readInt();
                if (len === 0) {
                    return this.file.readString(4);
                } else {
                    return this.file.readString(len);
                }
            };

            Descriptor.prototype.parseKeyItem = function() {
                var id, value;
                id = this.parseId();
                value = this.parseItem();
                return [id, value];
            };

            Descriptor.prototype.parseItem = function(type) {
                if (type == null) {
                    type = null;
                }
                if (type == null) {
                    type = this.file.readString(4);
                }
                switch (type) {
                    case 'bool':
                        return this.parseBoolean();
                    case 'type':
                    case 'GlbC':
                        return this.parseClass();
                    case 'Objc':
                    case 'GlbO':
                        return new Descriptor(this.file).parse();
                    case 'doub':
                        return this.parseDouble();
                    case 'enum':
                        return this.parseEnum();
                    case 'alis':
                        return this.parseAlias();
                    case 'Pth':
                        return this.parseFilePath();
                    case 'long':
                        return this.parseInteger();
                    case 'comp':
                        return this.parseLargeInteger();
                    case 'VlLs':
                        return this.parseList();
                    case 'ObAr':
                        return this.parseObjectArray();
                    case 'tdta':
                        return this.parseRawData();
                    case 'obj ':
                        return this.parseReference();
                    case 'TEXT':
                        return this.file.readUnicodeString();
                    case 'UntF':
                        return this.parseUnitDouble();
                    case 'UnFl':
                        return this.parseUnitFloat();
                }
            };

            Descriptor.prototype.parseBoolean = function() {
                return this.file.readBoolean();
            };

            Descriptor.prototype.parseDouble = function() {
                return this.file.readDouble();
            };

            Descriptor.prototype.parseInteger = function() {
                return this.file.readInt();
            };

            Descriptor.prototype.parseLargeInteger = function() {
                return this.file.readLongLong();
            };

            Descriptor.prototype.parseIdentifier = function() {
                return this.file.readInt();
            };

            Descriptor.prototype.parseIndex = function() {
                return this.file.readInt();
            };

            Descriptor.prototype.parseOffset = function() {
                return this.file.readInt();
            };

            Descriptor.prototype.parseProperty = function() {
                return {
                    "class": this.parseClass(),
                    id: this.parseId()
                };
            };

            Descriptor.prototype.parseEnum = function() {
                return {
                    type: this.parseId(),
                    value: this.parseId()
                };
            };

            Descriptor.prototype.parseEnumReference = function() {
                return {
                    "class": this.parseClass(),
                    type: this.parseId(),
                    value: this.parseId()
                };
            };

            Descriptor.prototype.parseAlias = function() {
                var len;
                len = this.file.readInt();
                return this.file.readString(len);
            };

            Descriptor.prototype.parseFilePath = function() {
                var len, numChars, path, pathSize, sig;
                len = this.file.readInt();
                sig = this.file.readString(4);
                pathSize = this.file.read('<i');
                numChars = this.file.read('<i');
                path = this.file.readUnicodeString(numChars);
                return {
                    sig: sig,
                    path: path
                };
            };

            Descriptor.prototype.parseList = function() {
                var count, i, items, j, ref;
                count = this.file.readInt();
                items = [];
                for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    items.push(this.parseItem());
                }
                return items;
            };

            Descriptor.prototype.parseObjectArray = function() {
                throw "Descriptor object array not implemented yet @ " + (this.file.tell());
            };

            Descriptor.prototype.parseRawData = function() {
                var len;
                len = this.file.readInt();
                return this.file.read(len);
            };

            Descriptor.prototype.parseReference = function() {
                var i, items, j, numItems, ref, type, value;
                numItems = this.file.readInt();
                items = [];
                for (i = j = 0, ref = numItems; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    type = this.file.readString(4);
                    value = (function() {
                        switch (type) {
                            case 'prop':
                                return this.parseProperty();
                            case 'Clss':
                                return this.parseClass();
                            case 'Enmr':
                                return this.parseEnumReference();
                            case 'Idnt':
                                return this.parseIdentifier();
                            case 'indx':
                                return this.parseIndex();
                            case 'name':
                                return this.file.readUnicodeString();
                            case 'rele':
                                return this.parseOffset();
                        }
                    }).call(this);
                    items.push({
                        type: type,
                        value: value
                    });
                }
                return items;
            };

            Descriptor.prototype.parseUnitDouble = function() {
                var unit, unitId, value;
                unitId = this.file.readString(4);
                unit = (function() {
                    switch (unitId) {
                        case '#Ang':
                            return 'Angle';
                        case '#Rsl':
                            return 'Density';
                        case '#Rlt':
                            return 'Distance';
                        case '#Nne':
                            return 'None';
                        case '#Prc':
                            return 'Percent';
                        case '#Pxl':
                            return 'Pixels';
                        case '#Mlm':
                            return 'Millimeters';
                        case '#Pnt':
                            return 'Points';
                    }
                })();
                value = this.file.readDouble();
                return {
                    id: unitId,
                    unit: unit,
                    value: value
                };
            };

            Descriptor.prototype.parseUnitFloat = function() {
                var unit, unitId, value;
                unitId = this.file.readString(4);
                unit = (function() {
                    switch (unitId) {
                        case '#Ang':
                            return 'Angle';
                        case '#Rsl':
                            return 'Density';
                        case '#Rlt':
                            return 'Distance';
                        case '#Nne':
                            return 'None';
                        case '#Prc':
                            return 'Percent';
                        case '#Pxl':
                            return 'Pixels';
                        case '#Mlm':
                            return 'Millimeters';
                        case '#Pnt':
                            return 'Points';
                    }
                })();
                value = this.file.readFloat();
                return {
                    id: unitId,
                    unit: unit,
                    value: value
                };
            };

            return Descriptor;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9kZXNjcmlwdG9yLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvZGVzY3JpcHRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUVSLG9CQUFDLElBQUQ7SUFBQyxJQUFDLENBQUEsT0FBRDtJQUVaLElBQUMsQ0FBQSxJQUFELEdBQVE7RUFGRzs7dUJBS2IsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsSUFBQyxDQUFBLElBQUksRUFBQyxLQUFELEVBQUwsR0FBYyxJQUFDLENBQUEsVUFBRCxDQUFBO0lBR2QsUUFBQSxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0FBSVgsU0FBUyxpRkFBVDtNQUNFLE9BQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLEVBQUMsWUFBRCxFQUFLO01BQ0wsSUFBQyxDQUFBLElBQUssQ0FBQSxFQUFBLENBQU4sR0FBWTtBQUZkO1dBSUEsSUFBQyxDQUFBO0VBWkk7O3VCQW1CUCxVQUFBLEdBQVksU0FBQTtXQUNWO01BQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsaUJBQU4sQ0FBQSxDQUFOO01BQ0EsRUFBQSxFQUFJLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FESjs7RUFEVTs7dUJBS1osT0FBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ04sSUFBRyxHQUFBLEtBQU8sQ0FBVjthQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsQ0FBakIsRUFBakI7S0FBQSxNQUFBO2FBQTBDLElBQUMsQ0FBQSxJQUFJ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

    },{}],5:[function(require,module,exports){
        (function (Buffer){
            var Color, File, Util, iconv, jspack,
                hasProp = {}.hasOwnProperty;

            jspack = require('jspack').jspack;

            iconv = require('iconv-lite');

            Color = require('./color.coffee');

            Util = require('./util.coffee');

            module.exports = File = (function() {
                var FORMATS, fn, format, info;

                FORMATS = {
                    Int: {
                        code: '>i',
                        length: 4
                    },
                    UInt: {
                        code: '>I',
                        length: 4
                    },
                    Short: {
                        code: '>h',
                        length: 2
                    },
                    UShort: {
                        code: '>H',
                        length: 2
                    },
                    Float: {
                        code: '>f',
                        length: 4
                    },
                    Double: {
                        code: '>d',
                        length: 8
                    },
                    LongLong: {
                        code: '>q',
                        length: 8
                    }
                };

                fn = function(format, info) {
                    return File.prototype["read" + format] = function() {
                        return this.readf(info.code, info.length)[0];
                    };
                };
                for (format in FORMATS) {
                    if (!hasProp.call(FORMATS, format)) continue;
                    info = FORMATS[format];
                    fn(format, info);
                }

                File.prototype.pos = 0;

                function File(data) {
                    this.data = data;
                }

                File.prototype.tell = function() {
                    return this.pos;
                };

                File.prototype.read = function(length) {
                    var i, j, ref, results;
                    results = [];
                    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                        results.push(this.data[this.pos++]);
                    }
                    return results;
                };

                File.prototype.readf = function(format, len) {
                    if (len == null) {
                        len = null;
                    }
                    return jspack.Unpack(format, this.read(len || jspack.CalcLength(format)));
                };

                File.prototype.seek = function(amt, rel) {
                    if (rel == null) {
                        rel = false;
                    }
                    if (rel) {
                        return this.pos += amt;
                    } else {
                        return this.pos = amt;
                    }
                };

                File.prototype.readString = function(length) {
                    return String.fromCharCode.apply(null, this.read(length)).replace(/\u0000/g, "");
                };

                File.prototype.readUnicodeString = function(length) {
                    if (length == null) {
                        length = null;
                    }
                    length || (length = this.readInt());
                    return iconv.decode(new Buffer(this.read(length * 2)), 'utf-16be').replace(/\u0000/g, "");
                };

                File.prototype.readByte = function() {
                    return this.read(1)[0];
                };

                File.prototype.readBoolean = function() {
                    return this.readByte() !== 0;
                };

                File.prototype.readSpaceColor = function() {
                    var colorComponent, colorSpace, i, j;
                    colorSpace = this.readShort();
                    for (i = j = 0; j < 4; i = ++j) {
                        colorComponent = this.readShort() >> 8;
                    }
                    return {
                        colorSpace: colorSpace,
                        components: colorComponent
                    };
                };

                File.prototype.readPathNumber = function() {
                    var a, arr, b, b1, b2, b3;
                    a = this.readByte();
                    arr = this.read(3);
                    b1 = arr[0] << 16;
                    b2 = arr[1] << 8;
                    b3 = arr[2];
                    b = b1 | b2 | b3;
                    return parseFloat(a, 10) + parseFloat(b / Math.pow(2, 24), 10);
                };

                return File;

            })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9maWxlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvZmlsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxnQ0FBQTtFQUFBOztBQUFDLFNBQVUsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVI7O0FBQ1IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztBQUlQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLE1BQUE7O0VBQUEsT0FBQSxHQUNFO0lBQUEsR0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQURGO0lBR0EsSUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQUpGO0lBTUEsS0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQVBGO0lBU0EsTUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQVZGO0lBWUEsS0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQWJGO0lBZUEsTUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxNQUFBLEVBQVEsQ0FEUjtLQWhCRjtJQWtCQSxRQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sSUFBTjtNQUNBLE1BQUEsRUFBUSxDQURSO0tBbkJGOzs7T0FzQnNDLFNBQUMsTUFBRCxFQUFTLElBQVQ7V0FDdEMsSUFBQyxDQUFBLFNBQUcsQ0FBQSxNQUFBLEdBQU8sTUFBUCxD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

        }).call(this,require("buffer").Buffer)
    },{"./color.coffee":3,"./util.coffee":63,"buffer":66,"iconv-lite":103,"jspack":108}],6:[function(require,module,exports){
        var Header, Module,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        Module = require('coffeescript-module').Module;

        module.exports = Header = (function(superClass) {
            var MODES;

            extend(Header, superClass);

            Header.aliasProperty('height', 'rows');

            Header.aliasProperty('width', 'cols');

            MODES = ['Bitmap', 'GrayScale', 'IndexedColor', 'RGBColor', 'CMYKColor', 'HSLColor', 'HSBColor', 'Multichannel', 'Duotone', 'LabColor', 'Gray16', 'RGB48', 'Lab48', 'CMYK64', 'DeepMultichannel', 'Duotone16'];

            Header.prototype.sig = null;

            Header.prototype.version = null;

            Header.prototype.channels = null;

            Header.prototype.rows = null;

            Header.prototype.cols = null;

            Header.prototype.depth = null;

            Header.prototype.mode = null;

            function Header(file) {
                this.file = file;
            }

            Header.prototype.parse = function() {
                var colorDataLen;
                this.sig = this.file.readString(4);
                this.version = this.file.readUShort();
                this.file.seek(6, true);
                this.channels = this.file.readUShort();
                this.rows = this.height = this.file.readUInt();
                this.cols = this.width = this.file.readUInt();
                this.depth = this.file.readUShort();
                this.mode = this.file.readUShort();
                colorDataLen = this.file.readUInt();
                return this.file.seek(colorDataLen, true);
            };

            Header.prototype.modeName = function() {
                return MODES[this.mode];
            };

            Header.prototype["export"] = function() {
                var data, i, key, len, ref;
                data = {};
                ref = ['sig', 'version', 'channels', 'rows', 'cols', 'depth', 'mode'];
                for (i = 0, len = ref.length; i < len; i++) {
                    key = ref[i];
                    data[key] = this[key];
                }
                return data;
            };

            return Header;

        })(Module);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9oZWFkZXIuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9oZWFkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsY0FBQTtFQUFBOzs7QUFBQyxTQUFVLE9BQUEsQ0FBUSxxQkFBUjs7QUFLWCxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixNQUFBOzs7O0VBQUEsTUFBQyxDQUFBLGFBQUQsQ0FBZSxRQUFmLEVBQXlCLE1BQXpCOztFQUNBLE1BQUMsQ0FBQSxhQUFELENBQWUsT0FBZixFQUF3QixNQUF4Qjs7RUFJQSxLQUFBLEdBQVEsQ0FDTixRQURNLEVBRU4sV0FGTSxFQUdOLGNBSE0sRUFJTixVQUpNLEVBS04sV0FMTSxFQU1OLFVBTk0sRUFPTixVQVBNLEVBUU4sY0FSTSxFQVNOLFNBVE0sRUFVTixVQVZNLEVBV04sUUFYTSxFQVlOLE9BWk0sRUFhTixPQWJNLEVBY04sUUFkTSxFQWVOLGtCQWZNLEVBZ0JOLFdBaEJNOzttQkFvQlIsR0FBQSxHQUFLOzttQkFHTCxPQUFBLEdBQVM7O21CQUdULFFBQUEsR0FBVTs7bUJBR1YsSUFBQSxHQUFNOzttQkFHTixJQUFBLEdBQU07O21CQUdOLEtBQUEsR0FBTzs7bUJBR1AsSUFBQSxHQUFNOztFQUlPLGdCQUFDLElBQUQ7SUFBQyxJQUFDLENBQUEsT0FBRDtFQUFEOzttQkFHYixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFpQixDQUFqQjtJQUNQLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQUE7SUFFWCxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQUE7SUFDWixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUE7SUFDbEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO0lBQ2pCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQUE7SUFDVCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFBO0lBRVIsWUFBQSxHQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO1dBQ2YsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsWUFBWCxFQUF5QixJQUF6QjtFQWJLOzttQkFnQlAsUUFBQSxHQUFVLFNBQUE7V0FBRyxLQUFNLENBQUEsSUFBQyxDQUFBLElBQUQ7RUFBVDs7b0JBR1YsUUFBQSxHQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsSUFBQSxHQUFPO0FBQ1A7QUFBQSxTQUFBLHFDQUFBOztNQUNFLElBQUssQ0FBQSxHQUFBLENBQUwsR0FBWSxJQUFFLENBQUEsR0FBQTtBQURoQjtXQUdBO0VBTE07Ozs7R0F0RTRCIn0=

    },{"coffeescript-module":82}],7:[function(require,module,exports){
        var Export, Image, ImageFormat, ImageMode, Module,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        Module = require('coffeescript-module').Module;

        ImageFormat = require('./image_format.coffee');

        ImageMode = require('./image_mode.coffee');

        Export = require('./image_export.coffee');

        module.exports = Image = (function(superClass) {
            var COMPRESSIONS, attr, fn, i, len, ref;

            extend(Image, superClass);

            Image.includes(ImageFormat.RAW);

            Image.includes(ImageFormat.RLE);

            Image.includes(ImageMode.Greyscale);

            Image.includes(ImageMode.RGB);

            Image.includes(ImageMode.CMYK);

            Image.includes(Export.PNG);

            COMPRESSIONS = ['Raw', 'RLE', 'ZIP', 'ZIPPrediction'];

            function Image(file, header) {
                this.file = file;
                this.header = header;
                this.numPixels = this.width() * this.height();
                if (this.depth() === 16) {
                    this.numPixels *= 2;
                }
                this.calculateLength();
                this.pixelData = [];
                this.channelData = [];
                this.opacity = 1.0;
                this.hasMask = false;
                this.startPos = this.file.tell();
                this.endPos = this.startPos + this.length;
                this.setChannelsInfo();
            }

            ref = ['width', 'height', 'channels', 'depth', 'mode'];
            fn = function(attr) {
                return Image.prototype[attr] = function() {
                    return this.header[attr];
                };
            };
            for (i = 0, len = ref.length; i < len; i++) {
                attr = ref[i];
                fn(attr);
            }

            Image.prototype.setChannelsInfo = function() {
                switch (this.mode()) {
                    case 1:
                        return this.setGreyscaleChannels();
                    case 3:
                        return this.setRgbChannels();
                    case 4:
                        return this.setCmykChannels();
                }
            };

            Image.prototype.calculateLength = function() {
                this.length = (function() {
                    switch (this.depth()) {
                        case 1:
                            return (this.width() + 7) / 8 * this.height();
                        case 16:
                            return this.width() * this.height() * 2;
                        default:
                            return this.width() * this.height();
                    }
                }).call(this);
                this.channelLength = this.length;
                return this.length *= this.channels();
            };

            Image.prototype.parse = function() {
                var ref1;
                this.compression = this.parseCompression();
                if ((ref1 = this.compression) === 2 || ref1 === 3) {
                    this.file.seek(this.endPos);
                    return;
                }
                return this.parseImageData();
            };

            Image.prototype.parseCompression = function() {
                return this.file.readShort();
            };

            Image.prototype.parseImageData = function() {
                switch (this.compression) {
                    case 0:
                        this.parseRaw();
                        break;
                    case 1:
                        this.parseRLE();
                        break;
                    case 2:
                    case 3:
                        this.parseZip();
                        break;
                    default:
                        this.file.seek(this.endPos);
                }
                return this.processImageData();
            };

            Image.prototype.processImageData = function() {
                switch (this.mode()) {
                    case 1:
                        this.combineGreyscaleChannel();
                        break;
                    case 3:
                        this.combineRgbChannel();
                        break;
                    case 4:
                        this.combineCmykChannel();
                }
                return this.channelData = null;
            };

            return Image;

        })(Module);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2ltYWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLDZDQUFBO0VBQUE7OztBQUFDLFNBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUVkLFdBQUEsR0FBYyxPQUFBLENBQVEsdUJBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSOztBQUtkLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLE1BQUE7Ozs7RUFBQSxLQUFDLENBQUEsUUFBRCxDQUFVLFdBQVcsQ0FBQyxHQUF0Qjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLFdBQVcsQ0FBQyxHQUF0Qjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLFNBQVMsQ0FBQyxTQUFwQjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLFNBQVMsQ0FBQyxHQUFwQjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLFNBQVMsQ0FBQyxJQUFwQjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQU0sQ0FBQyxHQUFqQjs7RUFJQSxZQUFBLEdBQWUsQ0FDYixLQURhLEVBRWIsS0FGYSxFQUdiLEtBSGEsRUFJYixlQUphOztFQU9GLGVBQUMsSUFBRCxFQUFRLE1BQVI7SUFBQyxJQUFDLENBQUEsT0FBRDtJQUFPLElBQUMsQ0FBQSxTQUFEO0lBRW5CLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLEdBQVcsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUN4QixJQUFtQixJQUFDLENBQUEsS0FBRCxDQUFBLENBQUEsS0FBWSxFQUEvQjtNQUFB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

    },{"./image_export.coffee":8,"./image_format.coffee":9,"./image_mode.coffee":14,"coffeescript-module":82}],8:[function(require,module,exports){
        module.exports = {
            PNG: require('./image_exports/png.coffee')
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9leHBvcnQuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxHQUFBLEVBQUssT0FBQSxDQUFRLDRCQUFSLENBQUwifQ==

    },{"./image_exports/png.coffee":"./image_exports/png.coffee"}],9:[function(require,module,exports){
        module.exports = {
            RAW: require('./image_formats/raw.coffee'),
            RLE: require('./image_formats/rle.coffee'),
            LayerRLE: require('./image_formats/layer_rle.coffee'),
            LayerRAW: require('./image_formats/layer_raw.coffee')
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXQuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxHQUFBLEVBQUssT0FBQSxDQUFRLDRCQUFSLENBQUw7RUFDQSxHQUFBLEVBQUssT0FBQSxDQUFRLDRCQUFSLENBREw7RUFFQSxRQUFBLEVBQVUsT0FBQSxDQUFRLGtDQUFSLENBRlY7RUFHQSxRQUFBLEVBQVUsT0FBQSxDQUFRLGtDQUFSLENBSFYifQ==

    },{"./image_formats/layer_raw.coffee":10,"./image_formats/layer_rle.coffee":11,"./image_formats/raw.coffee":12,"./image_formats/rle.coffee":13}],10:[function(require,module,exports){
        module.exports = {
            parseRaw: function() {
                var i, j, ref, ref1;
                for (i = j = ref = this.chanPos, ref1 = this.chanPos + this.chan.length - 2; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
                    this.channelData[i] = this.file.readByte();
                }
                return this.chanPos += this.chan.length - 2;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXRzL2xheWVyX3Jhdy5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2ltYWdlX2Zvcm1hdHMvbGF5ZXJfcmF3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsUUFBQSxFQUFVLFNBQUE7QUFDUixRQUFBO0FBQUEsU0FBUyxzSUFBVDtNQUNFLElBQUMsQ0FBQSxXQUFZLENBQUEsQ0FBQSxDQUFiLEdBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO0FBRHBCO1dBR0EsSUFBQyxDQUFBLE9BQUQsSUFBYSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sR0FBZTtFQUpwQixDQUFWIn0=

    },{}],11:[function(require,module,exports){
        module.exports = {
            parseByteCounts: function() {
                var i, j, ref, results;
                results = [];
                for (i = j = 0, ref = this.height(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    results.push(this.file.readShort());
                }
                return results;
            },
            parseChannelData: function() {
                this.lineIndex = 0;
                return this.decodeRLEChannel();
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXRzL2xheWVyX3JsZS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2ltYWdlX2Zvcm1hdHMvbGF5ZXJfcmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsUUFBQTtBQUFBO1NBQTJCLHNGQUEzQjttQkFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQTtBQUFBOztFQURlLENBQWpCO0VBR0EsZ0JBQUEsRUFBa0IsU0FBQTtJQUNoQixJQUFDLENBQUEsU0FBRCxHQUFhO1dBQ2IsSUFBQyxDQUFBLGdCQUFELENBQUE7RUFGZ0IsQ0FIbEIifQ==

    },{}],12:[function(require,module,exports){
        module.exports = {
            parseRaw: function() {
                return this.channelData = this.file.read(this.length);
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXRzL3Jhdy5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2ltYWdlX2Zvcm1hdHMvcmF3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsUUFBQSxFQUFVLFNBQUE7V0FDUixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxNQUFaO0VBRFAsQ0FBViJ9

    },{}],13:[function(require,module,exports){
        var slice = [].slice;

        module.exports = {
            parseRLE: function() {
                this.byteCounts = this.parseByteCounts();
                return this.parseChannelData();
            },
            parseByteCounts: function() {
                var i, k, ref, results;
                results = [];
                for (i = k = 0, ref = this.channels() * this.height(); 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                    results.push(this.file.readShort());
                }
                return results;
            },
            parseChannelData: function() {
                var i, k, ref, results;
                this.chanPos = 0;
                this.lineIndex = 0;
                results = [];
                for (i = k = 0, ref = this.channels(); 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                    this.decodeRLEChannel();
                    results.push(this.lineIndex += this.height());
                }
                return results;
            },
            decodeRLEChannel: function() {
                var byteCount, finish, i, j, k, len, ref, results, val;
                results = [];
                for (j = k = 0, ref = this.height(); 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
                    byteCount = this.byteCounts[this.lineIndex + j];
                    finish = this.file.tell() + byteCount;
                    results.push((function() {
                        var ref1, results1;
                        results1 = [];
                        while (this.file.tell() < finish) {
                            len = this.file.read(1)[0];
                            if (len < 128) {
                                len += 1;
                                (ref1 = this.channelData).splice.apply(ref1, [this.chanPos, 0].concat(slice.call(this.file.read(len))));
                                results1.push(this.chanPos += len);
                            } else if (len > 128) {
                                len ^= 0xff;
                                len += 2;
                                val = this.file.read(1)[0];
                                results1.push((function() {
                                    var l, ref2, results2;
                                    results2 = [];
                                    for (i = l = 0, ref2 = len; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
                                        results2.push(this.channelData[this.chanPos++] = val);
                                    }
                                    return results2;
                                }).call(this));
                            } else {
                                results1.push(void 0);
                            }
                        }
                        return results1;
                    }).call(this));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9mb3JtYXRzL3JsZS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2ltYWdlX2Zvcm1hdHMvcmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxRQUFBLEVBQVUsU0FBQTtJQUNSLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLGVBQUQsQ0FBQTtXQUNkLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0VBRlEsQ0FBVjtFQUlBLGVBQUEsRUFBaUIsU0FBQTtBQUNmLFFBQUE7QUFBQTtTQUEyQix3R0FBM0I7bUJBQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7QUFBQTs7RUFEZSxDQUpqQjtFQU9BLGdCQUFBLEVBQWtCLFNBQUE7QUFDaEIsUUFBQTtJQUFBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsU0FBRCxHQUFhO0FBRWI7U0FBUyx3RkFBVDtNQUNFLElBQUMsQ0FBQSxnQkFBRCxDQUFBO21CQUNBLElBQUMsQ0FBQSxTQUFELElBQWMsSUFBQyxDQUFBLE1BQUQsQ0FBQTtBQUZoQjs7RUFKZ0IsQ0FQbEI7RUFlQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFFBQUE7QUFBQTtTQUFTLHNGQUFUO01BQ0UsU0FBQSxHQUFZLElBQUMsQ0FBQSxVQUFXLENBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFiO01BQ3hCLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxDQUFBLEdBQWU7OztBQUV4QjtlQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLENBQUEsR0FBZSxNQUFyQjtVQUNFLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLENBQWMsQ0FBQSxDQUFBO1VBRXBCLElBQUcsR0FBQSxHQUFNLEdBQVQ7WUFDRSxHQUFBLElBQU87WUFDUCxRQUFBLElBQUMsQ0FBQSxXQUFELENBQVksQ0FBQyxNQUFiLGFBQW9CLENBQUEsSUFBQyxDQUFBLE9BQUQsRUFBVSxDQUFHLFNBQUEsV0FBQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxHQUFYLENBQUEsQ0FBQSxDQUFqQzswQkFDQSxJQUFDLENBQUEsT0FBRCxJQUFZLEtBSGQ7V0FBQSxNQUlLLElBQUcsR0FBQSxHQUFNLEdBQVQ7WUFDSCxHQUFBLElBQU87WUFDUCxHQUFBLElBQU87WUFFUCxHQUFBLEdBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFjLENBQUEsQ0FBQTs7O0FBQ3BCO21CQUF3QyxpRkFBeEM7OEJBQUEsSUFBQyxDQUFBLFdBQVksQ0FBQSxJQUFDLENBQUEsT0FBRCxFQUFBLENBQWIsR0FBMkI7QUFBM0I7OzJCQUxHO1dBQUEsTUFBQTtrQ0FBQTs7UUFQUCxDQUFBOzs7QUFKRjs7RUFEZ0IsQ0FmbEIifQ==

    },{}],14:[function(require,module,exports){
        module.exports = {
            Greyscale: require('./image_modes/greyscale.coffee'),
            RGB: require('./image_modes/rgb.coffee'),
            CMYK: require('./image_modes/cmyk.coffee')
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2RlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvaW1hZ2VfbW9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLFNBQUEsRUFBVyxPQUFBLENBQVEsZ0NBQVIsQ0FBWDtFQUNBLEdBQUEsRUFBSyxPQUFBLENBQVEsMEJBQVIsQ0FETDtFQUVBLElBQUEsRUFBTSxPQUFBLENBQVEsMkJBQVIsQ0FGTiJ9

    },{"./image_modes/cmyk.coffee":15,"./image_modes/greyscale.coffee":16,"./image_modes/rgb.coffee":17}],15:[function(require,module,exports){
        var Color;

        Color = require('../color.coffee');

        module.exports = {
            setCmykChannels: function() {
                this.channelsInfo = [
                    {
                        id: 0
                    }, {
                        id: 1
                    }, {
                        id: 2
                    }, {
                        id: 3
                    }
                ];
                if (this.channels() === 5) {
                    return this.channelsInfo.push({
                        id: -1
                    });
                }
            },
            combineCmykChannel: function() {
                var a, b, c, chan, cmykChannels, g, i, index, j, k, l, len, m, r, ref, ref1, results, val, y;
                cmykChannels = this.channelsInfo.map(function(ch) {
                    return ch.id;
                }).filter(function(ch) {
                    return ch >= -1;
                });
                results = [];
                for (i = j = 0, ref = this.numPixels; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    c = m = y = k = 0;
                    a = 255;
                    for (index = l = 0, len = cmykChannels.length; l < len; index = ++l) {
                        chan = cmykChannels[index];
                        val = this.channelData[i + (this.channelLength * index)];
                        switch (chan) {
                            case -1:
                                a = val;
                                break;
                            case 0:
                                c = val;
                                break;
                            case 1:
                                m = val;
                                break;
                            case 2:
                                y = val;
                                break;
                            case 3:
                                k = val;
                        }
                    }
                    ref1 = Color.cmykToRgb(255 - c, 255 - m, 255 - y, 255 - k), r = ref1[0], g = ref1[1], b = ref1[2];
                    results.push(this.pixelData.push(r, g, b, a));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2Rlcy9jbXlrLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvaW1hZ2VfbW9kZXMvY215ay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSOztBQUNSLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxlQUFBLEVBQWlCLFNBQUE7SUFDZixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNkO1FBQUUsRUFBQSxFQUFJLENBQU47T0FEYyxFQUVkO1FBQUUsRUFBQSxFQUFJLENBQU47T0FGYyxFQUdkO1FBQUUsRUFBQSxFQUFJLENBQU47T0FIYyxFQUlkO1FBQUUsRUFBQSxFQUFJLENBQU47T0FKYzs7SUFPaEIsSUFBaUMsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsQ0FBaEQ7YUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUI7UUFBRSxFQUFBLEVBQUksQ0FBQyxDQUFQO09BQW5CLEVBQUE7O0VBUmUsQ0FBakI7RUFVQSxrQkFBQSxFQUFvQixTQUFBO0FBQ2xCLFFBQUE7SUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFlBQ2QsQ0FBQyxHQURZLENBQ1IsU0FBQyxFQUFEO2FBQVEsRUFBRSxDQUFDO0lBQVgsQ0FEUSxDQUViLENBQUMsTUFGWSxDQUVMLFNBQUMsRUFBRDthQUFRLEVBQUEsSUFBTSxDQUFDO0lBQWYsQ0FGSztBQUlmO1NBQVMsdUZBQVQ7TUFDRSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFBLEdBQUk7TUFDaEIsQ0FBQSxHQUFJO0FBRUosV0FBQSw4REFBQTs7UUFDRSxHQUFBLEdBQU0sSUFBQyxDQUFBLFdBQVksQ0FBQSxDQUFBLEdBQUksQ0FBQyxJQUFDLENBQUEsYUFBRCxHQUFpQixLQUFsQixDQUFKO0FBRW5CLGdCQUFPLElBQVA7QUFBQSxlQUNPLENBQUMsQ0FEUjtZQUNlLENBQUEsR0FBSTtBQUFaO0FBRFAsZUFFTyxDQUZQO1lBRWMsQ0FBQSxHQUFJO0FBQVg7QUFGUCxlQUdPLENBSFA7WUFHYyxDQUFBLEdBQUk7QUFBWDtBQUhQLGVBSU8sQ0FKUDtZQUljLENBQUEsR0FBSTtBQUFYO0FBSlAsZUFLTyxDQUxQO1lBS2MsQ0FBQSxHQUFJO0FBTGxCO0FBSEY7TUFVQSxPQUFZLEtBQUssQ0FBQyxTQUFOLENBQWdCLEdBQUEsR0FBTSxDQUF0QixFQUF5QixHQUFBLEdBQU0sQ0FBL0IsRUFBa0MsR0FBQSxHQUFNLENBQXhDLEVBQTJDLEdBQUEsR0FBTSxDQUFqRCxDQUFaLEVBQUMsV0FBRCxFQUFJLFdBQUosRUFBTzttQkFDUCxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekI7QUFmRjs7RUFMa0IsQ0FWcEIifQ==

    },{"../color.coffee":3}],16:[function(require,module,exports){
        module.exports = {
            setGreyscaleChannels: function() {
                this.channelsInfo = [
                    {
                        id: 0
                    }
                ];
                if (this.channels() === 2) {
                    return this.channelsInfo.push({
                        id: -1
                    });
                }
            },
            combineGreyscaleChannel: function() {
                var alpha, grey, i, j, ref, results;
                results = [];
                for (i = j = 0, ref = this.numPixels; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    grey = this.channelData[i];
                    alpha = this.channels() === 2 ? this.channelData[this.channelLength + i] : 255;
                    results.push(this.pixelData.push(grey, grey, grey, alpha));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2Rlcy9ncmV5c2NhbGUuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2Rlcy9ncmV5c2NhbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxvQkFBQSxFQUFzQixTQUFBO0lBQ3BCLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQUM7UUFBQyxFQUFBLEVBQUksQ0FBTDtPQUFEOztJQUNoQixJQUErQixJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsS0FBZSxDQUE5QzthQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQjtRQUFDLEVBQUEsRUFBSSxDQUFDLENBQU47T0FBbkIsRUFBQTs7RUFGb0IsQ0FBdEI7RUFJQSx1QkFBQSxFQUF5QixTQUFBO0FBQ3ZCLFFBQUE7QUFBQTtTQUFTLHVGQUFUO01BQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQSxXQUFZLENBQUEsQ0FBQTtNQUNwQixLQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsQ0FBbEIsR0FDTixJQUFDLENBQUEsV0FBWSxDQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQWpCLENBRFAsR0FHTjttQkFFRixJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsS0FBbEM7QUFQRjs7RUFEdUIsQ0FKekIifQ==

    },{}],17:[function(require,module,exports){
        module.exports = {
            setRgbChannels: function() {
                this.channelsInfo = [
                    {
                        id: 0
                    }, {
                        id: 1
                    }, {
                        id: 2
                    }
                ];
                if (this.channels() === 4) {
                    return this.channelsInfo.push({
                        id: -1
                    });
                }
            },
            combineRgbChannel: function() {
                var a, b, chan, g, i, index, j, k, len, r, ref, results, rgbChannels, val;
                rgbChannels = this.channelsInfo.map(function(ch) {
                    return ch.id;
                }).filter(function(ch) {
                    return ch >= -1;
                });
                results = [];
                for (i = j = 0, ref = this.numPixels; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    r = g = b = 0;
                    a = 255;
                    for (index = k = 0, len = rgbChannels.length; k < len; index = ++k) {
                        chan = rgbChannels[index];
                        val = this.channelData[i + (this.channelLength * index)];
                        switch (chan) {
                            case -1:
                                a = val;
                                break;
                            case 0:
                                r = val;
                                break;
                            case 1:
                                g = val;
                                break;
                            case 2:
                                b = val;
                        }
                    }
                    results.push(this.pixelData.push(r, g, b, a));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2Rlcy9yZ2IuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9pbWFnZV9tb2Rlcy9yZ2IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxjQUFBLEVBQWdCLFNBQUE7SUFDZCxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNkO1FBQUMsRUFBQSxFQUFJLENBQUw7T0FEYyxFQUVkO1FBQUMsRUFBQSxFQUFJLENBQUw7T0FGYyxFQUdkO1FBQUMsRUFBQSxFQUFJLENBQUw7T0FIYzs7SUFNaEIsSUFBK0IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsQ0FBOUM7YUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUI7UUFBQyxFQUFBLEVBQUksQ0FBQyxDQUFOO09BQW5CLEVBQUE7O0VBUGMsQ0FBaEI7RUFTQSxpQkFBQSxFQUFtQixTQUFBO0FBQ2pCLFFBQUE7SUFBQSxXQUFBLEdBQWMsSUFBQyxDQUFBLFlBQ2IsQ0FBQyxHQURXLENBQ1AsU0FBQyxFQUFEO2FBQVEsRUFBRSxDQUFDO0lBQVgsQ0FETyxDQUVaLENBQUMsTUFGVyxDQUVKLFNBQUMsRUFBRDthQUFRLEVBQUEsSUFBTSxDQUFDO0lBQWYsQ0FGSTtBQUlkO1NBQVMsdUZBQVQ7TUFDRSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUEsR0FBSTtNQUNaLENBQUEsR0FBSTtBQUVKLFdBQUEsNkRBQUE7O1FBQ0UsR0FBQSxHQUFNLElBQUMsQ0FBQSxXQUFZLENBQUEsQ0FBQSxHQUFJLENBQUMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FBbEIsQ0FBSjtBQUVuQixnQkFBTyxJQUFQO0FBQUEsZUFDTyxDQUFDLENBRFI7WUFDZSxDQUFBLEdBQUk7QUFBWjtBQURQLGVBRU8sQ0FGUDtZQUVlLENBQUEsR0FBSTtBQUFaO0FBRlAsZUFHTyxDQUhQO1lBR2UsQ0FBQSxHQUFJO0FBQVo7QUFIUCxlQUlPLENBSlA7WUFJZSxDQUFBLEdBQUk7QUFKbkI7QUFIRjttQkFTQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekI7QUFiRjs7RUFMaUIsQ0FUbkIifQ==

    },{}],18:[function(require,module,exports){
        var Layer, Module,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        Module = require('coffeescript-module').Module;

        module.exports = Layer = (function(superClass) {
            extend(Layer, superClass);

            Layer.includes(require('./layer/position_channels.coffee'));

            Layer.includes(require('./layer/blend_modes.coffee'));

            Layer.includes(require('./layer/mask.coffee'));

            Layer.includes(require('./layer/blending_ranges.coffee'));

            Layer.includes(require('./layer/name.coffee'));

            Layer.includes(require('./layer/info.coffee'));

            Layer.includes(require('./layer/helpers.coffee'));

            Layer.includes(require('./layer/channel_image.coffee'));

            function Layer(file, header) {
                this.file = file;
                this.header = header;
                this.mask = {};
                this.blendingRanges = {};
                this.adjustments = {};
                this.channelsInfo = [];
                this.blendMode = {};
                this.groupLayer = null;
                this.infoKeys = [];
                Object.defineProperty(this, 'name', {
                    get: function() {
                        if (this.adjustments['name'] != null) {
                            return this.adjustments['name'].data;
                        } else {
                            return this.legacyName;
                        }
                    }
                });
            }

            Layer.prototype.parse = function() {
                var extraLen;
                this.parsePositionAndChannels();
                this.parseBlendModes();
                extraLen = this.file.readInt();
                this.layerEnd = this.file.tell() + extraLen;
                this.parseMaskData();
                this.parseBlendingRanges();
                this.parseLegacyLayerName();
                this.parseLayerInfo();
                this.file.seek(this.layerEnd);
                return this;
            };

            Layer.prototype["export"] = function() {
                return {
                    name: this.name,
                    top: this.top,
                    right: this.right,
                    bottom: this.bottom,
                    left: this.left,
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity,
                    visible: this.visible,
                    clipped: this.clipped,
                    mask: this.mask["export"]()
                };
            };

            return Layer;

        })(Module);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLGFBQUE7RUFBQTs7O0FBQUMsU0FBVSxPQUFBLENBQVEscUJBQVI7O0FBS1gsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUVyQixLQUFDLENBQUEsUUFBRCxDQUFVLE9BQUEsQ0FBUSxrQ0FBUixDQUFWOztFQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsT0FBQSxDQUFRLDRCQUFSLENBQVY7O0VBQ0EsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFBLENBQVEscUJBQVIsQ0FBVjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLE9BQUEsQ0FBUSxnQ0FBUixDQUFWOztFQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsT0FBQSxDQUFRLHFCQUFSLENBQVY7O0VBQ0EsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFBLENBQVEscUJBQVIsQ0FBVjs7RUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLE9BQUEsQ0FBUSx3QkFBUixDQUFWOztFQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsT0FBQSxDQUFRLDhCQUFSLENBQVY7O0VBRWEsZUFBQyxJQUFELEVBQVEsTUFBUjtJQUFDLElBQUMsQ0FBQSxPQUFEO0lBQU8sSUFBQyxDQUFBLFNBQUQ7SUFDbkIsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUNSLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUVkLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFJWixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUF5QixNQUF6QixFQUNFO01BQUEsR0FBQSxFQUFLLFNBQUE7UUFDSCxJQUFHLGdDQUFIO2lCQUNFLElBQUMsQ0FBQSxXQUFZLENBQUEsTUFBQSxDQUFPLENBQUMsS0FEdkI7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxXQUhIOztNQURHLENBQUw7S0FERjtFQVpXOztrQkFxQmIsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsSUFBQyxDQUFBLHdCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBRUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ1gsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxDQUFBLEdBQWU7SUFFM0IsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLG9CQUFELENBQUE7SUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLFFBQVo7QUFDQSxXQUFPO0VBYkY7O21CQWVQLFFBQUEsR0FBUSxTQUFBO1dBQ047TUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQVA7TUFDQSxHQUFBLEVBQUssSUFBQyxDQUFBLEdBRE47TUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBRlI7TUFHQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BSFQ7TUFJQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBSlA7TUFLQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBTFI7TUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BTlQ7TUFPQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BUFY7TUFRQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BUlY7TUFTQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BVFY7TUFVQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQUksRUFBQyxNQUFELEVBQUwsQ0FBQSxDQVZOOztFQURNOzs7O0dBL0MyQiJ9

    },{"./layer/blend_modes.coffee":19,"./layer/blending_ranges.coffee":20,"./layer/channel_image.coffee":21,"./layer/helpers.coffee":22,"./layer/info.coffee":23,"./layer/mask.coffee":24,"./layer/name.coffee":25,"./layer/position_channels.coffee":26,"coffeescript-module":82}],19:[function(require,module,exports){
        var BlendMode;

        BlendMode = require('../blend_mode.coffee');

        module.exports = {
            parseBlendModes: function() {
                this.blendMode = new BlendMode(this.file);
                this.blendMode.parse();
                this.opacity = this.blendMode.opacity;
                this.visible = this.blendMode.visible;
                return this.clipped = this.blendMode.clipped;
            },
            hidden: function() {
                return !this.visible;
            },
            blendingMode: function() {
                return this.blendMode.mode;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9ibGVuZF9tb2Rlcy5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyL2JsZW5kX21vZGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBRVosTUFBTSxDQUFDLE9BQVAsR0FLRTtFQUFBLGVBQUEsRUFBaUIsU0FBQTtJQUNmLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxTQUFKLENBQWMsSUFBQyxDQUFBLElBQWY7SUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQTtJQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLFNBQVMsQ0FBQztJQUN0QixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxTQUFTLENBQUM7V0FDdEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsU0FBUyxDQUFDO0VBTlAsQ0FBakI7RUFRQSxNQUFBLEVBQVEsU0FBQTtXQUFHLENBQUksSUFBQyxDQUFBO0VBQVIsQ0FSUjtFQVdBLFlBQUEsRUFBYyxTQUFBO1dBQ1osSUFBQyxDQUFBLFNBQVMsQ0FBQztFQURDLENBWGQifQ==

    },{"../blend_mode.coffee":1}],20:[function(require,module,exports){
        module.exports = {
            parseBlendingRanges: function() {
                var i, j, length, numChannels, ref, results;
                length = this.file.readInt();
                this.blendingRanges.grey = {
                    source: {
                        black: [this.file.readByte(), this.file.readByte()],
                        white: [this.file.readByte(), this.file.readByte()]
                    },
                    dest: {
                        black: [this.file.readByte(), this.file.readByte()],
                        white: [this.file.readByte(), this.file.readByte()]
                    }
                };
                numChannels = (length - 8) / 8;
                this.blendingRanges.channels = [];
                results = [];
                for (i = j = 0, ref = numChannels; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    results.push(this.blendingRanges.channels.push({
                        source: {
                            black: [this.file.readByte(), this.file.readByte()],
                            white: [this.file.readByte(), this.file.readByte()]
                        },
                        dest: {
                            black: [this.file.readByte(), this.file.readByte()],
                            white: [this.file.readByte(), this.file.readByte()]
                        }
                    }));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9ibGVuZGluZ19yYW5nZXMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9ibGVuZGluZ19yYW5nZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBSUU7RUFBQSxtQkFBQSxFQUFxQixTQUFBO0FBQ25CLFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFFVCxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFELEVBQW1CLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQW5CLENBQVA7UUFDQSxLQUFBLEVBQU8sQ0FBQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFELEVBQW1CLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQW5CLENBRFA7T0FERjtNQUdBLElBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQUQsRUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBbkIsQ0FBUDtRQUNBLEtBQUEsRUFBTyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQUQsRUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBbkIsQ0FEUDtPQUpGOztJQU9GLFdBQUEsR0FBYyxDQUFDLE1BQUEsR0FBUyxDQUFWLENBQUEsR0FBZTtJQUU3QixJQUFDLENBQUEsY0FBYyxDQUFDLFFBQWhCLEdBQTJCO0FBQzNCO1NBQVMsb0ZBQVQ7bUJBQ0UsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBekIsQ0FDRTtRQUFBLE1BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQUQsRUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBbkIsQ0FBUDtVQUNBLEtBQUEsRUFBTyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQUQsRUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBbkIsQ0FEUDtTQURGO1FBR0EsSUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBRCxFQUFtQixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFuQixDQUFQO1VBQ0EsS0FBQSxFQUFPLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBRCxFQUFtQixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFuQixDQURQO1NBSkY7T0FERjtBQURGOztFQWRtQixDQUFyQiJ9

    },{}],21:[function(require,module,exports){
        var ChannelImage, LazyExecute;

        ChannelImage = require('../channel_image.coffee');

        LazyExecute = require('../lazy_execute.coffee');

        module.exports = {
            parseChannelImage: function() {
                var image;
                image = new ChannelImage(this.file, this.header, this);
                return this.image = new LazyExecute(image, this.file).now('skip').later('parse').get();
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9jaGFubmVsX2ltYWdlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXIvY2hhbm5lbF9pbWFnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHlCQUFSOztBQUNmLFdBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVI7O0FBRWYsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLGlCQUFBLEVBQW1CLFNBQUE7QUFDakIsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFJLFlBQUosQ0FBaUIsSUFBQyxDQUFBLElBQWxCLEVBQXdCLElBQUMsQ0FBQSxNQUF6QixFQUFpQyxJQUFqQztXQUNSLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxXQUFKLENBQWdCLEtBQWhCLEVBQXVCLElBQUMsQ0FBQSxJQUF4QixDQUNQLENBQUMsR0FETSxDQUNGLE1BREUsQ0FFUCxDQUFDLEtBRk0sQ0FFQSxPQUZBLENBR1AsQ0FBQyxHQUhNLENBQUE7RUFGUSxDQUFuQiJ9

    },{"../channel_image.coffee":2,"../lazy_execute.coffee":49}],22:[function(require,module,exports){
        module.exports = {
            isFolder: function() {
                if (this.adjustments['sectionDivider'] != null) {
                    return this.adjustments['sectionDivider'].isFolder;
                } else if (this.adjustments['nestedSectionDivider'] != null) {
                    return this.adjustments['nestedSectionDivider'].isFolder;
                } else {
                    return this.name === "<Layer group>";
                }
            },
            isFolderEnd: function() {
                if (this.adjustments['sectionDivider'] != null) {
                    return this.adjustments['sectionDivider'].isHidden;
                } else if (this.adjustments['nestedSectionDivider'] != null) {
                    return this.adjustments['nestedSectionDivider'].isHidden;
                } else {
                    return this.name === "</Layer group>";
                }
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9oZWxwZXJzLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXIvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLFFBQUEsRUFBVSxTQUFBO0lBQ1IsSUFBRywwQ0FBSDthQUNFLElBQUMsQ0FBQSxXQUFZLENBQUEsZ0JBQUEsQ0FBaUIsQ0FBQyxTQURqQztLQUFBLE1BRUssSUFBRyxnREFBSDthQUNILElBQUMsQ0FBQSxXQUFZLENBQUEsc0JBQUEsQ0FBdUIsQ0FBQyxTQURsQztLQUFBLE1BQUE7YUFHSCxJQUFDLENBQUEsSUFBRCxLQUFTLGdCQUhOOztFQUhHLENBQVY7RUFRQSxXQUFBLEVBQWEsU0FBQTtJQUNYLElBQUcsMENBQUg7YUFDRSxJQUFDLENBQUEsV0FBWSxDQUFBLGdCQUFBLENBQWlCLENBQUMsU0FEakM7S0FBQSxNQUVLLElBQUcsZ0RBQUg7YUFDSCxJQUFDLENBQUEsV0FBWSxDQUFBLHNCQUFBLENBQXVCLENBQUMsU0FEbEM7S0FBQSxNQUFBO2FBR0gsSUFBQyxDQUFBLElBQUQsS0FBUyxpQkFITjs7RUFITSxDQVJiIn0=

    },{}],23:[function(require,module,exports){
        var LAYER_INFO, LazyExecute, Util,
            hasProp = {}.hasOwnProperty;

        LazyExecute = require('../lazy_execute.coffee');

        Util = require('../util.coffee');

        LAYER_INFO = {
            artboard: require('../layer_info/artboard.coffee'),
            blendClippingElements: require('../layer_info/blend_clipping_elements.coffee'),
            blendInteriorElements: require('../layer_info/blend_interior_elements.coffee'),
            fillOpacity: require('../layer_info/fill_opacity.coffee'),
            gradientFill: require('../layer_info/gradient_fill.coffee'),
            layerId: require('../layer_info/layer_id.coffee'),
            layerNameSource: require('../layer_info/layer_name_source.coffee'),
            legacyTypetool: require('../layer_info/legacy_typetool.coffee'),
            locked: require('../layer_info/locked.coffee'),
            metadata: require('../layer_info/metadata.coffee'),
            name: require('../layer_info/unicode_name.coffee'),
            nestedSectionDivider: require('../layer_info/nested_section_divider.coffee'),
            objectEffects: require('../layer_info/object_effects.coffee'),
            sectionDivider: require('../layer_info/section_divider.coffee'),
            solidColor: require('../layer_info/solid_color.coffee'),
            typeTool: require('../layer_info/typetool.coffee'),
            vectorMask: require('../layer_info/vector_mask.coffee'),
            vectorOrigination: require('../layer_info/vector_origination.coffee'),
            vectorStroke: require('../layer_info/vector_stroke.coffee'),
            vectorStrokeContent: require('../layer_info/vector_stroke_content.coffee')
        };

        module.exports = {
            parseLayerInfo: function() {
                var i, key, keyParseable, klass, length, name, pos, results;
                results = [];
                while (this.file.tell() < this.layerEnd) {
                    this.file.seek(4, true);
                    key = this.file.readString(4);
                    length = Util.pad2(this.file.readInt());
                    pos = this.file.tell();
                    keyParseable = false;
                    for (name in LAYER_INFO) {
                        if (!hasProp.call(LAYER_INFO, name)) continue;
                        klass = LAYER_INFO[name];
                        if (!klass.shouldParse(key)) {
                            continue;
                        }
                        i = new klass(this, length);
                        this.adjustments[name] = new LazyExecute(i, this.file).now('skip').later('parse').get();
                        if (this[name] == null) {
                            (function(_this) {
                                return (function(name) {
                                    return _this[name] = function() {
                                        return _this.adjustments[name];
                                    };
                                });
                            })(this)(name);
                        }
                        this.infoKeys.push(key);
                        keyParseable = true;
                        break;
                    }
                    if (!keyParseable) {
                        results.push(this.file.seek(length, true));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9pbmZvLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXIvaW5mby5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSw2QkFBQTtFQUFBOztBQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVI7O0FBQ2QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxnQkFBUjs7QUFlUCxVQUFBLEdBQWE7RUFDWCxRQUFBLEVBQXdCLE9BQUEsQ0FBUSwrQkFBUixDQURiO0VBRVgscUJBQUEsRUFBd0IsT0FBQSxDQUFRLDhDQUFSLENBRmI7RUFHWCxxQkFBQSxFQUF3QixPQUFBLENBQVEsOENBQVIsQ0FIYjtFQUlYLFdBQUEsRUFBd0IsT0FBQSxDQUFRLG1DQUFSLENBSmI7RUFLWCxZQUFBLEVBQXdCLE9BQUEsQ0FBUSxvQ0FBUixDQUxiO0VBTVgsT0FBQSxFQUF3QixPQUFBLENBQVEsK0JBQVIsQ0FOYjtFQU9YLGVBQUEsRUFBd0IsT0FBQSxDQUFRLHdDQUFSLENBUGI7RUFRWCxjQUFBLEVBQXdCLE9BQUEsQ0FBUSxzQ0FBUixDQVJiO0VBU1gsTUFBQSxFQUF3QixPQUFBLENBQVEsNkJBQVIsQ0FUYjtFQVVYLFFBQUEsRUFBd0IsT0FBQSxDQUFRLCtCQUFSLENBVmI7RUFXWCxJQUFBLEVBQXdCLE9BQUEsQ0FBUSxtQ0FBUixDQVhiO0VBWVgsb0JBQUEsRUFBd0IsT0FBQSxDQUFRLDZDQUFSLENBWmI7RUFhWCxhQUFBLEVBQXdCLE9BQUEsQ0FBUSxxQ0FBUixDQWJiO0VBY1gsY0FBQSxFQUF3QixPQUFBLENBQVEsc0NBQVIsQ0FkYjtFQWVYLFVBQUEsRUFBd0IsT0FBQSxDQUFRLGtDQUFSLENBZmI7RUFnQlgsUUFBQSxFQUF3QixPQUFBLENBQVEsK0JBQVIsQ0FoQmI7RUFpQlgsVUFBQSxFQUF3QixPQUFBLENBQVEsa0NBQVIsQ0FqQmI7RUFrQlgsaUJBQUEsRUFBd0IsT0FBQSxDQUFRLHlDQUFSLENBbEJiO0VBbUJYLFlBQUEsRUFBd0IsT0FBQSxDQUFRLG9DQUFSLENBbkJiO0VBb0JYLG1CQUFBLEVBQXdCLE9BQUEsQ0FBUSw0Q0FBUixDQXBCYjs7O0FBdUJiLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxjQUFBLEVBQWdCLFNBQUE7QUFHZCxRQUFBO0FBQUE7V0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxDQUFBLEdBQWUsSUFBQyxDQUFBLFFBQXRCO01BQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7TUFHQSxHQUFBLEdBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLENBQWpCO01BQ04sTUFBQSxHQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBVjtNQUNULEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQTtNQUVOLFlBQUEsR0FBZTtBQUNmLFdBQUEsa0JBQUE7OztRQUNFLElBQUEsQ0FBZ0IsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsR0FBbEIsQ0FBaEI7QUFBQSxtQkFBQTs7UUFLQSxDQUFBLEdBQUksSUFBSSxLQUFKLENBQVUsSUFBVixFQUFhLE1BQWI7UUFDSixJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBYixHQUFxQixJQUFJLFdBQUosQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBQyxDQUFBLElBQXBCLENBQ25CLENBQUMsR0FEa0IsQ0FDZCxNQURjLENBRW5CLENBQUMsS0FGa0IsQ0FFWixPQUZZLENBR25CLENBQUMsR0FIa0IsQ0FBQTtRQU1yQixJQUFPLGtCQUFQO1VBQ0ssQ0FBQSxTQUFBLEtBQUE7bUJBQUEsQ0FBQSxTQUFDLElBQUQ7cUJBQVUsS0FBRSxDQUFBLElBQUEsQ0FBRixHQUFVLFNBQUE7dUJBQUcsS0FBQyxDQUFBLFdBQVksQ0FBQSxJQUFBO2NBQWhCO1lBQXBCLENBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUgsQ0FBSSxJQUFKLEVBREY7O1FBSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsR0FBZjtRQUNBLFlBQUEsR0FBZTtBQUNmO0FBbkJGO01BdUJBLElBQTJCLENBQUksWUFBL0I7cUJBQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsTUFBWCxFQUFtQixJQUFuQixHQUFBO09BQUEsTUFBQTs2QkFBQTs7SUFoQ0YsQ0FBQTs7RUFIYyxDQUFoQiJ9

    },{"../layer_info/artboard.coffee":28,"../layer_info/blend_clipping_elements.coffee":29,"../layer_info/blend_interior_elements.coffee":30,"../layer_info/fill_opacity.coffee":31,"../layer_info/gradient_fill.coffee":32,"../layer_info/layer_id.coffee":33,"../layer_info/layer_name_source.coffee":34,"../layer_info/legacy_typetool.coffee":35,"../layer_info/locked.coffee":36,"../layer_info/metadata.coffee":37,"../layer_info/nested_section_divider.coffee":38,"../layer_info/object_effects.coffee":39,"../layer_info/section_divider.coffee":40,"../layer_info/solid_color.coffee":41,"../layer_info/typetool.coffee":42,"../layer_info/unicode_name.coffee":43,"../layer_info/vector_mask.coffee":44,"../layer_info/vector_origination.coffee":45,"../layer_info/vector_stroke.coffee":46,"../layer_info/vector_stroke_content.coffee":47,"../lazy_execute.coffee":49,"../util.coffee":63}],24:[function(require,module,exports){
        var Mask;

        Mask = require('../mask.coffee');

        module.exports = {
            parseMaskData: function() {
                return this.mask = new Mask(this.file).parse();
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9tYXNrLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXIvbWFzay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGdCQUFSOztBQUVQLE1BQU0sQ0FBQyxPQUFQLEdBSUU7RUFBQSxhQUFBLEVBQWUsU0FBQTtXQUNiLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxJQUFKLENBQVMsSUFBQyxDQUFBLElBQVYsQ0FBZSxDQUFDLEtBQWhCLENBQUE7RUFESyxDQUFmIn0=

    },{"../mask.coffee":50}],25:[function(require,module,exports){
        var Util;

        Util = require('../util.coffee');

        module.exports = {
            parseLegacyLayerName: function() {
                var len;
                len = Util.pad4(this.file.readByte());
                return this.legacyName = this.file.readString(len);
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9uYW1lLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXIvbmFtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGdCQUFSOztBQUVQLE1BQU0sQ0FBQyxPQUFQLEdBT0U7RUFBQSxvQkFBQSxFQUFzQixTQUFBO0FBQ3BCLFFBQUE7SUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFWO1dBQ04sSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsR0FBakI7RUFGTSxDQUF0QiJ9

    },{"../util.coffee":63}],26:[function(require,module,exports){
        module.exports = {
            parsePositionAndChannels: function() {
                var i, id, j, length, ref, results;
                this.top = this.file.readInt();
                this.left = this.file.readInt();
                this.bottom = this.file.readInt();
                this.right = this.file.readInt();
                this.channels = this.file.readShort();
                this.rows = this.height = this.bottom - this.top;
                this.cols = this.width = this.right - this.left;
                results = [];
                for (i = j = 0, ref = this.channels; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    id = this.file.readShort();
                    length = this.file.readInt();
                    results.push(this.channelsInfo.push({
                        id: id,
                        length: length
                    }));
                }
                return results;
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllci9wb3NpdGlvbl9jaGFubmVscy5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyL3Bvc2l0aW9uX2NoYW5uZWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBUCxHQUlFO0VBQUEsd0JBQUEsRUFBMEIsU0FBQTtBQUN4QixRQUFBO0lBQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUNQLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUNULElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7SUFFWixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUE7SUFDN0IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBO0FBSzNCO1NBQVMsc0ZBQVQ7TUFDRSxFQUFBLEdBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7TUFDTCxNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7bUJBRVQsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CO1FBQUEsRUFBQSxFQUFJLEVBQUo7UUFBUSxNQUFBLEVBQVEsTUFBaEI7T0FBbkI7QUFKRjs7RUFid0IsQ0FBMUIifQ==

    },{}],27:[function(require,module,exports){
        var LayerInfo;

        module.exports = LayerInfo = (function() {
            function LayerInfo(layer, length) {
                this.layer = layer;
                this.length = length;
                this.file = this.layer.file;
                this.section_end = this.file.tell() + this.length;
                this.data = {};
            }

            LayerInfo.prototype.skip = function() {
                return this.file.seek(this.section_end);
            };

            LayerInfo.prototype.parse = function() {
                return this.skip();
            };

            return LayerInfo;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNSLG1CQUFDLEtBQUQsRUFBUyxNQUFUO0lBQUMsSUFBQyxDQUFBLFFBQUQ7SUFBUSxJQUFDLENBQUEsU0FBRDtJQUNwQixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFDZixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLENBQUEsR0FBZSxJQUFDLENBQUE7SUFDL0IsSUFBQyxDQUFBLElBQUQsR0FBUTtFQUhHOztzQkFLYixJQUFBLEdBQU0sU0FBQTtXQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxXQUFaO0VBQUg7O3NCQUNOLEtBQUEsR0FBTyxTQUFBO1dBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtFQUFIIn0=

    },{}],28:[function(require,module,exports){
        var Artboard, Descriptor, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = Artboard = (function(superClass) {
            extend(Artboard, superClass);

            function Artboard() {
                return Artboard.__super__.constructor.apply(this, arguments);
            }

            Artboard.shouldParse = function(key) {
                return key === 'artb';
            };

            Artboard.prototype.parse = function() {
                this.file.seek(4, true);
                return this.data = new Descriptor(this.file).parse();
            };

            Artboard.prototype["export"] = function() {
                return {
                    coords: {
                        left: this.data.artboardRect['Left'],
                        top: this.data.artboardRect['Top '],
                        right: this.data.artboardRect['Rght'],
                        bottom: this.data.artboardRect['Btom']
                    }
                };
            };

            return Artboard;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2FydGJvYXJkLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9hcnRib2FyZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwrQkFBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVI7O0FBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7RUFDckIsUUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O3FCQUVkLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7V0FDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLEtBQXRCLENBQUE7RUFGSDs7c0JBSVAsUUFBQSxHQUFRLFNBQUE7V0FDTjtNQUFBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsSUFBSSxDQUFDLFlBQWEsQ0FBQSxNQUFBLENBQXpCO1FBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBYSxDQUFBLE1BQUEsQ0FEeEI7UUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFhLENBQUEsTUFBQSxDQUYxQjtRQUdBLE1BQUEsRUFBUSxJQUFDLENBQUEsSUFBSSxDQUFDLFlBQWEsQ0FBQSxNQUFBLENBSDNCO09BREY7O0VBRE07Ozs7R0FQOEIifQ==

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],29:[function(require,module,exports){
        var BlendClippingElements, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = BlendClippingElements = (function(superClass) {
            extend(BlendClippingElements, superClass);

            function BlendClippingElements() {
                return BlendClippingElements.__super__.constructor.apply(this, arguments);
            }

            BlendClippingElements.shouldParse = function(key) {
                return key === 'clbl';
            };

            BlendClippingElements.prototype.parse = function() {
                this.enabled = this.file.readBoolean();
                return this.file.seek(3, true);
            };

            return BlendClippingElements;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2JsZW5kX2NsaXBwaW5nX2VsZW1lbnRzLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9ibGVuZF9jbGlwcGluZ19lbGVtZW50cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxnQ0FBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLHFCQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7a0NBRWQsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFBO1dBQ1gsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7RUFGSzs7OztHQUg0QyJ9

    },{"../layer_info.coffee":27}],30:[function(require,module,exports){
        var BlendInteriorElements, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = BlendInteriorElements = (function(superClass) {
            extend(BlendInteriorElements, superClass);

            function BlendInteriorElements() {
                return BlendInteriorElements.__super__.constructor.apply(this, arguments);
            }

            BlendInteriorElements.shouldParse = function(key) {
                return key === 'infx';
            };

            BlendInteriorElements.prototype.parse = function() {
                this.enabled = this.file.readBoolean();
                return this.file.seek(3, true);
            };

            return BlendInteriorElements;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2JsZW5kX2ludGVyaW9yX2VsZW1lbnRzLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9ibGVuZF9pbnRlcmlvcl9lbGVtZW50cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxnQ0FBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLHFCQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7a0NBRWQsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFBO1dBQ1gsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7RUFGSzs7OztHQUg0QyJ9

    },{"../layer_info.coffee":27}],31:[function(require,module,exports){
        var FillOpacity, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = FillOpacity = (function(superClass) {
            extend(FillOpacity, superClass);

            function FillOpacity() {
                return FillOpacity.__super__.constructor.apply(this, arguments);
            }

            FillOpacity.shouldParse = function(key) {
                return key === 'iOpa';
            };

            FillOpacity.prototype.parse = function() {
                return this.value = this.file.readByte();
            };

            return FillOpacity;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2ZpbGxfb3BhY2l0eS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vZmlsbF9vcGFjaXR5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHNCQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBRVosTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7RUFDckIsV0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O3dCQUVkLEtBQUEsR0FBTyxTQUFBO1dBQ0wsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQTtFQURKOzs7O0dBSGtDIn0=

    },{"../layer_info.coffee":27}],32:[function(require,module,exports){
        var Descriptor, GradientFill, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = GradientFill = (function(superClass) {
            extend(GradientFill, superClass);

            function GradientFill() {
                return GradientFill.__super__.constructor.apply(this, arguments);
            }

            GradientFill.shouldParse = function(key) {
                return key === 'GdFl';
            };

            GradientFill.prototype.parse = function() {
                this.file.seek(4, true);
                return this.data = new Descriptor(this.file).parse();
            };

            return GradientFill;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2dyYWRpZW50X2ZpbGwuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2dyYWRpZW50X2ZpbGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsbUNBQUE7RUFBQTs7O0FBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUjs7QUFDWixVQUFBLEdBQWEsT0FBQSxDQUFRLHNCQUFSOztBQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQVMsR0FBQSxLQUFPO0VBQWhCOzt5QkFFZCxLQUFBLEdBQU8sU0FBQTtJQUNMLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO1dBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLFVBQUosQ0FBZSxJQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxLQUF0QixDQUFBO0VBRkg7Ozs7R0FIbUMifQ==

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],33:[function(require,module,exports){
        var LayerId, LayerInfo,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = LayerId = (function(superClass) {
            extend(LayerId, superClass);

            function LayerId() {
                return LayerId.__super__.constructor.apply(this, arguments);
            }

            LayerId.shouldParse = function(key) {
                return key === 'lyid';
            };

            LayerId.prototype.parse = function() {
                return this.id = this.file.readInt();
            };

            return LayerId;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2xheWVyX2lkLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9sYXllcl9pZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxrQkFBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLE9BQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQVMsR0FBQSxLQUFPO0VBQWhCOztvQkFFZCxLQUFBLEdBQU8sU0FBQTtXQUNMLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7RUFERDs7OztHQUg4QiJ9

    },{"../layer_info.coffee":27}],34:[function(require,module,exports){
        var LayerInfo, LayerNameSource,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = LayerNameSource = (function(superClass) {
            extend(LayerNameSource, superClass);

            function LayerNameSource() {
                return LayerNameSource.__super__.constructor.apply(this, arguments);
            }

            LayerNameSource.shouldParse = function(key) {
                return key === 'lnsr';
            };

            LayerNameSource.prototype.parse = function() {
                return this.id = this.file.readString(4);
            };

            return LayerNameSource;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2xheWVyX25hbWVfc291cmNlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9sYXllcl9uYW1lX3NvdXJjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwwQkFBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLGVBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQVMsR0FBQSxLQUFPO0VBQWhCOzs0QkFFZCxLQUFBLEdBQU8sU0FBQTtXQUNMLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLENBQWpCO0VBREQ7Ozs7R0FIc0MifQ==

    },{"../layer_info.coffee":27}],35:[function(require,module,exports){
        var LegacyTypeTool, TypeTool, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        TypeTool = require('./typetool.coffee');

        module.exports = LegacyTypeTool = (function(superClass) {
            extend(LegacyTypeTool, superClass);

            LegacyTypeTool.shouldParse = function(key) {
                return key === 'tySh';
            };

            function LegacyTypeTool(layer, length) {
                LegacyTypeTool.__super__.constructor.call(this, layer, length);
                this.transform = {};
                this.faces = [];
                this.styles = [];
                this.lines = [];
                this.type = 0;
                this.scalingFactor = 0;
                this.characterCount = 0;
                this.horzPlace = 0;
                this.vertPlace = 0;
                this.selectStart = 0;
                this.selectEnd = 0;
                this.color = null;
                this.antialias = null;
            }

            LegacyTypeTool.prototype.parse = function() {
                var facesCount, i, k, l, linesCount, m, ref, ref1, ref2, stylesCount;
                this.file.seek(2, true);
                this.parseTransformInfo();
                this.file.seek(2, true);
                facesCount = this.file.readShort();
                for (i = k = 0, ref = facesCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                    this.faces.push(_({}).tap((function(_this) {
                        return function(face) {
                            var j, l, ref1, results;
                            face.mark = _this.file.readShort();
                            face.fontType = _this.file.readInt();
                            face.fontName = _this.file.readString();
                            face.fontFamilyName = _this.file.readString();
                            face.fontStyleName = _this.file.readString();
                            face.script = _this.file.readShort();
                            face.numberAxesVector = _this.file.readInt();
                            face.vector = [];
                            results = [];
                            for (j = l = 0, ref1 = face.numberAxesVector; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
                                results.push(face.vector.push(_this.file.readInt()));
                            }
                            return results;
                        };
                    })(this)));
                }
                stylesCount = this.file.readShort();
                for (i = l = 0, ref1 = stylesCount; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
                    this.styles.push(_({}).tap((function(_this) {
                        return function(style) {
                            style.mark = _this.file.readShort();
                            style.faceMark = _this.file.readShort();
                            style.size = _this.file.readInt();
                            style.tracking = _this.file.readInt();
                            style.kerning = _this.file.readInt();
                            style.leading = _this.file.readInt();
                            style.baseShift = _this.file.readInt();
                            style.autoKern = _this.file.readBoolean();
                            _this.file.seek(1, true);
                            return style.rotate = _this.file.readBoolean();
                        };
                    })(this)));
                }
                this.type = this.file.readShort();
                this.scalingFactor = this.file.readInt();
                this.characterCount = this.file.readInt();
                this.horzPlace = this.file.readInt();
                this.vertPlace = this.file.readInt();
                this.selectStart = this.file.readInt();
                this.selectEnd = this.file.readInt();
                linesCount = this.file.readShort();
                for (i = m = 0, ref2 = linesCount; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
                    this.lines.push(_({}).tap(function(line) {
                        line.charCount = this.file.readInt();
                        line.orientation = this.file.readShort();
                        line.alignment = this.file.readShort();
                        line.actualChar = this.file.readShort();
                        return line.style = this.file.readShort();
                    }));
                }
                this.color = this.file.readSpaceColor();
                return this.antialias = this.file.readBoolean();
            };

            return LegacyTypeTool;

        })(TypeTool);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2xlZ2FjeV90eXBldG9vbC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vbGVnYWN5X3R5cGV0b29sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLDJCQUFBO0VBQUE7OztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztBQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7RUFDckIsY0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O0VBRUQsd0JBQUMsS0FBRCxFQUFRLE1BQVI7SUFDWCxnREFBTSxLQUFOLEVBQWEsTUFBYjtJQUVBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsSUFBRCxHQUFRO0lBQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsU0FBRCxHQUFhO0VBZkY7OzJCQWlCYixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtJQUNB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

    },{"./typetool.coffee":42,"lodash":109}],36:[function(require,module,exports){
        var LayerInfo, Locked,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = Locked = (function(superClass) {
            extend(Locked, superClass);

            Locked.shouldParse = function(key) {
                return key === 'lspf';
            };

            function Locked(layer, length) {
                Locked.__super__.constructor.call(this, layer, length);
                this.transparencyLocked = false;
                this.compositeLocked = false;
                this.positionLocked = false;
                this.allLocked = false;
            }

            Locked.prototype.parse = function() {
                var locked;
                locked = this.file.readInt();
                this.transparencyLocked = (locked & (0x01 << 0)) > 0 || locked === -2147483648;
                this.compositeLocked = (locked & (0x01 << 1)) > 0 || locked === -2147483648;
                this.positionLocked = (locked & (0x01 << 2)) > 0 || locked === -2147483648;
                return this.allLocked = this.transparencyLocked && this.compositeLocked && this.positionLocked;
            };

            return Locked;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL2xvY2tlZC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vbG9ja2VkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLGlCQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBRVosTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNyQixNQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7RUFFRCxnQkFBQyxLQUFELEVBQVEsTUFBUjtJQUNYLHdDQUFNLEtBQU4sRUFBYSxNQUFiO0lBRUEsSUFBQyxDQUFBLGtCQUFELEdBQXNCO0lBQ3RCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxTQUFELEdBQWE7RUFORjs7bUJBUWIsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBRVQsSUFBQyxDQUFBLGtCQUFELEdBQXNCLENBQUMsTUFBQSxHQUFTLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBVixDQUFBLEdBQXlCLENBQXpCLElBQThCLE1BQUEsS0FBVSxDQUFDO0lBQy9ELElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUMsTUFBQSxHQUFTLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBVixDQUFBLEdBQXlCLENBQXpCLElBQThCLE1BQUEsS0FBVSxDQUFDO0lBQzVELElBQUMsQ0FBQSxjQUFELEdBQWtCLENBQUMsTUFBQSxHQUFTLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBVixDQUFBLEdBQXlCLENBQXpCLElBQThCLE1BQUEsS0FBVSxDQUFDO1dBRTNELElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLGtCQUFELElBQXdCLElBQUMsQ0FBQSxlQUF6QixJQUE2QyxJQUFDLENBQUE7RUFQdEQ7Ozs7R0FYNkIifQ==

    },{"../layer_info.coffee":27}],37:[function(require,module,exports){
        var Descriptor, LayerInfo, Metadata,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = Metadata = (function(superClass) {
            extend(Metadata, superClass);

            function Metadata() {
                return Metadata.__super__.constructor.apply(this, arguments);
            }

            Metadata.shouldParse = function(key) {
                return key === 'shmd';
            };

            Metadata.prototype.parse = function() {
                var copyOnSheetDup, count, end, i, j, key, len, ref, results;
                count = this.file.readInt();
                results = [];
                for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    this.file.seek(4, true);
                    key = this.file.readString(4);
                    copyOnSheetDup = this.file.readByte();
                    this.file.seek(3, true);
                    len = this.file.readInt();
                    end = this.file.tell() + len;
                    if (key === 'cmls') {
                        this.parseLayerComps();
                    }
                    results.push(this.file.seek(end));
                }
                return results;
            };

            Metadata.prototype.parseLayerComps = function() {
                this.file.seek(4, true);
                return this.data.layerComp = new Descriptor(this.file).parse();
            };

            return Metadata;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL21ldGFkYXRhLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9tZXRhZGF0YS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwrQkFBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVI7O0FBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7RUFDckIsUUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O3FCQUVkLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtBQUVSO1NBQVMsOEVBQVQ7TUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtNQUVBLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsQ0FBakI7TUFFTixjQUFBLEdBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO01BQ2pCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO01BRUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO01BQ04sR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLENBQUEsR0FBZTtNQUVyQixJQUFzQixHQUFBLEtBQU8sTUFBN0I7UUFBQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBQUE7O21CQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEdBQVg7QUFiRjs7RUFISzs7cUJBa0JQLGVBQUEsR0FBaUIsU0FBQTtJQUNmLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO1dBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLEtBQXRCLENBQUE7RUFGSDs7OztHQXJCcUIifQ==

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],38:[function(require,module,exports){
        var LayerInfo, NestedSectionDivider,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = NestedSectionDivider = (function(superClass) {
            extend(NestedSectionDivider, superClass);

            NestedSectionDivider.shouldParse = function(key) {
                return key === 'lsdk';
            };

            function NestedSectionDivider(layer, length) {
                NestedSectionDivider.__super__.constructor.call(this, layer, length);
                this.isFolder = false;
                this.isHidden = false;
            }

            NestedSectionDivider.prototype.parse = function() {
                var code;
                code = this.file.readInt();
                switch (code) {
                    case 1:
                    case 2:
                        return this.isFolder = true;
                    case 3:
                        return this.isHidden = true;
                }
            };

            return NestedSectionDivider;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL25lc3RlZF9zZWN0aW9uX2RpdmlkZXIuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL25lc3RlZF9zZWN0aW9uX2RpdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsK0JBQUE7RUFBQTs7O0FBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUjs7QUFPWixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7O0VBQ3JCLG9CQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7RUFFRCw4QkFBQyxLQUFELEVBQVEsTUFBUjtJQUNYLHNEQUFNLEtBQU4sRUFBYSxNQUFiO0lBRUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7RUFKRDs7aUNBTWIsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0FBRVAsWUFBTyxJQUFQO0FBQUEsV0FDTyxDQURQO0FBQUEsV0FDVSxDQURWO2VBQ2lCLElBQUMsQ0FBQSxRQUFELEdBQVk7QUFEN0IsV0FFTyxDQUZQO2VBRWMsSUFBQyxDQUFBLFFBQUQsR0FBWTtBQUYxQjtFQUhLOzs7O0dBVDJDIn0=

    },{"../layer_info.coffee":27}],39:[function(require,module,exports){
        var Descriptor, LayerInfo, ObjectEffects,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = ObjectEffects = (function(superClass) {
            extend(ObjectEffects, superClass);

            function ObjectEffects() {
                return ObjectEffects.__super__.constructor.apply(this, arguments);
            }

            ObjectEffects.shouldParse = function(key) {
                return key === 'lfx2' || key === 'lmfx';
            };

            ObjectEffects.prototype.parse = function() {
                this.file.seek(8, true);
                return this.data = new Descriptor(this.file).parse();
            };

            return ObjectEffects;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL29iamVjdF9lZmZlY3RzLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9vYmplY3RfZWZmZWN0cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxvQ0FBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVI7O0FBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7RUFDckIsYUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7OzBCQUVkLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7V0FDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLEtBQXRCLENBQUE7RUFGSDs7OztHQUhvQyJ9

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],40:[function(require,module,exports){
        var LayerInfo, NestedSectionDivider,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = NestedSectionDivider = (function(superClass) {
            var SECTION_DIVIDER_TYPES;

            extend(NestedSectionDivider, superClass);

            NestedSectionDivider.shouldParse = function(key) {
                return key === 'lsct';
            };

            SECTION_DIVIDER_TYPES = ['other', 'open folder', 'closed folder', 'bounding section divider'];

            function NestedSectionDivider(layer, length) {
                NestedSectionDivider.__super__.constructor.call(this, layer, length);
                this.isFolder = false;
                this.isHidden = false;
                this.layerType = null;
                this.blendMode = null;
                this.subType = null;
            }

            NestedSectionDivider.prototype.parse = function() {
                var code;
                code = this.file.readInt();
                this.layerType = SECTION_DIVIDER_TYPES[code];
                switch (code) {
                    case 1:
                    case 2:
                        this.isFolder = true;
                        break;
                    case 3:
                        this.isHidden = true;
                }
                if (!(this.length >= 12)) {
                    return;
                }
                this.file.seek(4, true);
                this.blendMode = this.file.readString(4);
                if (!(this.length >= 16)) {
                    return;
                }
                return this.subType = this.file.readInt() === 0 ? 'normal' : 'scene group';
            };

            return NestedSectionDivider;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3NlY3Rpb25fZGl2aWRlci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vc2VjdGlvbl9kaXZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLCtCQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBRVosTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsTUFBQTs7OztFQUFBLG9CQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7RUFFZCxxQkFBQSxHQUF3QixDQUN0QixPQURzQixFQUV0QixhQUZzQixFQUd0QixlQUhzQixFQUl0QiwwQkFKc0I7O0VBT1gsOEJBQUMsS0FBRCxFQUFRLE1BQVI7SUFDWCxzREFBTSxLQUFOLEVBQWEsTUFBYjtJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsT0FBRCxHQUFXO0VBUEE7O2lDQVNiLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUVQLElBQUMsQ0FBQSxTQUFELEdBQWEscUJBQXNCLENBQUEsSUFBQTtBQUVuQyxZQUFPLElBQVA7QUFBQSxXQUNPLENBRFA7QUFBQSxXQUNVLENBRFY7UUFDaUIsSUFBQyxDQUFBLFFBQUQsR0FBWTtBQUFuQjtBQURWLFdBRU8sQ0FGUDtRQUVjLElBQUMsQ0FBQSxRQUFELEdBQVk7QUFGMUI7SUFJQSxJQUFBLENBQUEsQ0FBYyxJQUFDLENBQUEsTUFBRCxJQUFXLEVBQXpCLENBQUE7QUFBQSxhQUFBOztJQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO0lBQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsQ0FBakI7SUFFYixJQUFBLENBQUEsQ0FBYyxJQUFDLENBQUEsTUFBRCxJQUFXLEVBQXpCLENBQUE7QUFBQSxhQUFBOztXQUVBLElBQUMsQ0FBQSxPQUFELEdBQWMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBQSxLQUFtQixDQUF0QixHQUE2QixRQUE3QixHQUEyQztFQWhCakQ7Ozs7R0FuQjJDIn0=

    },{"../layer_info.coffee":27}],41:[function(require,module,exports){
        var Descriptor, LayerInfo, SolidColor,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = SolidColor = (function(superClass) {
            extend(SolidColor, superClass);

            SolidColor.shouldParse = function(key) {
                return key === 'SoCo';
            };

            function SolidColor(layer, length) {
                SolidColor.__super__.constructor.call(this, layer, length);
                this.r = this.g = this.b = 0;
            }

            SolidColor.prototype.parse = function() {
                this.file.seek(4, true);
                this.data = new Descriptor(this.file).parse();
                this.r = Math.round(this.colorData()['Rd  ']);
                this.g = Math.round(this.colorData()['Grn ']);
                return this.b = Math.round(this.colorData()['Bl  ']);
            };

            SolidColor.prototype.colorData = function() {
                return this.data['Clr '];
            };

            SolidColor.prototype.color = function() {
                return [this.r, this.g, this.b];
            };

            return SolidColor;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3NvbGlkX2NvbG9yLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby9zb2xpZF9jb2xvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpQ0FBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVI7O0FBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNyQixVQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBTztFQUFoQjs7RUFFRCxvQkFBQyxLQUFELEVBQVEsTUFBUjtJQUNYLDRDQUFNLEtBQU4sRUFBYSxNQUFiO0lBRUEsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxDQUFELEdBQUs7RUFISjs7dUJBS2IsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtJQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxVQUFKLENBQWUsSUFBQyxDQUFBLElBQWhCLENBQXFCLENBQUMsS0FBdEIsQ0FBQTtJQUVSLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQWEsQ0FBQSxNQUFBLENBQXhCO0lBQ0wsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBYSxDQUFBLE1BQUEsQ0FBeEI7V0FDTCxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFhLENBQUEsTUFBQSxDQUF4QjtFQU5BOzt1QkFRUCxTQUFBLEdBQVcsU0FBQTtXQUFHLElBQUMsQ0FBQSxJQUFLLENBQUEsTUFBQTtFQUFUOzt1QkFDWCxLQUFBLEdBQU8sU0FBQTtXQUFHLENBQUMsSUFBQyxDQUFBLENBQUYsRUFBSyxJQUFDLENBQUEsQ0FBTixFQUFTLElBQUMsQ0FBQSxDQUFWO0VBQUg7Ozs7R0FqQmlDIn0=

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],42:[function(require,module,exports){
        var Descriptor, LayerInfo, TextElements, _, parseEngineData,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        parseEngineData = require('parse-engine-data');

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = TextElements = (function(superClass) {
            var COORDS_VALUE, TRANSFORM_VALUE;

            extend(TextElements, superClass);

            TextElements.shouldParse = function(key) {
                return key === 'TySh';
            };

            TRANSFORM_VALUE = ['xx', 'xy', 'yx', 'yy', 'tx', 'ty'];

            COORDS_VALUE = ['left', 'top', 'right', 'bottom'];

            function TextElements(layer, length) {
                TextElements.__super__.constructor.call(this, layer, length);
                this.version = null;
                this.transform = {};
                this.textVersion = null;
                this.descriptorVersion = null;
                this.textData = null;
                this.engineData = null;
                this.textValue = null;
                this.warpVersion = null;
                this.descriptorVersion = null;
                this.warpData = null;
                this.coords = {};
            }

            TextElements.prototype.parse = function() {
                var i, index, len, name, results;
                this.version = this.file.readShort();
                this.parseTransformInfo();
                this.textVersion = this.file.readShort();
                this.descriptorVersion = this.file.readInt();
                this.textData = new Descriptor(this.file).parse();
                this.textValue = this.textData['Txt '];
                this.engineData = parseEngineData(this.textData.EngineData);
                this.warpVersion = this.file.readShort();
                this.descriptorVersion = this.file.readInt();
                this.warpData = new Descriptor(this.file).parse();
                results = [];
                for (index = i = 0, len = COORDS_VALUE.length; i < len; index = ++i) {
                    name = COORDS_VALUE[index];
                    results.push(this.coords[name] = this.file.readInt());
                }
                return results;
            };

            TextElements.prototype.parseTransformInfo = function() {
                var i, index, len, name, results;
                results = [];
                for (index = i = 0, len = TRANSFORM_VALUE.length; i < len; index = ++i) {
                    name = TRANSFORM_VALUE[index];
                    results.push(this.transform[name] = this.file.readDouble());
                }
                return results;
            };

            TextElements.prototype.fonts = function() {
                if (this.engineData == null) {
                    return [];
                }
                return this.engineData.ResourceDict.FontSet.map(function(f) {
                    return f.Name;
                });
            };

            TextElements.prototype.sizes = function() {
                if ((this.engineData == null) && (this.styles().FontSize == null)) {
                    return [];
                }
                return this.styles().FontSize;
            };

            TextElements.prototype.alignment = function() {
                var alignments;
                if (this.engineData == null) {
                    return [];
                }
                alignments = ['left', 'right', 'center', 'justify'];
                return this.engineData.EngineDict.ParagraphRun.RunArray.map(function(s) {
                    return alignments[Math.min(parseInt(s.ParagraphSheet.Properties.Justification, 10), 3)];
                });
            };

            TextElements.prototype.colors = function() {
                if ((this.engineData == null) || (this.styles().FillColor == null)) {
                    return [[0, 0, 0, 255]];
                }
                return this.styles().FillColor.map(function(s) {
                    var values;
                    values = s.Values.map(function(v) {
                        return Math.round(v * 255);
                    });
                    values.push(values.shift());
                    return values;
                });
            };

            TextElements.prototype.styles = function() {
                var data;
                if (this.engineData == null) {
                    return {};
                }
                if (this._styles != null) {
                    return this._styles;
                }
                data = this.engineData.EngineDict.StyleRun.RunArray.map(function(r) {
                    return r.StyleSheet.StyleSheetData;
                });
                return this._styles = _.reduce(data, function(m, o) {
                    var k, v;
                    for (k in o) {
                        if (!hasProp.call(o, k)) continue;
                        v = o[k];
                        m[k] || (m[k] = []);
                        m[k].push(v);
                    }
                    return m;
                }, {});
            };

            TextElements.prototype.toCSS = function() {
                var css, definition, k, v;
                definition = {
                    'font-family': this.fonts().join(', '),
                    'font-size': (this.sizes()[0]) + "pt",
                    'color': "rgba(" + (this.colors()[0].join(', ')) + ")",
                    'text-align': this.alignment()[0]
                };
                css = [];
                for (k in definition) {
                    v = definition[k];
                    if (v == null) {
                        continue;
                    }
                    css.push(k + ": " + v + ";");
                }
                return css.join("\n");
            };

            TextElements.prototype["export"] = function() {
                return {
                    value: this.textValue,
                    font: {
                        name: this.fonts()[0],
                        sizes: this.sizes(),
                        colors: this.colors(),
                        alignment: this.alignment()
                    },
                    left: this.coords.left,
                    top: this.coords.top,
                    right: this.coords.right,
                    bottom: this.coords.bottom,
                    transform: this.transform
                };
            };

            return TextElements;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3R5cGV0b29sLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby90eXBldG9vbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSx1REFBQTtFQUFBOzs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osZUFBQSxHQUFrQixPQUFBLENBQVEsbUJBQVI7O0FBQ2xCLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBQ1osVUFBQSxHQUFhLE9BQUEsQ0FBUSxzQkFBUjs7QUFFYixNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixNQUFBOzs7O0VBQUEsWUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O0VBRWQsZUFBQSxHQUFrQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQjs7RUFDbEIsWUFBQSxHQUFlLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUIsUUFBekI7O0VBRUYsc0JBQUMsS0FBRCxFQUFRLE1BQVI7SUFDWCw4Q0FBTSxLQUFOLEVBQWEsTUFBYjtJQUVBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxD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

    },{"../descriptor.coffee":4,"../layer_info.coffee":27,"lodash":109,"parse-engine-data":110}],43:[function(require,module,exports){
        var LayerInfo, UnicodeName,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        module.exports = UnicodeName = (function(superClass) {
            extend(UnicodeName, superClass);

            function UnicodeName() {
                return UnicodeName.__super__.constructor.apply(this, arguments);
            }

            UnicodeName.shouldParse = function(key) {
                return key === 'luni';
            };

            UnicodeName.prototype.parse = function() {
                var pos;
                pos = this.file.tell();
                this.data = this.file.readUnicodeString();
                this.file.seek(pos + this.length);
                return this;
            };

            return UnicodeName;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3VuaWNvZGVfbmFtZS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vdW5pY29kZV9uYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHNCQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBRVosTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7RUFDckIsV0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O3dCQUVkLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQTtJQUNOLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxpQkFBTixDQUFBO0lBRVIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFsQjtBQUNBLFdBQU87RUFMRjs7OztHQUhrQyJ9

    },{"../layer_info.coffee":27}],44:[function(require,module,exports){
        var LayerInfo, PathRecord, VectorMask,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        PathRecord = require('../path_record.coffee');

        module.exports = VectorMask = (function(superClass) {
            extend(VectorMask, superClass);

            VectorMask.shouldParse = function(key) {
                return key === 'vmsk' || key === 'vsms';
            };

            function VectorMask(layer, length) {
                VectorMask.__super__.constructor.call(this, layer, length);
                this.invert = null;
                this.notLink = null;
                this.disable = null;
                this.paths = [];
            }

            VectorMask.prototype.parse = function() {
                var i, j, numRecords, record, ref, results, tag;
                this.file.seek(4, true);
                tag = this.file.readInt();
                this.invert = (tag & 0x01) > 0;
                this.notLink = (tag & (0x01 << 1)) > 0;
                this.disable = (tag & (0x01 << 2)) > 0;
                numRecords = (this.length - 10) / 26;
                results = [];
                for (i = j = 0, ref = numRecords; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    record = new PathRecord(this.file);
                    record.parse();
                    results.push(this.paths.push(record));
                }
                return results;
            };

            VectorMask.prototype["export"] = function() {
                return {
                    invert: this.invert,
                    notLink: this.notLink,
                    disable: this.disable,
                    paths: this.paths.map(function(p) {
                        return p["export"]();
                    })
                };
            };

            return VectorMask;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3ZlY3Rvcl9tYXNrLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfaW5mby92ZWN0b3JfbWFzay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpQ0FBQTtFQUFBOzs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSOztBQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsdUJBQVI7O0FBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNyQixVQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtXQUFTLEdBQUEsS0FBUSxNQUFSLElBQUEsR0FBQSxLQUFnQjtFQUF6Qjs7RUFFRCxvQkFBQyxLQUFELEVBQVEsTUFBUjtJQUNYLDRDQUFNLEtBQU4sRUFBYSxNQUFiO0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztFQU5FOzt1QkFRYixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBQWMsSUFBZDtJQUNBLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUVOLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxHQUFBLEdBQU0sSUFBUCxDQUFBLEdBQWU7SUFDekIsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLEdBQUEsR0FBTSxDQUFDLElBQUEsSUFBUSxDQUFULENBQVAsQ0FBQSxHQUFzQjtJQUNqQyxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsR0FBQSxHQUFNLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBUCxDQUFBLEdBQXNCO0lBR2pDLFVBQUEsR0FBYSxDQUFDLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFBWCxDQUFBLEdBQWlCO0FBQzlCO1NBQVMsbUZBQVQ7TUFDRSxNQUFBLEdBQVMsSUFBSSxVQUFKLENBQWUsSUFBQyxDQUFBLElBQWhCO01BQ1QsTUFBTSxDQUFDLEtBQVAsQ0FBQTttQkFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxNQUFaO0FBSkY7O0VBVks7O3dCQWdCUCxRQUFBLEdBQVEsU0FBQTtXQUNOO01BQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUFUO01BQ0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQURWO01BRUEsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQUZWO01BR0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFNBQUMsQ0FBRDtlQUFPLENBQUMsRUFBQyxNQUFELEVBQUQsQ0FBQTtNQUFQLENBQVgsQ0FIUDs7RUFETTs7OztHQTNCZ0MifQ==

    },{"../layer_info.coffee":27,"../path_record.coffee":58}],45:[function(require,module,exports){
        var Descriptor, LayerInfo, VectorOrigination,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = VectorOrigination = (function(superClass) {
            extend(VectorOrigination, superClass);

            function VectorOrigination() {
                return VectorOrigination.__super__.constructor.apply(this, arguments);
            }

            VectorOrigination.shouldParse = function(key) {
                return key === 'vogk';
            };

            VectorOrigination.prototype.parse = function() {
                this.file.seek(8, true);
                return this.data = new Descriptor(this.file).parse();
            };

            return VectorOrigination;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3ZlY3Rvcl9vcmlnaW5hdGlvbi5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vdmVjdG9yX29yaWdpbmF0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHdDQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBQ1osVUFBQSxHQUFhLE9BQUEsQ0FBUSxzQkFBUjs7QUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztFQUNyQixpQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7OzhCQUVkLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7V0FDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLEtBQXRCLENBQUE7RUFGSDs7OztHQUh3QyJ9

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],46:[function(require,module,exports){
        var Descriptor, LayerInfo, VectorStroke,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = VectorStroke = (function(superClass) {
            extend(VectorStroke, superClass);

            function VectorStroke() {
                return VectorStroke.__super__.constructor.apply(this, arguments);
            }

            VectorStroke.shouldParse = function(key) {
                return key === 'vstk';
            };

            VectorStroke.prototype.parse = function() {
                this.file.seek(4, true);
                return this.data = new Descriptor(this.file).parse();
            };

            return VectorStroke;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3ZlY3Rvcl9zdHJva2UuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3ZlY3Rvcl9zdHJva2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsbUNBQUE7RUFBQTs7O0FBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUjs7QUFDWixVQUFBLEdBQWEsT0FBQSxDQUFRLHNCQUFSOztBQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O0VBQ3JCLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQVMsR0FBQSxLQUFPO0VBQWhCOzt5QkFFZCxLQUFBLEdBQU8sU0FBQTtJQUNMLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO1dBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLFVBQUosQ0FBZSxJQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxLQUF0QixDQUFBO0VBRkg7Ozs7R0FIbUMifQ==

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],47:[function(require,module,exports){
        var Descriptor, LayerInfo, VectorStrokeContent,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        LayerInfo = require('../layer_info.coffee');

        Descriptor = require('../descriptor.coffee');

        module.exports = VectorStrokeContent = (function(superClass) {
            extend(VectorStrokeContent, superClass);

            function VectorStrokeContent() {
                return VectorStrokeContent.__super__.constructor.apply(this, arguments);
            }

            VectorStrokeContent.shouldParse = function(key) {
                return key === 'vscg';
            };

            VectorStrokeContent.prototype.parse = function() {
                this.file.seek(8, true);
                return this.data = new Descriptor(this.file).parse();
            };

            return VectorStrokeContent;

        })(LayerInfo);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9pbmZvL3ZlY3Rvcl9zdHJva2VfY29udGVudC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL2xheWVyX2luZm8vdmVjdG9yX3N0cm9rZV9jb250ZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLDBDQUFBO0VBQUE7OztBQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVI7O0FBQ1osVUFBQSxHQUFhLE9BQUEsQ0FBUSxzQkFBUjs7QUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztFQUNyQixtQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7V0FBUyxHQUFBLEtBQU87RUFBaEI7O2dDQUVkLEtBQUEsR0FBTyxTQUFBO0lBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsQ0FBWCxFQUFjLElBQWQ7V0FDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLEtBQXRCLENBQUE7RUFGSDs7OztHQUgwQyJ9

    },{"../descriptor.coffee":4,"../layer_info.coffee":27}],48:[function(require,module,exports){
        var Layer, LayerMask, Util, _;

        _ = require('lodash');

        Util = require('./util.coffee');

        Layer = require('./layer.coffee');

        module.exports = LayerMask = (function() {
            function LayerMask(file, header) {
                this.file = file;
                this.header = header;
                this.layers = [];
                this.mergedAlpha = false;
                this.globalMask = null;
            }

            LayerMask.prototype.skip = function() {
                return this.file.seek(this.file.readInt(), true);
            };

            LayerMask.prototype.parse = function() {
                var finish, maskSize;
                maskSize = this.file.readInt();
                finish = maskSize + this.file.tell();
                if (maskSize <= 0) {
                    return;
                }
                this.parseLayers();
                this.parseGlobalMask();
                this.layers.reverse();
                return this.file.seek(finish);
            };

            LayerMask.prototype.parseLayers = function() {
                var i, j, k, layer, layerCount, layerInfoSize, len, ref, ref1, results;
                layerInfoSize = Util.pad2(this.file.readInt());
                if (layerInfoSize > 0) {
                    layerCount = this.file.readShort();
                    if (layerCount < 0) {
                        layerCount = Math.abs(layerCount);
                        this.mergedAlpha = true;
                    }
                    for (i = j = 0, ref = layerCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                        this.layers.push(new Layer(this.file, this.header).parse());
                    }
                    ref1 = this.layers;
                    results = [];
                    for (k = 0, len = ref1.length; k < len; k++) {
                        layer = ref1[k];
                        results.push(layer.parseChannelImage());
                    }
                    return results;
                }
            };

            LayerMask.prototype.parseGlobalMask = function() {
                var length, maskEnd;
                length = this.file.readInt();
                if (length <= 0) {
                    return;
                }
                maskEnd = this.file.tell() + length;
                this.globalMask = _({}).tap((function(_this) {
                    return function(mask) {
                        mask.overlayColorSpace = _this.file.readShort();
                        mask.colorComponents = [_this.file.readShort() >> 8, _this.file.readShort() >> 8, _this.file.readShort() >> 8, _this.file.readShort() >> 8];
                        mask.opacity = _this.file.readShort() / 16.0;
                        return mask.kind = _this.file.readByte();
                    };
                })(this));
                return this.file.seek(maskEnd);
            };

            return LayerMask;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXllcl9tYXNrLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbGF5ZXJfbWFzay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztBQUNQLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVI7O0FBWVIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7RUFDUixtQkFBQyxJQUFELEVBQVEsTUFBUjtJQUFDLElBQUMsQ0FBQSxPQUFEO0lBQU8sSUFBQyxDQUFBLFNBQUQ7SUFDbkIsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsVUFBRCxHQUFjO0VBSEg7O3NCQUtiLElBQUEsR0FBTSxTQUFBO1dBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBWCxFQUE0QixJQUE1QjtFQUFIOztzQkFFTixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFDWCxNQUFBLEdBQVMsUUFBQSxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBO0lBRXBCLElBQVUsUUFBQSxJQUFZLENBQXRCO0FBQUEsYUFBQTs7SUFFQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtJQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO1dBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsTUFBWDtFQWJLOztzQkFlUCxXQUFBLEdBQWEsU0FBQTtBQUNYLFFBQUE7SUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBVjtJQUVoQixJQUFHLGFBQUEsR0FBZ0IsQ0FBbkI7TUFDRSxVQUFBLEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7TUFFYixJQUFHLFVBQUEsR0FBYSxDQUFoQjtRQUNFLFVBQUEsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLFVBQVQ7UUFDYixJQUFDLENBQUEsV0FBRCxHQUFlLEtBRmpCOztBQUlBLFdBQVMsbUZBQVQ7UUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFJLEtBQUosQ0FBVSxJQUFDLENBQUEsSUFBWCxFQUFpQixJQUFDLENBQUEsTUFBbEIsQ0FBeUIsQ0FBQyxLQUExQixDQUFBLENBQWI7QUFERjtBQUdBO0FBQUE7V0FBQSxzQ0FBQTs7cUJBQUEsS0FBSyxDQUFDLGlCQUFOLENBQUE7QUFBQTtxQkFWRjs7RUFIVzs7c0JBZWIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUNULElBQVUsTUFBQSxJQUFVLENBQXBCO0FBQUEsYUFBQTs7SUFFQSxPQUFBLEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUEsQ0FBQSxHQUFlO0lBRXpCLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQSxDQUFFLEVBQUYsQ0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtRQUN0QixJQUFJLENBQUMsaUJBQUwsR0FBeUIsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7UUFDekIsSUFBSSxDQUFDLGVBQUwsR0FBdUIsQ0FDckIsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsQ0FBQSxJQUFxQixDQURBLEVBRXJCLEtBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBLENBQUEsSUFBcUIsQ0FGQSxFQUdyQixLQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxDQUFBLElBQXFCLENBSEEsRUFJckIsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsQ0FBQSxJQUFxQixDQUpBO1FBT3ZCLElBQUksQ0FBQyxPQUFMLEdBQWUsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsQ0FBQSxHQUFvQjtlQUduQyxJQUFJLENBQUMsSUFBTCxHQUFZLEtBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO01BWlU7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7V0FjZCxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxPQUFYO0VBcEJlIn0=

    },{"./layer.coffee":18,"./util.coffee":63,"lodash":109}],49:[function(require,module,exports){
        var LazyExecute,
            slice = [].slice,
            indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

        module.exports = LazyExecute = (function() {
            function LazyExecute(obj, file) {
                this.obj = obj;
                this.file = file;
                this.startPos = this.file.tell();
                this.loaded = false;
                this.loadMethod = null;
                this.loadArgs = [];
                this.passthru = [];
            }

            LazyExecute.prototype.now = function() {
                var args, method;
                method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
                this.obj[method].apply(this.obj, args);
                return this;
            };

            LazyExecute.prototype.later = function() {
                var args, method;
                method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
                this.loadMethod = method;
                this.loadArgs = args;
                return this;
            };

            LazyExecute.prototype.ignore = function() {
                var args;
                args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                this.passthru.concat(args);
                return this;
            };

            LazyExecute.prototype.get = function() {
                var fn, key, ref, val;
                ref = this.obj;
                fn = (function(_this) {
                    return function(key, val) {
                        if (_this[key] != null) {
                            return;
                        }
                        return Object.defineProperty(_this, key, {
                            get: function() {
                                if (!this.loaded && !(indexOf.call(this.passthru, key) >= 0)) {
                                    this.load();
                                }
                                return this.obj[key];
                            }
                        });
                    };
                })(this);
                for (key in ref) {
                    val = ref[key];
                    fn(key, val);
                }
                return this;
            };

            LazyExecute.prototype.load = function() {
                var origPos;
                origPos = this.file.tell();
                this.file.seek(this.startPos);
                this.obj[this.loadMethod].apply(this.obj, this.loadArgs);
                this.file.seek(origPos);
                return this.loaded = true;
            };

            return LazyExecute;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXp5X2V4ZWN1dGUuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9sYXp5X2V4ZWN1dGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCQSxJQUFBLFdBQUE7RUFBQTs7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7RUFDUixxQkFBQyxHQUFELEVBQU8sSUFBUDtJQUFDLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLE9BQUQ7SUFDbEIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQTtJQUNaLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7RUFMRDs7d0JBVWIsR0FBQSxHQUFLLFNBQUE7QUFDSCxRQUFBO0lBREksdUJBQVE7SUFDWixJQUFDLENBQUEsR0FBSSxDQUFBLE1BQUEsQ0FBTyxDQUFDLEtBQWIsQ0FBbUIsSUFBQyxDQUFBLEdBQXBCLEVBQXlCLElBQXpCO0FBQ0EsV0FBTztFQUZKOzt3QkFNTCxLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFETSx1QkFBUTtJQUNkLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFDZCxJQUFDLENBQUEsUUFBRCxHQUFZO0FBQ1osV0FBTztFQUhGOzt3QkFXUCxNQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7SUFETztJQUNQLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixJQUFqQjtBQUNBLFdBQU87RUFGRDs7d0JBT1IsR0FBQSxHQUFLLFNBQUE7QUFDSCxRQUFBO0FBQUE7U0FBNkIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLEdBQUQsRUFBTSxHQUFOO1FBQzNCLElBQVUsa0JBQVY7QUFBQSxpQkFBQTs7ZUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixLQUF0QixFQUF5QixHQUF6QixFQUNFO1VBQUEsR0FBQSxFQUFLLFNBQUE7WUFDSCxJQUFXLENBQUksSUFBQyxDQUFBLE1BQUwsSUFBZ0IsQ0FBSSxDQUFDLGFBQU8sSUFBQyxDQUFBLFFBQVIsRUFBQSxHQUFBLE1BQUQsQ0FBL0I7Y0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7O21CQUNBLElBQUMsQ0FBQSxHQUFJLENBQUEsR0FBQTtVQUZGLENBQUw7U0FERjtNQUYyQjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7QUFBN0IsU0FBQSxVQUFBOztTQUE4QixLQUFLO0FBQW5DO1dBT0E7RUFSRzs7d0JBa0JMLElBQUEsR0FBTSxTQUFBO0FBQ0osUUFBQTtJQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQTtJQUNWLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxRQUFaO0lBRUEsSUFBQyxDQUFBLEdBQUksQ0FBQSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQUMsS0FBbEIsQ0FBd0IsSUFBQyxDQUFBLEdBQXpCLEVBQThCLElBQUMsQ0FBQSxRQUEvQjtJQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLE9BQVg7V0FDQSxJQUFDLENBQUEsTUFBRCxHQUFVO0VBUE4ifQ==

    },{}],50:[function(require,module,exports){
        var Mask;

        module.exports = Mask = (function() {
            function Mask(file) {
                this.file = file;
                this.top = 0;
                this.right = 0;
                this.bottom = 0;
                this.left = 0;
            }

            Mask.prototype.parse = function() {
                var maskEnd;
                this.size = this.file.readInt();
                if (this.size === 0) {
                    return this;
                }
                maskEnd = this.file.tell() + this.size;
                this.top = this.file.readInt();
                this.left = this.file.readInt();
                this.bottom = this.file.readInt();
                this.right = this.file.readInt();
                this.width = this.right - this.left;
                this.height = this.bottom - this.top;
                this.relative = (this.flags & 0x01) > 0;
                this.disabled = (this.flags & (0x01 << 1)) > 0;
                this.invert = (this.flags & (0x01 << 2)) > 0;
                this.defaultColor = this.file.readByte();
                this.flags = this.file.readByte();
                this.file.seek(maskEnd);
                return this;
            };

            Mask.prototype["export"] = function() {
                if (this.size === 0) {
                    return {};
                }
                return {
                    top: this.top,
                    left: this.left,
                    bottom: this.bottom,
                    right: this.right,
                    width: this.width,
                    height: this.height,
                    defaultColor: this.defaultColor,
                    relative: this.relative,
                    disabled: this.disabled,
                    invert: this.invert
                };
            };

            return Mask;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9tYXNrLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvbWFzay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNSLGNBQUMsSUFBRDtJQUFDLElBQUMsQ0FBQSxPQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUTtFQUpHOztpQkFNYixLQUFBLEdBQU8sU0FBQTtBQUdMLFFBQUE7SUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ1IsSUFBWSxJQUFDLENBQUEsSUFBRCxLQUFTLENBQXJCO0FBQUEsYUFBTyxLQUFQOztJQUVBLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxDQUFBLEdBQWUsSUFBQyxDQUFBO0lBRzFCLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ1IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFHVCxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBO0lBQ25CLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUE7SUFHckIsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBVixDQUFBLEdBQWtCO0lBQzlCLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBVixDQUFBLEdBQXlCO0lBQ3JDLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBVixDQUFBLEdBQXlCO0lBRW5DLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO0lBQ2hCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUE7SUFFVCxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxPQUFYO0FBQ0EsV0FBTztFQTNCRjs7a0JBNkJQLFFBQUEsR0FBUSxTQUFBO0lBQ04sSUFBYSxJQUFDLENBQUEsSUFBRCxLQUFTLENBQXRCO0FBQUEsYUFBTyxHQUFQOztXQUVBO01BQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFOO01BQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQURQO01BRUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUZUO01BR0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUhSO01BSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUpSO01BS0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUxUO01BTUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxZQU5mO01BT0EsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQVBYO01BUUEsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQVJYO01BU0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQVRUOztFQUhNIn0=

    },{}],51:[function(require,module,exports){
        var Module, Node, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        Module = require('coffeescript-module').Module;

        module.exports = Node = (function(superClass) {
            extend(Node, superClass);

            Node.includes(require('./nodes/ancestry.coffee'));

            Node.includes(require('./nodes/search.coffee'));

            Node.includes(require('./nodes/build_preview.coffee'));

            Node.PROPERTIES = ['name', 'left', 'right', 'top', 'bottom', 'height', 'width'];

            Node.prototype.type = 'node';

            function Node(layer, parent) {
                this.layer = layer;
                this.parent = parent != null ? parent : null;
                this.layer.node = this;
                this._children = [];
                this.name = this.layer.name;
                this.forceVisible = null;
                this.coords = {
                    top: this.layer.top,
                    bottom: this.layer.bottom,
                    left: this.layer.left,
                    right: this.layer.right
                };
                this.topOffset = 0;
                this.leftOffset = 0;
                this.createProperties();
            }

            Node.prototype.createProperties = function() {
                Object.defineProperty(this, 'top', {
                    get: function() {
                        return this.coords.top + this.topOffset;
                    },
                    set: function(val) {
                        return this.coords.top = val;
                    }
                });
                Object.defineProperty(this, 'right', {
                    get: function() {
                        return this.coords.right + this.leftOffset;
                    },
                    set: function(val) {
                        return this.coords.right = val;
                    }
                });
                Object.defineProperty(this, 'bottom', {
                    get: function() {
                        return this.coords.bottom + this.topOffset;
                    },
                    set: function(val) {
                        return this.coords.bottom = val;
                    }
                });
                Object.defineProperty(this, 'left', {
                    get: function() {
                        return this.coords.left + this.leftOffset;
                    },
                    set: function(val) {
                        return this.coords.left = val;
                    }
                });
                Object.defineProperty(this, 'width', {
                    get: function() {
                        return this.right - this.left;
                    }
                });
                return Object.defineProperty(this, 'height', {
                    get: function() {
                        return this.bottom - this.top;
                    }
                });
            };

            Node.prototype.get = function(prop) {
                var value;
                value = this[prop] != null ? this[prop] : this.layer[prop];
                if (typeof value === 'function') {
                    return value();
                } else {
                    return value;
                }
            };

            Node.prototype.visible = function() {
                if (this.layer.clipped && !this.clippingMask().visible()) {
                    return false;
                }
                if (this.forceVisible != null) {
                    return this.forceVisible;
                } else {
                    return this.layer.visible;
                }
            };

            Node.prototype.hidden = function() {
                return !this.visible();
            };

            Node.prototype.isLayer = function() {
                return this.type === 'layer';
            };

            Node.prototype.isGroup = function() {
                return this.type === 'group';
            };

            Node.prototype.isRoot = function() {
                return this.type === 'root';
            };

            Node.prototype.clippingMask = function() {
                var maskNode;
                if (!this.layer.clipped) {
                    return null;
                }
                return this.clippingMaskCached || (this.clippingMaskCached = ((function() {
                    maskNode = this.nextSibling();
                    while (maskNode.clipped) {
                        maskNode = maskNode.nextSibling();
                    }
                    return maskNode;
                }).call(this)));
            };

            Node.prototype.clippedBy = function() {
                return this.clippingMask();
            };

            Node.prototype["export"] = function() {
                var hash, i, len, prop, ref;
                hash = {
                    type: null,
                    visible: this.visible(),
                    opacity: this.layer.opacity / 255.0,
                    blendingMode: this.layer.blendingMode()
                };
                ref = Node.PROPERTIES;
                for (i = 0, len = ref.length; i < len; i++) {
                    prop = ref[i];
                    hash[prop] = this[prop];
                }
                return hash;
            };

            Node.prototype.updateDimensions = function() {
                var child, i, len, nonEmptyChildren, ref;
                if (this.isLayer()) {
                    return;
                }
                ref = this._children;
                for (i = 0, len = ref.length; i < len; i++) {
                    child = ref[i];
                    child.updateDimensions();
                }
                if (this.isRoot()) {
                    return;
                }
                nonEmptyChildren = this._children.filter(function(c) {
                    return !c.isEmpty();
                });
                this.left = _.min(nonEmptyChildren.map(function(c) {
                    return c.left;
                })) || 0;
                this.top = _.min(nonEmptyChildren.map(function(c) {
                    return c.top;
                })) || 0;
                this.bottom = _.max(nonEmptyChildren.map(function(c) {
                    return c.bottom;
                })) || 0;
                return this.right = _.max(nonEmptyChildren.map(function(c) {
                    return c.right;
                })) || 0;
            };

            return Node;

        })(Module);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2RlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2Qvbm9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsSUFBQSxlQUFBO0VBQUE7OztBQUFBLENBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDVixTQUFVLE9BQUEsQ0FBUSxxQkFBUjs7QUFFWCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7O0VBRXJCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBQSxDQUFRLHlCQUFSLENBQVY7O0VBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFBLENBQVEsdUJBQVIsQ0FBVjs7RUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQUEsQ0FBUSw4QkFBUixDQUFWOztFQUlBLElBQUMsQ0FBQSxVQUFELEdBQWEsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixLQUExQixFQUFpQyxRQUFqQyxFQUEyQyxRQUEzQyxFQUFxRCxPQUFyRDs7aUJBS2IsSUFBQSxHQUFNOztFQUlPLGNBQUMsS0FBRCxFQUFTLE1BQVQ7SUFBQyxJQUFDLENBQUEsUUFBRDtJQUFRLElBQUMsQ0FBQSwwQkFBRCxTQUFVO0lBQzlCLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjO0lBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUliLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQztJQUVmLElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBSWhCLElBQUMsQ0FBQSxNQUFELEdBQ0U7TUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFaO01BQ0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFEZjtNQUVBLElB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

    },{"./nodes/ancestry.coffee":52,"./nodes/build_preview.coffee":53,"./nodes/search.coffee":57,"coffeescript-module":82,"lodash":109}],52:[function(require,module,exports){
        var _;

        _ = require('lodash');

        module.exports = {
            root: function() {
                if (this.isRoot()) {
                    return this;
                }
                return this.parent.root();
            },
            isRoot: function() {
                return this.depth() === 0;
            },
            children: function() {
                return this._children;
            },
            ancestors: function() {
                if ((this.parent == null) || this.parent.isRoot()) {
                    return [];
                }
                return this.parent.ancestors().concat([this.parent]);
            },
            hasChildren: function() {
                return this._children.length > 0;
            },
            childless: function() {
                return !this.hasChildren();
            },
            siblings: function() {
                if (this.parent == null) {
                    return [];
                }
                return this.parent.children();
            },
            nextSibling: function() {
                var index;
                if (this.parent == null) {
                    return null;
                }
                index = this.siblings().indexOf(this);
                return this.siblings()[index + 1];
            },
            prevSibling: function() {
                var index;
                if (this.parent == null) {
                    return null;
                }
                index = this.siblings().indexOf(this);
                return this.siblings()[index - 1];
            },
            hasSiblings: function() {
                return this.siblings().length > 1;
            },
            onlyChild: function() {
                return !this.hasSiblings();
            },
            descendants: function() {
                return _.flatten(this._children.map(function(n) {
                    return n.subtree();
                }));
            },
            subtree: function() {
                return [this].concat(this.descendants());
            },
            depth: function() {
                return this.ancestors().length + 1;
            },
            path: function(asArray) {
                var path;
                if (asArray == null) {
                    asArray = false;
                }
                path = this.ancestors().map(function(n) {
                    return n.name;
                }).concat([this.name]);
                if (asArray) {
                    return path;
                } else {
                    return path.join('/');
                }
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9hbmNlc3RyeS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL25vZGVzL2FuY2VzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFFSixNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsSUFBQSxFQUFNLFNBQUE7SUFDSixJQUFZLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBWjtBQUFBLGFBQU8sS0FBUDs7QUFDQSxXQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFBO0VBRkgsQ0FBTjtFQUlBLE1BQUEsRUFBUSxTQUFBO1dBQUcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLEtBQVk7RUFBZixDQUpSO0VBTUEsUUFBQSxFQUFVLFNBQUE7V0FBRyxJQUFDLENBQUE7RUFBSixDQU5WO0VBUUEsU0FBQSxFQUFXLFNBQUE7SUFDVCxJQUFpQixxQkFBSixJQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxDQUE3QjtBQUFBLGFBQU8sR0FBUDs7QUFDQSxXQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxJQUFDLENBQUEsTUFBRixDQUEzQjtFQUZFLENBUlg7RUFZQSxXQUFBLEVBQWEsU0FBQTtXQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQjtFQUF2QixDQVpiO0VBYUEsU0FBQSxFQUFXLFNBQUE7V0FBRyxDQUFJLElBQUMsQ0FBQSxXQUFELENBQUE7RUFBUCxDQWJYO0VBZUEsUUFBQSxFQUFVLFNBQUE7SUFDUixJQUFpQixtQkFBakI7QUFBQSxhQUFPLEdBQVA7O1dBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQUE7RUFGUSxDQWZWO0VBbUJBLFdBQUEsRUFBYSxTQUFBO0FBQ1gsUUFBQTtJQUFBLElBQW1CLG1CQUFuQjtBQUFBLGFBQU8sS0FBUDs7SUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFXLENBQUMsT0FBWixDQUFvQixJQUFwQjtXQUNSLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBWSxDQUFBLEtBQUEsR0FBUSxDQUFSO0VBSEQsQ0FuQmI7RUF3QkEsV0FBQSxFQUFhLFNBQUE7QUFDWCxRQUFBO0lBQUEsSUFBbUIsbUJBQW5CO0FBQUEsYUFBTyxLQUFQOztJQUNBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVcsQ0FBQyxPQUFaLENBQW9CLElBQXBCO1dBQ1IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFZLENBQUEsS0FBQSxHQUFRLENBQVI7RUFIRCxDQXhCYjtFQTZCQSxXQUFBLEVBQWEsU0FBQTtXQUFHLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVyxDQUFDLE1BQVosR0FBcUI7RUFBeEIsQ0E3QmI7RUE4QkEsU0FBQSxFQUFXLFNBQUE7V0FBRyxDQUFJLElBQUMsQ0FBQSxXQUFELENBQUE7RUFBUCxDQTlCWDtFQWdDQSxXQUFBLEVBQWEsU0FBQTtXQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsU0FBQyxDQUFEO2FBQU8sQ0FBQyxDQUFDLE9BQUYsQ0FBQTtJQUFQLENBQWYsQ0FBVjtFQUFILENBaENiO0VBa0NBLE9BQUEsRUFBUyxTQUFBO1dBQUcsQ0FBQyxJQUFELENBQUcsQ0FBQyxNQUFKLENBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFYO0VBQUgsQ0FsQ1Q7RUFvQ0EsS0FBQSxFQUFPLFNBQUE7V0FBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVksQ0FBQyxNQUFiLEdBQXNCO0VBQXpCLENBcENQO0VBc0NBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixRQUFBOztNQURLLFVBQVU7O0lBQ2YsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBQyxDQUFEO2FBQU8sQ0FBQyxDQUFDO0lBQVQsQ0FBakIsQ0FBK0IsQ0FBQyxNQUFoQyxDQUF1QyxDQUFDLElBQUMsQ0FBQSxJQUFGLENBQXZDO0lBQ1AsSUFBRyxPQUFIO2FBQWdCLEtBQWhCO0tBQUEsTUFBQTthQUEwQixJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBMUI7O0VBRkksQ0F0Q04ifQ==

    },{"lodash":109}],53:[function(require,module,exports){
        module.exports = {
            toPng: function() {
                return this.layer.image.toPng();
            },
            saveAsPng: function(output) {
                return this.layer.image.saveAsPng(output);
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9idWlsZF9wcmV2aWV3LmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2Qvbm9kZXMvYnVpbGRfcHJldmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLEtBQUEsRUFBTyxTQUFBO1dBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYixDQUFBO0VBQUgsQ0FBUDtFQUNBLFNBQUEsRUFBVyxTQUFDLE1BQUQ7V0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFiLENBQXVCLE1BQXZCO0VBQVosQ0FEWCJ9

    },{}],54:[function(require,module,exports){
        var Group, Node, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        Node = require('../node.coffee');

        module.exports = Group = (function(superClass) {
            extend(Group, superClass);

            function Group() {
                return Group.__super__.constructor.apply(this, arguments);
            }

            Group.prototype.type = 'group';

            Group.prototype.passthruBlending = function() {
                return this.get('blendingMode') === 'passthru';
            };

            Group.prototype.isEmpty = function() {
                var child;
                if (!(function() {
                    var i, len, ref, results;
                    ref = this._children;
                    results = [];
                    for (i = 0, len = ref.length; i < len; i++) {
                        child = ref[i];
                        results.push(child.isEmpty());
                    }
                    return results;
                }).call(this)) {
                    return false;
                }
            };

            Group.prototype["export"] = function() {
                return _.merge(Group.__super__["export"].call(this), {
                    type: 'group',
                    children: this._children.map(function(c) {
                        return c["export"]();
                    })
                });
            };

            return Group;

        })(Node);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9ncm91cC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL25vZGVzL2dyb3VwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLGNBQUE7RUFBQTs7O0FBQUEsQ0FBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztBQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsZ0JBQVI7O0FBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7a0JBQ3JCLElBQUEsR0FBTTs7a0JBRU4sZ0JBQUEsR0FBa0IsU0FBQTtXQUNoQixJQUFDLENBQUEsR0FBRCxDQUFLLGNBQUwsQ0FBQSxLQUF3QjtFQURSOztrQkFHbEIsT0FBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBQUEsSUFBQTs7QUFBb0I7QUFBQTtXQUFBLHFDQUFBOztxQkFBQSxLQUFLLENBQUMsT0FBTixDQUFBO0FBQUE7O2lCQUFwQjtBQUFBLGFBQU8sTUFBUDs7RUFETzs7bUJBR1QsUUFBQSxHQUFRLFNBQUE7V0FDTixDQUFDLENBQUMsS0FBRixDQUFRLG1DQUFBLENBQVIsRUFDRTtNQUFBLElBQUEsRUFBTSxPQUFOO01BQ0EsUUFBQSxFQUFVLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQUMsQ0FBRDtlQUFPLENBQUMsRUFBQyxNQUFELEVBQUQsQ0FBQTtNQUFQLENBQWYsQ0FEVjtLQURGO0VBRE07Ozs7R0FUMkIifQ==

    },{"../node.coffee":51,"lodash":109}],55:[function(require,module,exports){
        var Layer, Node, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        Node = require('../node.coffee');

        module.exports = Layer = (function(superClass) {
            extend(Layer, superClass);

            function Layer() {
                return Layer.__super__.constructor.apply(this, arguments);
            }

            Layer.prototype.type = 'layer';

            Layer.prototype.isEmpty = function() {
                return this.width === 0 || this.height === 0;
            };

            Layer.prototype["export"] = function() {
                var ref;
                return _.merge(Layer.__super__["export"].call(this), {
                    type: 'layer',
                    mask: this.layer.mask["export"](),
                    text: (ref = this.get('typeTool')) != null ? ref["export"]() : void 0,
                    image: {}
                });
            };

            return Layer;

        })(Node);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9sYXllci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL25vZGVzL2xheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLGNBQUE7RUFBQTs7O0FBQUEsQ0FBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztBQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsZ0JBQVI7O0FBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7a0JBQ3JCLElBQUEsR0FBTTs7a0JBRU4sT0FBQSxHQUFTLFNBQUE7V0FBRyxJQUFDLENBQUEsS0FBRCxLQUFVLENBQVYsSUFBZSxJQUFDLENBQUEsTUFBRCxLQUFXO0VBQTdCOzttQkFFVCxRQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7V0FBQSxDQUFDLENBQUMsS0FBRixDQUFRLG1DQUFBLENBQVIsRUFDRTtNQUFBLElBQUEsRUFBTSxPQUFOO01BQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxFQUFDLE1BQUQsRUFBWCxDQUFBLENBRE47TUFFQSxJQUFBLDRDQUFzQixFQUFFLE1BQUYsRUFBaEIsQ0FBQSxVQUZOO01BR0EsS0FBQSxFQUFPLEVBSFA7S0FERjtFQURNOzs7O0dBTDJCIn0=

    },{"../node.coffee":51,"lodash":109}],56:[function(require,module,exports){
        var Group, Layer, Node, Root, _,
            extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;

        _ = require('lodash');

        Node = require('../node.coffee');

        Group = require('./group.coffee');

        Layer = require('./layer.coffee');

        module.exports = Root = (function(superClass) {
            extend(Root, superClass);

            Root.layerForPsd = function(psd) {
                var i, layer, len, prop, ref;
                layer = {};
                ref = Node.PROPERTIES;
                for (i = 0, len = ref.length; i < len; i++) {
                    prop = ref[i];
                    layer[prop] = null;
                }
                layer.top = 0;
                layer.left = 0;
                layer.right = psd.header.width;
                layer.bottom = psd.header.height;
                return layer;
            };

            Root.prototype.type = 'root';

            function Root(psd1) {
                this.psd = psd1;
                Root.__super__.constructor.call(this, Root.layerForPsd(this.psd));
                this.buildHeirarchy();
            }

            Root.prototype.documentDimensions = function() {
                return [this.width, this.height];
            };

            Root.prototype.depth = function() {
                return 0;
            };

            Root.prototype.opacity = function() {
                return 255;
            };

            Root.prototype.fillOpacity = function() {
                return 255;
            };

            Root.prototype["export"] = function() {
                var ref;
                return {
                    children: this._children.map(function(c) {
                        return c["export"]();
                    }),
                    document: {
                        width: this.width,
                        height: this.height,
                        resources: {
                            layerComps: ((ref = this.psd.resources.resource('layerComps')) != null ? ref["export"]() : void 0) || [],
                            guides: [],
                            slices: []
                        }
                    }
                };
            };

            Root.prototype.buildHeirarchy = function() {
                var currentGroup, i, layer, len, parent, parseStack, ref;
                currentGroup = this;
                parseStack = [];
                ref = this.psd.layers;
                for (i = 0, len = ref.length; i < len; i++) {
                    layer = ref[i];
                    if (layer.isFolder()) {
                        parseStack.push(currentGroup);
                        currentGroup = new Group(layer, _.last(parseStack));
                    } else if (layer.isFolderEnd()) {
                        parent = parseStack.pop();
                        parent.children().push(currentGroup);
                        currentGroup = parent;
                    } else {
                        currentGroup.children().push(new Layer(layer, currentGroup));
                    }
                }
                return this.updateDimensions();
            };

            return Root;

        })(Node);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9yb290LmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2Qvbm9kZXMvcm9vdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwyQkFBQTtFQUFBOzs7QUFBQSxDQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVI7O0FBQ1IsSUFBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLGdCQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVI7O0FBRVIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNyQixJQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtBQUNaLFFBQUE7SUFBQSxLQUFBLEdBQVE7QUFDUjtBQUFBLFNBQUEscUNBQUE7O01BQUEsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjO0FBQWQ7SUFFQSxLQUFLLENBQUMsR0FBTixHQUFZO0lBQ1osS0FBSyxDQUFDLElBQU4sR0FBYTtJQUNiLEtBQUssQ0FBQyxLQUFOLEdBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN6QixLQUFLLENBQUMsTUFBTixHQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7V0FDMUI7RUFSWTs7aUJBVWQsSUFBQSxHQUFNOztFQUVPLGNBQUMsSUFBRDtJQUFDLElBQUMsQ0FBQSxNQUFEO0lBQ1osc0NBQU0sSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBQyxDQUFBLEdBQWxCLENBQU47SUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO0VBRlc7O2lCQUliLGtCQUFBLEdBQW9CLFNBQUE7V0FBRyxDQUNyQixJQUFDLENBQUEsS0FEb0IsRUFFckIsSUFBQyxDQUFBLE1BRm9CO0VBQUg7O2lCQUtwQixLQUFBLEdBQU8sU0FBQTtXQUFHO0VBQUg7O2lCQUNQLE9BQUEsR0FBUyxTQUFBO1dBQUc7RUFBSDs7aUJBQ1QsV0FBQSxHQUFhLFNBQUE7V0FBRztFQUFIOztrQkFFYixRQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7V0FBQTtNQUFBLFFBQUEsRUFBVSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFDLENBQUQ7ZUFBTyxDQUFDLEVBQUMsTUFBRCxFQUFELENBQUE7TUFBUCxDQUFmLENBQVY7TUFDQSxRQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVI7UUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BRFQ7UUFFQSxTQUFBLEVBQ0U7VUFBQSxVQUFBLGtFQUFpRCxFQUFFLE1BQUYsRUFBckMsQ0FBQSxXQUFBLElBQW1ELEVBQS9EO1VBQ0EsTUFBQSxFQUFRLEVBRFI7VUFFQSxNQUFBLEVBQVEsRUFGUjtTQUhGO09BRkY7O0VBRE07O2lCQVdSLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFFBQUE7SUFBQSxZQUFBLEdBQWU7SUFDZixVQUFBLEdBQWE7QUFFYjtBQUFBLFNBQUEscUNBQUE7O01BQ0UsSUFBRyxLQUFLLENBQUMsUUFBTixDQUFBLENBQUg7UUFDRSxVQUFVLENBQUMsSUFBWCxDQUFnQixZQUFoQjtRQUNBLFlBQUEsR0FBZSxJQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCLENBQUMsQ0FBQyxJQUFGLENBQU8sVUFBUCxDQUFqQixFQUZqQjtPQUFBLE1BR0ssSUFBRyxLQUFLLENBQUMsV0FBTixDQUFBLENBQUg7UUFDSCxNQUFBLEdBQVMsVUFBVSxDQUFDLEdBQVgsQ0FBQTtRQUNULE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixZQUF2QjtRQUNBLFlBQUEsR0FBZSxPQUhaO09BQUEsTUFBQTtRQUtILFlBQVksQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCLFlBQWpCLENBQTdCLEVBTEc7O0FBSlA7V0FXQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtFQWZjOzs7O0dBckNrQiJ9

    },{"../node.coffee":51,"./group.coffee":54,"./layer.coffee":55,"lodash":109}],57:[function(require,module,exports){
        var _;

        _ = require('lodash');

        module.exports = {
            childrenAtPath: function(path, opts) {
                var matches, query;
                if (opts == null) {
                    opts = {};
                }
                if (!Array.isArray(path)) {
                    path = path.split('/').filter(function(p) {
                        return p.length > 0;
                    });
                }
                path = _.clone(path);
                query = path.shift();
                matches = this.children().filter(function(c) {
                    if (opts.caseSensitive) {
                        return c.name === query;
                    } else {
                        return c.name.toLowerCase() === query.toLowerCase();
                    }
                });
                if (path.length === 0) {
                    return matches;
                } else {
                    return _.flatten(matches.map(function(m) {
                        return m.childrenAtPath(_.clone(path), opts);
                    }));
                }
            }
        };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9zZWFyY2guY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9ub2Rlcy9zZWFyY2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7RUFBQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxFQUFPLElBQVA7QUFDZCxRQUFBOztNQURxQixPQUFPOztJQUM1QixJQUFBLENBQU8sS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBQVA7TUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQWUsQ0FBQyxNQUFoQixDQUF1QixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsTUFBRixHQUFXO01BQWxCLENBQXZCLEVBRFQ7O0lBR0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUjtJQUNQLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFBO0lBQ1IsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVyxDQUFDLE1BQVosQ0FBbUIsU0FBQyxDQUFEO01BQzNCLElBQUcsSUFBSSxDQUFDLGFBQVI7ZUFDRSxDQUFDLENBQUMsSUFBRixLQUFVLE1BRFo7T0FBQSxNQUFBO2VBR0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFQLENBQUEsQ0FBQSxLQUF3QixLQUFLLENBQUMsV0FBTixDQUFBLEVBSDFCOztJQUQyQixDQUFuQjtJQU1WLElBQUcsSUFBSSxDQUFDLE1BQUwsS0FBZSxDQUFsQjtBQUNFLGFBQU8sUUFEVDtLQUFBLE1BQUE7QUFHRSxhQUFPLENBQUMsQ0FBQyxPQUFGLENBQVUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLENBQUQ7ZUFDM0IsQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLENBQWpCLEVBQWdDLElBQWhDO01BRDJCLENBQVosQ0FBVixFQUhUOztFQVpjLENBQWhCIn0=

    },{"lodash":109}],58:[function(require,module,exports){
        var PathRecord, _;

        _ = require('lodash');

        module.exports = PathRecord = (function() {
            function PathRecord(file) {
                this.file = file;
                this.recordType = null;
            }

            PathRecord.prototype.parse = function() {
                this.recordType = this.file.readShort();
                switch (this.recordType) {
                    case 0:
                    case 3:
                        return this._readPathRecord();
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return this._readBezierPoint();
                    case 7:
                        return this._readClipboardRecord();
                    case 8:
                        return this._readInitialFill();
                    default:
                        return this.file.seek(24, true);
                }
            };

            PathRecord.prototype["export"] = function() {
                return _.merge({
                    recordType: this.recordType
                }, (function() {
                    var ref;
                    switch (this.recordType) {
                        case 0:
                        case 3:
                            return {
                                numPoints: this.numPoints
                            };
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return {
                                linked: this.linked,
                                closed: ((ref = this.recordType) === 1 || ref === 2),
                                preceding: {
                                    vert: this.precedingVert,
                                    horiz: this.precedingHoriz
                                },
                                anchor: {
                                    vert: this.anchorVert,
                                    horiz: this.anchorHoriz
                                },
                                leaving: {
                                    vert: this.leavingVert,
                                    horiz: this.leavingHoriz
                                }
                            };
                        case 7:
                            return {
                                clipboard: {
                                    top: this.clipboardTop,
                                    left: this.clipboardLeft,
                                    bottom: this.clipboardBottom,
                                    right: this.clipboardRight,
                                    resolution: this.clipboardResolution
                                }
                            };
                        case 8:
                            return {
                                initialFill: this.initialFill
                            };
                        default:
                            return {};
                    }
                }).call(this));
            };

            PathRecord.prototype.isBezierPoint = function() {
                var ref;
                return (ref = this.recordType) === 1 || ref === 2 || ref === 4 || ref === 5;
            };

            PathRecord.prototype._readPathRecord = function() {
                this.numPoints = this.file.readShort();
                return this.file.seek(22, true);
            };

            PathRecord.prototype._readBezierPoint = function() {
                var ref;
                this.linked = (ref = this.recordType) === 1 || ref === 4;
                this.precedingVert = this.file.readPathNumber();
                this.precedingHoriz = this.file.readPathNumber();
                this.anchorVert = this.file.readPathNumber();
                this.anchorHoriz = this.file.readPathNumber();
                this.leavingVert = this.file.readPathNumber();
                return this.leavingHoriz = this.file.readPathNumber();
            };

            PathRecord.prototype._readClipboardRecord = function() {
                this.clipboardTop = this.file.readPathNumber();
                this.clipboardLeft = this.file.readPathNumber();
                this.clipboardBottom = this.file.readPathNumber();
                this.clipboardRight = this.file.readPathNumber();
                this.clipboardResolution = this.file.readPathNumber();
                return this.file.seek(4, true);
            };

            PathRecord.prototype._readInitialFill = function() {
                this.initialFill = this.file.readShort();
                return this.file.seek(22, true);
            };

            return PathRecord;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9wYXRoX3JlY29yZC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL3BhdGhfcmVjb3JkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFJSixNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNSLG9CQUFDLElBQUQ7SUFBQyxJQUFDLENBQUEsT0FBRDtJQUNaLElBQUMsQ0FBQSxVQUFELEdBQWM7RUFESDs7dUJBR2IsS0FBQSxHQUFPLFNBQUE7SUFDTCxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBO0FBRWQsWUFBTyxJQUFDLENBQUEsVUFBUjtBQUFBLFdBQ08sQ0FEUDtBQUFBLFdBQ1UsQ0FEVjtlQUNpQixJQUFDLENBQUEsZUFBRCxDQUFBO0FBRGpCLFdBRU8sQ0FGUDtBQUFBLFdBRVUsQ0FGVjtBQUFBLFdBRWEsQ0FGYjtBQUFBLFdBRWdCLENBRmhCO2VBRXVCLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0FBRnZCLFdBR08sQ0FIUDtlQUdjLElBQUMsQ0FBQSxvQkFBRCxDQUFBO0FBSGQsV0FJTyxDQUpQO2VBSWMsSUFBQyxDQUFBLGdCQUFELENBQUE7QUFKZDtlQUtPLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEVBQVgsRUFBZSxJQUFmO0FBTFA7RUFISzs7d0JBVVAsUUFBQSxHQUFRLFNBQUE7V0FDTixDQUFDLENBQUMsS0FBRixDQUFRO01BQUUsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQUFmO0tBQVI7O0FBQXFDLGNBQU8sSUFBQyxDQUFBLFVBQVI7QUFBQSxhQUM5QixDQUQ4QjtBQUFBLGFBQzNCLENBRDJCO2lC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

    },{"lodash":109}],59:[function(require,module,exports){
        var Resource, Util;

        Util = require('./util.coffee');

        module.exports = Resource = (function() {
            Resource.Section = require('./resource_section.coffee');

            function Resource(file) {
                this.file = file;
                this.id = null;
                this.type = null;
                this.length = 0;
            }

            Resource.prototype.parse = function() {
                var nameLength;
                this.type = this.file.readString(4);
                this.id = this.file.readShort();
                nameLength = Util.pad2(this.file.readByte() + 1) - 1;
                this.name = this.file.readString(nameLength);
                return this.length = Util.pad2(this.file.readInt());
            };

            return Resource;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvcnlhbmxlZmV2cmUvUmVwb3NpdG9yaWVzL1BlcnNvbmFsL3BzZC5qcy9saWIvcHNkL3Jlc291cmNlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNyQixRQUFDLENBQUEsT0FBRCxHQUFVLE9BQUEsQ0FBUSwyQkFBUjs7RUFFRyxrQkFBQyxJQUFEO0lBQUMsSUFBQyxDQUFBLE9BQUQ7SUFDWixJQUFDLENBQUEsRUFBRCxHQUFNO0lBQ04sSUFBQyxDQUFBLElBQUQsR0FBUTtJQUNSLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFIQzs7cUJBS2IsS0FBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsQ0FBakI7SUFDUixJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBO0lBRU4sVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBQSxHQUFtQixDQUE3QixDQUFBLEdBQWtDO0lBQy9DLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLFVBQWpCO1dBQ1IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBQVY7RUFOTCJ9

    },{"./resource_section.coffee":60,"./util.coffee":63}],60:[function(require,module,exports){
        var ResourceSection, _;

        _ = require('lodash');

        module.exports = ResourceSection = (function() {
            var RESOURCES;

            function ResourceSection() {}

            RESOURCES = [require('./resources/layer_comps.coffee')];

            ResourceSection.factory = function(resource) {
                var Section, i, len;
                for (i = 0, len = RESOURCES.length; i < len; i++) {
                    Section = RESOURCES[i];
                    if (Section.prototype.id !== resource.id) {
                        continue;
                    }
                    return _.tap(new Section(resource), function(s) {
                        return s.parse();
                    });
                }
                return null;
            };

            return ResourceSection;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZV9zZWN0aW9uLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9yeWFubGVmZXZyZS9SZXBvc2l0b3JpZXMvUGVyc29uYWwvcHNkLmpzL2xpYi9wc2QvcmVzb3VyY2Vfc2VjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBRUosTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsTUFBQTs7OztFQUFBLFNBQUEsR0FBWSxDQUNWLE9BQUEsQ0FBUSxnQ0FBUixDQURVOztFQUlaLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxRQUFEO0FBQ1IsUUFBQTtBQUFBLFNBQUEsMkNBQUE7O01BQ0UsSUFBZ0IsT0FBTyxDQUFBLFNBQUUsQ0FBQSxFQUFULEtBQWUsUUFBUSxDQUFDLEVBQXhDO0FBQUEsaUJBQUE7O0FBQ0EsYUFBTyxDQUFDLENBQUMsR0FBRixDQUFNLElBQUksT0FBSixDQUFZLFFBQVosQ0FBTixFQUE2QixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsS0FBRixDQUFBO01BQVAsQ0FBN0I7QUFGVDtXQUlBO0VBTFEifQ==

    },{"./resources/layer_comps.coffee":62,"lodash":109}],61:[function(require,module,exports){
        var Resource, Resources;

        Resource = require('./resource.coffee');

        module.exports = Resources = (function() {
            function Resources(file) {
                this.file = file;
                this.resources = {};
                this.typeIndex = {};
                this.length = null;
            }

            Resources.prototype.skip = function() {
                this.length = this.file.readInt();
                return this.file.seek(this.length, true);
            };

            Resources.prototype.parse = function() {
                var finish, resource, resourceEnd, section;
                this.length = this.file.readInt();
                finish = this.length + this.file.tell();
                while (this.file.tell() < finish) {
                    resource = new Resource(this.file);
                    resource.parse();
                    resourceEnd = this.file.tell() + resource.length;
                    section = Resource.Section.factory(resource);
                    if (section == null) {
                        this.file.seek(resourceEnd);
                        continue;
                    }
                    this.resources[section.id] = section;
                    if (section.name != null) {
                        this.typeIndex[section.name] = section.id;
                    }
                    this.file.seek(resourceEnd);
                }
                return this.file.seek(finish);
            };

            Resources.prototype.resource = function(search) {
                if (typeof search === 'string') {
                    return this.byType(search);
                } else {
                    return this.resources[search];
                }
            };

            Resources.prototype.byType = function(name) {
                return this.resources[this.typeIndex[name]];
            };

            return Resources;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZXMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFFWCxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNSLG1CQUFDLElBQUQ7SUFBQyxJQUFDLENBQUEsT0FBRDtJQUNaLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQUhDOztzQkFLYixJQUFBLEdBQU0sU0FBQTtJQUNKLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7V0FDVixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxJQUFDLENBQUEsTUFBWixFQUFvQixJQUFwQjtFQUZJOztzQkFJTixLQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBQ1YsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUE7QUFFbkIsV0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxDQUFBLEdBQWUsTUFBckI7TUFDRSxRQUFBLEdBQVcsSUFBSSxRQUFKLENBQWEsSUFBQyxDQUFBLElBQWQ7TUFDWCxRQUFRLENBQUMsS0FBVCxDQUFBO01BRUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLENBQUEsR0FBZSxRQUFRLENBQUM7TUFFdEMsT0FBQSxHQUFVLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBakIsQ0FBeUIsUUFBekI7TUFDVixJQUFPLGVBQVA7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxXQUFYO0FBQ0EsaUJBRkY7O01BSUEsSUFBQyxDQUFBLFNBQVUsQ0FBQSxPQUFPLENBQUMsRUFBUixDQUFYLEdBQXlCO01BQ3pCLElBQXlDLG9CQUF6QztRQUFBLElBQUMsQ0FBQSxTQUFVLENBQUEsT0FBTyxDQUFDLElBQVIsQ0FBWCxHQUEyQixPQUFPLENBQUMsR0FBbkM7O01BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsV0FBWDtJQWRGO1dBZ0JBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLE1BQVg7RUFwQks7O3NCQXNCUCxRQUFBLEdBQVUsU0FBQyxNQUFEO0lBQ1IsSUFBRyxPQUFPLE1BQVAsS0FBa0IsUUFBckI7YUFDRSxJQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFDLENBQUEsU0FBVSxDQUFBLE1BQUEsRUFIYjs7RUFEUTs7c0JBTVYsTUFBQSxHQUFRLFNBQUMsSUFBRDtXQUFVLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFBLENBQVg7RUFBckIifQ==

    },{"./resource.coffee":59}],62:[function(require,module,exports){
        var Descriptor, LayerComps;

        Descriptor = require('../descriptor.coffee');

        module.exports = LayerComps = (function() {
            LayerComps.prototype.id = 1065;

            LayerComps.prototype.name = 'layerComps';

            LayerComps.visibilityCaptured = function(comp) {
                return comp.capturedInfo & parseInt('001', 2) > 0;
            };

            LayerComps.positionCaptured = function(comp) {
                return comp.positionCaptured & parseInt('010', 2) > 0;
            };

            LayerComps.appearanceCaptured = function(comp) {
                return comp.appearanceCaptured & parseInt('100', 2) > 0;
            };

            function LayerComps(resource) {
                this.resource = resource;
                this.file = this.resource.file;
            }

            LayerComps.prototype.parse = function() {
                this.file.seek(4, true);
                return this.data = new Descriptor(this.file).parse();
            };

            LayerComps.prototype.names = function() {
                return this.data.list.map(function(comp) {
                    return comp['Nm  '];
                });
            };

            LayerComps.prototype["export"] = function() {
                return this.data.list.map(function(comp) {
                    return {
                        id: comp.compID,
                        name: comp['Nm  '],
                        capturedInfo: comp.capturedInfo
                    };
                });
            };

            return LayerComps;

        })();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZXMvbGF5ZXJfY29tcHMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3J5YW5sZWZldnJlL1JlcG9zaXRvcmllcy9QZXJzb25hbC9wc2QuanMvbGliL3BzZC9yZXNvdXJjZXMvbGF5ZXJfY29tcHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxzQkFBUjs7QUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjt1QkFDckIsRUFBQSxHQUFJOzt1QkFDSixJQUFBLEdBQU07O0VBRU4sVUFBQyxDQUFBLGtCQUFELEdBQXFCLFNBQUMsSUFBRDtXQUNuQixJQUFJLENBQUMsWUFBTCxHQUFvQixRQUFBLENBQVMsS0FBVCxFQUFnQixDQUFoQixDQUFBLEdBQXFCO0VBRHRCOztFQUdyQixVQUFDLENBQUEsZ0JBQUQsR0FBbUIsU0FBQyxJQUFEO1dBQ2pCLElBQUksQ0FBQyxnQkFBTCxHQUF3QixRQUFBLENBQVMsS0FBVCxFQUFnQixDQUFoQixDQUFBLEdBQXFCO0VBRDVCOztFQUduQixVQUFDLENBQUEsa0JBQUQsR0FBcUIsU0FBQyxJQUFEO1dBQ25CLElBQUksQ0FBQyxrQkFBTCxHQUEwQixRQUFBLENBQVMsS0FBVCxFQUFnQixDQUFoQixDQUFBLEdBQXFCO0VBRDVCOztFQUdSLG9CQUFDLFFBQUQ7SUFBQyxJQUFDLENBQUEsV0FBRDtJQUNaLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFFBQVEsQ0FBQztFQURQOzt1QkFHYixLQUFBLEdBQU8sU0FBQTtJQUNMLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLENBQVgsRUFBYyxJQUFkO1dBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLFVBQUosQ0FBZSxJQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxLQUF0QixDQUFBO0VBRkg7O3VCQUlQLEtBQUEsR0FBTyxTQUFBO1dBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBWCxDQUFlLFNBQUMsSUFBRDthQUFVLElBQUssQ0FBQSxNQUFBO0lBQWYsQ0FBZjtFQUFIOzt3QkFDUCxRQUFBLEdBQVEsU0FBQTtXQUNOLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQVgsQ0FBZSxTQUFDLElBQUQ7YUFDYjtRQUFBLEVBQUEsRUFBSSxJQUFJLENBQUMsTUFBVDtRQUNBLElBQUEsRUFBTSxJQUFLLENBQUEsTUFBQSxDQURYO1FBRUEsWUFBQSxFQUFjLElBQUksQ0FBQyxZQUZuQjs7SUFEYSxDQUFmO0VBRE0ifQ==

    },{"../descriptor.coffee":4}],63:[function(require,module,exports){
        module.exports = {
            pad2: function(i) {
                return (i + 1) & ~0x01;
            },
            pad4: function(i) {
                return ((i + 4) & ~0x03) - 1;
            },
            getUnicodeCharacter: function(cp) {
                var first, second;
                if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
                    return String.fromCharCode(cp);
                } else if (cp >= 0x10000 && cp <= 0x10FFFF) {
                    cp -= 0x10000;
                    first = ((0xffc00 & cp) >> 10) + 0xD800;
                    second = (0x3ff