import webSpeech from '/js/module/webSpeech.js'
let tmpl = document.createElement('template')
tmpl.innerHTML = `<style>@import '/js/module/tags-index.css';</style><section id="tagsRoot"><div id="example1" class="input textarea"></div></section>`

class tags extends HTMLElement {
    constructor() {
        super();
        // console.assert(false)
        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
        // let css = document.createEditor('style')
        // css.innerText = '@import "js/module/tags-index.css"'
        // this.shadowRoot.appendChild(css)
//         this.querySelector('tbody').insertAdjacentHTML('beforeend', upload)
    }
    connectedCallback() {
        let self = this;
        (async ()=>{
            console.assert(false)
                let tags = {}
                tags['noop'] = async ()=>{}
                tags['retTrue'] = async ()=>{return true;}
                tags['BACKSPACE'] = 8;
                tags['COMMA'] = 188;
                tags['TAB']  = 9;
                tags['ENTER']  = 13;
                tags['DEFAULTS']  = {

                    additionalTagClasses: '',
                    allowDuplicates: false,
                    saveOnBlur: false,
                    duplicateTagClass: '',
                    containerFocusClass: 'active',
                    focusInputOnContainerClick: true,
                    hiddenInputName: 'taggles[]',
                    tags: [],
                    attachTagId: false,
                    allowedTags: [],
                    disallowedTags: [],
                    maxTags: null,
                    tabIndex: 1,
                    placeholder: 'Enter tags...',
                    submitKeys: [tags['COMMA'], tags['TAB'], tags['ENTER']],
                    preserveCase: false,
                    inputFormatter: tags['noop'],
                    tagFormatter: tags['noop'],
                    onBeforeTagAdd: tags['noop'],
                    onTagAdd: tags['noop'],
                    onBeforeTagRemove: tags['retTrue'],
                    onTagRemove: tags['noop']
                };

            tags['Helper'] = {}

            tags['Helper']['_extend'] = async () =>{

                let master = arguments[0];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    var object = arguments[i];
                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {
                            master[key] = object[key];
                        }
                    }
                }
                return master;
            }

            tags['Helper']['_isArray'] = async (arr) =>{

                if (Array.isArray) {
                    return Array.isArray(arr);
                }
                return Object.prototype.toString.call(arr) === '[object Array]';
            }

            tags['Helper']['_on'] = async (element, eventName, handler) =>{
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                }
                else if (element.attachEvent) {
                    element.attachEvent('on' + eventName, handler);
                }
                else {
                    element['on' + eventName] = handler;
                }
            }

            tags['Helper']['_trim'] = async (str) =>{
                return str.replace(/^\s+|\s+$/g, '');
            }

            tags['Helper']['_setText'] = async (str) =>{
                if (window.attachEvent && !window.addEventListener) { // <= IE8
                    el.innerText = text;
                }
                else {
                    el.textContent = text;
                }
            }


            tags['Taggle'] = async (el, options) =>{

                this.settings = _extend({}, DEFAULTS, options);
                this.measurements = {
                    container: {
                        rect: null,
                        style: null,
                        padding: null
                    }
                };
                this.container = el;
                this.tag = {
                    values: [],
                    elements: []
                };
                this.list = document.createElement('ul');
                this.inputLi = document.createElement('li');
                this.input = document.createElement('input');
                this.sizer = document.createElement('div');
                this.pasting = false;
                this.placeholder = null;

                if (this.settings.placeholder) {
                    this.placeholder = document.createElement('span');
                }

                if (typeof el === 'string') {
                    this.container = document.getElementById(el);
                }

                this._id = 0;
                this._setMeasurements();
                this._setupTextarea();
                this._attachEvents();
            }



            tags['_setMeasurements'] = async () =>{

                console.assert(false, this.container)
                this.measurements.container.rect = this.container.getBoundingClientRect();
                this.measurements.container.style = window.getComputedStyle(this.container);

                var style = this.measurements.container.style;
                var lpad = parseInt(style['padding-left'] || style.paddingLeft, 10);
                var rpad = parseInt(style['padding-right'] || style.paddingRight, 10);
                var lborder = parseInt(style['border-left'] || style.borderLeft, 10);
                var rborder = parseInt(style['border-right'] || style.borderRight, 10);

                this.measurements.container.padding = lpad + rpad + lborder + rborder;
            }


            tags['_setupTextarea'] = async () =>{

                var fontSize;

                this.list.className = 'taggle_list';
                this.input.type = 'text';
                // Make sure no left/right padding messes with the input sizing
                this.input.style.paddingLeft = 0;
                this.input.style.paddingRight = 0;
                this.input.className = 'taggle_input';
                this.input.tabIndex = this.settings.tabIndex;
                this.sizer.className = 'taggle_sizer';

                if (this.settings.tags.length) {
                    for (var i = 0, len = this.settings.tags.length; i < len; i++) {
                        var taggle = this._createTag(this.settings.tags[i]);
                        this.list.appendChild(taggle);
                    }
                }

                if (this.placeholder) {
                    this.placeholder.style.opacity = 0;
                    this.placeholder.classList.add('taggle_placeholder');
                    this.container.appendChild(this.placeholder);
                    _setText(this.placeholder, this.settings.placeholder);

                    if (!this.settings.tags.length) {
                        this.placeholder.style.opacity = 1;
                    }
                }

                var formattedInput = this.settings.inputFormatter(this.input);
                if (formattedInput) {
                    this.input = formattedInput;
                }

                this.inputLi.appendChild(this.input);
                this.list.appendChild(this.inputLi);
                this.container.appendChild(this.list);
                this.container.appendChild(this.sizer);
                fontSize = window.getComputedStyle(this.input).fontSize;
                this.sizer.style.fontSize = fontSize;
            }
            tags['_attachEvents'] = async () =>{

                var self = this;

                if (this.settings.focusInputOnContainerClick) {
                    _on(this.container, 'click', function() {
                        self.input.focus();
                    });
                }

                _on(this.input, 'focus', this._focusInput.bind(this));
                _on(this.input, 'blur', this._blurEvent.bind(this));
                _on(this.input, 'keydown', this._keydownEvents.bind(this));
                _on(this.input, 'keyup', this._keyupEvents.bind(this));
            }

            tags['_fixInputWidth'] = async () =>{

                var width;
                var inputRect;
                var rect;
                var leftPos;
                var padding;

                this._setMeasurements();

                // Reset width incase we've broken to the next line on a backspace erase
                this._setInputWidth();

                inputRect = this.input.getBoundingClientRect();
                rect = this.measurements.container.rect;
                width = ~~rect.width;
                // Could probably just use right - left all the time
                // but eh, this check is mostly for IE8
                if (!width) {
                    width = ~~rect.right - ~~rect.left;
                }
                leftPos = ~~inputRect.left - ~~rect.left;
                padding = this.measurements.container.padding;

                this._setInputWidth(width - leftPos - padding);
            }


            tags['_canAdd'] = async (e, text) =>{
                if (!text) {
                    return false;
                }
                var limit = this.settings.maxTags;
                if (limit !== null && limit <= this.getTagValues().length) {
                    return false;
                }

                if (this.settings.onBeforeTagAdd(e, text) === false) {
                    return false;
                }

                if (!this.settings.allowDuplicates && this._hasDupes(text)) {
                    return false;
                }

                var sensitive = this.settings.preserveCase;
                var allowed = this.settings.allowedTags;

                if (allowed.length && !this._tagIsInArray(text, allowed, sensitive)) {
                    return false;
                }

                var disallowed = this.settings.disallowedTags;
                if (disallowed.length && this._tagIsInArray(text, disallowed, sensitive)) {
                    return false;
                }

                return true;
            }

            tags['_tagIsInArray'] = async (text, arr, caseSensitive) =>{
                if (caseSensitive) {
                    return arr.indexOf(text) !== -1;
                }

                var lowercased = [].slice.apply(arr).map(function(str) {
                    return str.toLowerCase();
                });

                return lowercased.indexOf(text) !== -1;
            }

            tags['_add'] = async (e, text) =>{
                var self = this;
                var values = text || '';

                if (typeof text !== 'string') {
                    values = _trim(this.input.value);
                }

                values.split(',').map(function(val) {
                    return self._formatTag(val);
                }).forEach(function(val) {
                    if (!self._canAdd(e, val)) {
                        return;
                    }

                    var li = self._createTag(val);
                    var lis = self.list.children;
                    var lastLi = lis[lis.length - 1];
                    self.list.insertBefore(li, lastLi);


                    val = self.tag.values[self.tag.values.length - 1];

                    self.settings.onTagAdd(e, val);

                    self.input.value = '';
                    self._fixInputWidth();
                    self._focusInput();
                });
            }
            tags['_checkLastTag'] = async (e) =>{
                e = e || window.event;

                var taggles = this.container.querySelectorAll('.taggle');
                var lastTaggle = taggles[taggles.length - 1];
                var hotClass = 'taggle_hot';
                var heldDown = this.input.classList.contains('taggle_back');

                // prevent holding backspace from deleting all tags
                if (this.input.value === '' && e.keyCode === BACKSPACE && !heldDown) {
                    if (lastTaggle.classList.contains(hotClass)) {
                        this.input.classList.add('taggle_back');
                        this._remove(lastTaggle, e);
                        this._fixInputWidth();
                        this._focusInput();
                    }
                    else {
                        lastTaggle.classList.add(hotClass);
                    }
                }
                else if (lastTaggle.classList.contains(hotClass)) {
                    lastTaggle.classList.remove(hotClass);
                }
            }

            tags['_setInputWidth'] = async (width) =>{
                this.input.style.width = (width || 10) + 'px';
            }
            tags['_hasDupes'] = async (text) =>{
                var needle = this.tag.values.indexOf(text);
                var tagglelist = this.container.querySelector('.taggle_list');
                var dupes;

                if (this.settings.duplicateTagClass) {
                    dupes = tagglelist.querySelectorAll('.' + this.settings.duplicateTagClass);
                    for (var i = 0, len = dupes.length; i < len; i++) {
                        dupes[i].classList.remove(this.settings.duplicateTagClass);
                    }
                }

                // if found
                if (needle > -1) {
                    if (this.settings.duplicateTagClass) {
                        tagglelist.childNodes[needle].classList.add(this.settings.duplicateTagClass);
                    }
                    return true;
                }

                return false;
            }


            tags['_isConfirmKey'] = async (key) =>{
                var confirmKey = false;

                if (this.settings.submitKeys.indexOf(key) > -1) {
                    confirmKey = true;
                }

                return confirmKey;
            }




            tags['_focusInput'] = async (key) =>{
                this._fixInputWidth();

                if (!this.container.classList.contains(this.settings.containerFocusClass)) {
                    this.container.classList.add(this.settings.containerFocusClass);
                }

                if (this.placeholder) {
                    this.placeholder.style.opacity = 0;
                }
            }


            tags['_blurEvent'] = async (e) =>{
                if (this.container.classList.contains(this.settings.containerFocusClass)) {
                    this.container.classList.remove(this.settings.containerFocusClass);
                }

                if (!this.tag.values.length && this.placeholder) {
                    this.placeholder.style.opacity = 1;
                }

                if (this.settings.saveOnBlur) {
                    e = e || window.event;

                    this._listenForEndOfContainer();

                    if (this.input.value !== '') {
                        this._confirmValidTagEvent(e);
                        return;
                    }

                    if (this.tag.values.length) {
                        this._checkLastTag(e);
                    }
                }
                else {
                    this.input.value = '';
                    this._setInputWidth();
                }
            }


            tags['_keydownEvents'] = async (e) =>{
                e = e || window.event;

                var key = e.keyCode;
                this.pasting = false;

                this._listenForEndOfContainer();

                if (key === 86 && e.metaKey) {
                    this.pasting = true;
                }

                if (this._isConfirmKey(key) && this.input.value !== '') {
                    this._confirmValidTagEvent(e);
                    return;
                }

                if (this.tag.values.length) {
                    this._checkLastTag(e);
                }
            }


            tags['_keyupEvents'] = async (e) =>{
                e = e || window.event;

                this.input.classList.remove('taggle_back');

                _setText(this.sizer, this.input.value);

                if (this.pasting && this.input.value !== '') {
                    this._add(e);
                    this.pasting = false;
                }
            }




            tags['_confirmValidTagEvent'] = async (e) =>{
                e = e || window.event;

                // prevents from jumping out of textarea
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }

                this._add(e);
            }



            tags['_listenForEndOfContainer'] = async () =>{
                var width = this.sizer.getBoundingClientRect().width;
                var max = this.measurements.container.rect.width - this.measurements.container.padding;
                var size = parseInt(this.sizer.style.fontSize, 10);

                // 1.5 just seems to be a good multiplier here
                if (width + (size * 1.5) > parseInt(this.input.style.width, 10)) {
                    this.input.style.width = max + 'px';
                }
            }



            tags['_createTag'] = async (text) =>{
                var li = document.createElement('li');
                var close = document.createElement('button');
                var hidden = document.createElement('input');
                var span = document.createElement('span');

                text = this._formatTag(text);

                close.innerHTML = '&times;';
                close.className = 'close';
                close.type = 'button';
                _on(close, 'click', this._remove.bind(this, close));

                _setText(span, text);
                span.className = 'taggle_text';

                li.className = 'taggle ' + this.settings.additionalTagClasses;

                hidden.type = 'hidden';
                hidden.value = text;
                hidden.name = this.settings.hiddenInputName;

                li.appendChild(span);
                li.appendChild(close);
                li.appendChild(hidden);

                var formatted = this.settings.tagFormatter(li);

                if (typeof formatted !== 'undefined') {
                    li = formatted;
                }

                if (!(li instanceof HTMLElement) || li.tagName !== 'LI') {
                    throw new Error('tagFormatter must return an li element');
                }

                if (this.settings.attachTagId) {
                    this._id += 1;
                    text = {
                        text: text,
                        id: this._id
                    };
                }

                this.tag.values.push(text);
                this.tag.elements.push(li);

                return li;
            }




            tags['_remove'] = async (li, e) =>{
                var self = this;
                var text;
                var elem;
                var index;

                if (li.tagName.toLowerCase() !== 'li') {
                    li = li.parentNode;
                }

                elem = (li.tagName.toLowerCase() === 'a') ? li.parentNode : li;
                index = this.tag.elements.indexOf(elem);

                text = this.tag.values[index];

                function done(error) {
                    if (error) {
                        return;
                    }

                    li.parentNode.removeChild(li);

                    // Going to assume the indicies match for now
                    self.tag.elements.splice(index, 1);
                    self.tag.values.splice(index, 1);

                    self.settings.onTagRemove(e, text);

                    self._focusInput();
                }

                var ret = this.settings.onBeforeTagRemove(e, text, done);

                if (!ret) {
                    return;
                }

                done();
            }

            tags['_formatTag'] = async (text) =>{
                return this.settings.preserveCase ? text : text.toLowerCase();
            }


            tags['getTags'] = async () =>{
                return {
                    elements: this.getTagElements(),
                    values: this.getTagValues()
                };
            }
            tags['getTagElements'] = async () =>{
                return this.tag.elements;
            }


            tags['getTagValues'] = async () =>{
                return [].slice.apply(this.tag.values);
            }



            tags['getInput'] = async () =>{
                return this.input;
            }
            tags['getContainer'] = async () =>{
                return this.container;
            }


            tags['add'] = async (text) =>{
                var isArr = _isArray(text);

                if (isArr) {
                    for (var i = 0, len = text.length; i < len; i++) {
                        if (typeof text[i] === 'string') {
                            this._add(null, text[i]);
                        }
                    }
                }
                else {
                    this._add(null, text);
                }

                return this;
            }

            tags['remove'] = async (text, all) =>{
                var len = this.tag.values.length - 1;
                var found = false;

                while (len > -1) {
                    var tagText = this.tag.values[len];
                    if (this.settings.attachTagId) {
                        tagText = tagText.text;
                    }

                    if (tagText === text) {
                        found = true;
                        this._remove(this.tag.elements[len]);
                    }

                    if (found && !all) {
                        break;
                    }

                    len--;
                }

                return this;
            }

            tags['removeAll'] = async () =>{
                for (var i = this.tag.values.length - 1; i >= 0; i--) {
                    this._remove(this.tag.elements[i]);
                }

                return this;
            }




        })()
    }
    disconnectedCallback() {}
    componentWillMount() {}
    componentDidMount() {}
    componentWillUnmount() {}
    componentDidUnmount() {}
}
window.customElements.define('tags-index', tags);
