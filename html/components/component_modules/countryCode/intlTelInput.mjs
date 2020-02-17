window.intlTelInputGlobals={getInstance:t=>{const e=t.getAttribute("data-intl-tel-input-id");return window.intlTelInputGlobals.instances[e]},instances:{}};let id=0;const defaults={allowDropdown:!0,autoHideDialCode:!0,autoPlaceholder:"polite",customContainer:"",customPlaceholder:null,dropdownContainer:null,excludeCountries:[],formatOnDisplay:!0,geoIpLookup:null,hiddenInput:"",initialCountry:"",localizedCountries:null,nationalMode:!0,onlyCountries:[],placeholderNumberType:"MOBILE",preferredCountries:["us","gb"],separateDialCode:!1,utilsScript:""},regionlessNanpNumbers=["800","822","833","844","855","866","877","880","881","882","883","884","885","886","887","888","889"];window.addEventListener("load",()=>{window.intlTelInputGlobals.windowLoaded=!0});const forEachProp=(t,e)=>{const i=Object.keys(t);for(let s=0;s<i.length;s++)e(i[s],t[i[s]])},forEachInstance=t=>{forEachProp(window.intlTelInputGlobals.instances,e=>{window.intlTelInputGlobals.instances[e][t]()})};class Iti{constructor(t,e){this.id=id++,this.telInput=t,this.activeItem=null,this.highlightedItem=null;const i=e||{};this.options={},forEachProp(defaults,(t,e)=>{this.options[t]=i.hasOwnProperty(t)?i[t]:e}),this.hadInitialPlaceholder=Boolean(t.getAttribute("placeholder"))}_init(){if(this.options.nationalMode&&(this.options.autoHideDialCode=!1),this.options.separateDialCode&&(this.options.autoHideDialCode=this.options.nationalMode=!1),this.isMobile=/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.isMobile&&(document.body.classList.add("iti-mobile"),this.options.dropdownContainer||(this.options.dropdownContainer=document.body)),"undefined"!=typeof Promise){const t=new Promise((t,e)=>{this.resolveAutoCountryPromise=t,this.rejectAutoCountryPromise=e}),e=new Promise((t,e)=>{this.resolveUtilsScriptPromise=t,this.rejectUtilsScriptPromise=e});this.promise=Promise.all([t,e])}else this.resolveAutoCountryPromise=this.rejectAutoCountryPromise=(()=>{}),this.resolveUtilsScriptPromise=this.rejectUtilsScriptPromise=(()=>{});this.selectedCountryData={},this._processCountryData(),this._generateMarkup(),this._setInitialState(),this._initListeners(),this._initRequests()}_processCountryData(){this._processAllCountries(),this._processCountryCodes(),this._processPreferredCountries(),this.options.localizedCountries&&this._translateCountriesByLocale(),(this.options.onlyCountries.length||this.options.localizedCountries)&&this.countries.sort(this._countryNameSort)}_addCountryCode(t,e,i){e.length>this.dialCodeMaxLen&&(this.dialCodeMaxLen=e.length),this.countryCodes.hasOwnProperty(e)||(this.countryCodes[e]=[]);for(let i=0;i<this.countryCodes[e].length;i++)if(this.countryCodes[e][i]===t)return;const s=void 0!==i?i:this.countryCodes[e].length;this.countryCodes[e][s]=t}_processAllCountries(){if(this.options.onlyCountries.length){const t=this.options.onlyCountries.map(t=>t.toLowerCase());this.countries=allCountries.filter(e=>t.indexOf(e.iso2)>-1)}else if(this.options.excludeCountries.length){const t=this.options.excludeCountries.map(t=>t.toLowerCase());this.countries=allCountries.filter(e=>-1===t.indexOf(e.iso2))}else this.countries=allCountries}_translateCountriesByLocale(){for(let t=0;t<this.countries.length;t++){const e=this.countries[t].iso2.toLowerCase();this.options.localizedCountries.hasOwnProperty(e)&&(this.countries[t].name=this.options.localizedCountries[e])}}_countryNameSort(t,e){return t.name.localeCompare(e.name)}_processCountryCodes(){this.dialCodeMaxLen=0,this.countryCodes={};for(let t=0;t<this.countries.length;t++){const e=this.countries[t];this._addCountryCode(e.iso2,e.dialCode,e.priority)}for(let t=0;t<this.countries.length;t++){const e=this.countries[t];if(e.areaCodes){const t=this.countryCodes[e.dialCode][0];for(let i=0;i<e.areaCodes.length;i++){const s=e.areaCodes[i];for(let i=1;i<s.length;i++){const o=e.dialCode+s.substr(0,i);this._addCountryCode(t,o),this._addCountryCode(e.iso2,o)}this._addCountryCode(e.iso2,e.dialCode+s)}}}}_processPreferredCountries(){this.preferredCountries=[];for(let t=0;t<this.options.preferredCountries.length;t++){const e=this.options.preferredCountries[t].toLowerCase(),i=this._getCountryData(e,!1,!0);i&&this.preferredCountries.push(i)}}_createEl(t,e,i){const s=document.createElement(t);return e&&forEachProp(e,(t,e)=>s.setAttribute(t,e)),i&&i.appendChild(s),s}_generateMarkup(){this.telInput.setAttribute("autocomplete","off");let t="iti";this.options.allowDropdown&&(t+=" iti--allow-dropdown"),this.options.separateDialCode&&(t+=" iti--separate-dial-code"),this.options.customContainer&&(t+=" ",t+=this.options.customContainer);const e=this._createEl("div",{class:t});if(this.telInput.parentNode.insertBefore(e,this.telInput),this.flagsContainer=this._createEl("div",{class:"iti__flag-container"},e),e.appendChild(this.telInput),this.selectedFlag=this._createEl("div",{class:"iti__selected-flag",role:"combobox","aria-owns":"country-listbox"},this.flagsContainer),this.selectedFlagInner=this._createEl("div",{class:"iti__flag"},this.selectedFlag),this.options.separateDialCode&&(this.selectedDialCode=this._createEl("div",{class:"iti__selected-dial-code"},this.selectedFlag)),this.options.allowDropdown&&(this.selectedFlag.setAttribute("tabindex","0"),this.dropdownArrow=this._createEl("div",{class:"iti__arrow"},this.selectedFlag),this.countryList=this._createEl("ul",{class:"iti__country-list iti__hide",id:"country-listbox","aria-expanded":"false",role:"listbox"}),this.preferredCountries.length&&(this._appendListItems(this.preferredCountries,"iti__preferred"),this._createEl("li",{class:"iti__divider",role:"separator","aria-disabled":"true"},this.countryList)),this._appendListItems(this.countries,"iti__standard"),this.options.dropdownContainer?(this.dropdown=this._createEl("div",{class:"iti iti--container"}),this.dropdown.appendChild(this.countryList)):this.flagsContainer.appendChild(this.countryList)),this.options.hiddenInput){let t=this.options.hiddenInput;const i=this.telInput.getAttribute("name");if(i){const e=i.lastIndexOf("[");-1!==e&&(t=`${i.substr(0,e)}[${t}]`)}this.hiddenInput=this._createEl("input",{type:"hidden",name:t}),e.appendChild(this.hiddenInput)}}_appendListItems(t,e){let i="";for(let s=0;s<t.length;s++){const o=t[s];i+=`<li class='iti__country ${e}' tabIndex='-1' id='iti-item-${o.iso2}' role='option' data-dial-code='${o.dialCode}' data-country-code='${o.iso2}'>`,i+=`<div class='iti__flag-box'><div class='iti__flag iti__${o.iso2}'></div></div>`,i+=`<span class='iti__country-name'>${o.name}</span>`,i+=`<span class='iti__dial-code'>+${o.dialCode}</span>`,i+="</li>"}this.countryList.insertAdjacentHTML("beforeend",i)}_setInitialState(){const t=this.telInput.value,e=this._getDialCode(t),i=this._isRegionlessNanp(t),{initialCountry:s,nationalMode:o,autoHideDialCode:n,separateDialCode:l}=this.options;e&&!i?this._updateFlagFromNumber(t):"auto"!==s&&(s?this._setFlag(s.toLowerCase()):e&&i?this._setFlag("us"):(this.defaultCountry=this.preferredCountries.length?this.preferredCountries[0].iso2:this.countries[0].iso2,t||this._setFlag(this.defaultCountry)),t||o||n||l||(this.telInput.value=`+${this.selectedCountryData.dialCode}`)),t&&this._updateValFromNumber(t)}_initListeners(){this._initKeyListeners(),this.options.autoHideDialCode&&this._initBlurListeners(),this.options.allowDropdown&&this._initDropdownListeners(),this.hiddenInput&&this._initHiddenInputListener()}_initHiddenInputListener(){this._handleHiddenInputSubmit=(()=>{this.hiddenInput.value=this.getNumber()}),this.telInput.form&&this.telInput.form.addEventListener("submit",this._handleHiddenInputSubmit)}_getClosestLabel(){let t=this.telInput;for(;t&&"LABEL"!==t.tagName;)t=t.parentNode;return t}_initDropdownListeners(){this._handleLabelClick=(t=>{this.countryList.classList.contains("iti__hide")?this.telInput.focus():t.preventDefault()});const t=this._getClosestLabel();t&&t.addEventListener("click",this._handleLabelClick),this._handleClickSelectedFlag=(()=>{!this.countryList.classList.contains("iti__hide")||this.telInput.disabled||this.telInput.readOnly||this._showDropdown()}),this.selectedFlag.addEventListener("click",this._handleClickSelectedFlag),this._handleFlagsContainerKeydown=(t=>{this.countryList.classList.contains("iti__hide")&&-1!==["ArrowUp","ArrowDown"," ","Enter"].indexOf(t.key)&&(t.preventDefault(),t.stopPropagation(),this._showDropdown()),"Tab"===t.key&&this._closeDropdown()}),this.flagsContainer.addEventListener("keydown",this._handleFlagsContainerKeydown)}_initRequests(){this.options.utilsScript&&!window.intlTelInputUtils?window.intlTelInputGlobals.windowLoaded?window.intlTelInputGlobals.loadUtils(this.options.utilsScript):window.addEventListener("load",()=>{window.intlTelInputGlobals.loadUtils(this.options.utilsScript)}):this.resolveUtilsScriptPromise(),"auto"===this.options.initialCountry?this._loadAutoCountry():this.resolveAutoCountryPromise()}_loadAutoCountry(){window.intlTelInputGlobals.autoCountry?this.handleAutoCountry():window.intlTelInputGlobals.startedLoadingAutoCountry||(window.intlTelInputGlobals.startedLoadingAutoCountry=!0,"function"==typeof this.options.geoIpLookup&&this.options.geoIpLookup(t=>{window.intlTelInputGlobals.autoCountry=t.toLowerCase(),setTimeout(()=>forEachInstance("handleAutoCountry"))},()=>forEachInstance("rejectAutoCountryPromise")))}_initKeyListeners(){this._handleKeyupEvent=(()=>{this._updateFlagFromNumber(this.telInput.value)&&this._triggerCountryChange()}),this.telInput.addEventListener("keyup",this._handleKeyupEvent),this._handleClipboardEvent=(()=>{setTimeout(this._handleKeyupEvent)}),this.telInput.addEventListener("cut",this._handleClipboardEvent),this.telInput.addEventListener("paste",this._handleClipboardEvent)}_cap(t){const e=this.telInput.getAttribute("maxlength");return e&&t.length>e?t.substr(0,e):t}_initBlurListeners(){this._handleSubmitOrBlurEvent=(()=>{this._removeEmptyDialCode()}),this.telInput.form&&this.telInput.form.addEventListener("submit",this._handleSubmitOrBlurEvent),this.telInput.addEventListener("blur",this._handleSubmitOrBlurEvent)}_removeEmptyDialCode(){if("+"===this.telInput.value.charAt(0)){const t=this._getNumeric(this.telInput.value);t&&this.selectedCountryData.dialCode!==t||(this.telInput.value="")}}_getNumeric(t){return t.replace(/\D/g,"")}_trigger(t){const e=document.createEvent("Event");e.initEvent(t,!0,!0),this.telInput.dispatchEvent(e)}_showDropdown(){this.countryList.classList.remove("iti__hide"),this.countryList.setAttribute("aria-expanded","true"),this._setDropdownPosition(),this.activeItem&&(this._highlightListItem(this.activeItem,!1),this._scrollTo(this.activeItem,!0)),this._bindDropdownListeners(),this.dropdownArrow.classList.add("iti__arrow--up"),this._trigger("open:countrydropdown")}_toggleClass(t,e,i){i&&!t.classList.contains(e)?t.classList.add(e):!i&&t.classList.contains(e)&&t.classList.remove(e)}_setDropdownPosition(){if(this.options.dropdownContainer&&this.options.dropdownContainer.appendChild(this.dropdown),!this.isMobile){const t=this.telInput.getBoundingClientRect(),e=window.pageYOffset||document.documentElement.scrollTop,i=t.top+e,s=this.countryList.offsetHeight,o=i+this.telInput.offsetHeight+s<e+window.innerHeight,n=i-s>e;if(this._toggleClass(this.countryList,"iti__country-list--dropup",!o&&n),this.options.dropdownContainer){const e=!o&&n?0:this.telInput.offsetHeight;this.dropdown.style.top=`${i+e}px`,this.dropdown.style.left=`${t.left+document.body.scrollLeft}px`,this._handleWindowScroll=(()=>this._closeDropdown()),window.addEventListener("scroll",this._handleWindowScroll)}}}_getClosestListItem(t){let e=t;for(;e&&e!==this.countryList&&!e.classList.contains("iti__country");)e=e.parentNode;return e===this.countryList?null:e}_bindDropdownListeners(){this._handleMouseoverCountryList=(t=>{const e=this._getClosestListItem(t.target);e&&this._highlightListItem(e,!1)}),this.countryList.addEventListener("mouseover",this._handleMouseoverCountryList),this._handleClickCountryList=(t=>{const e=this._getClosestListItem(t.target);e&&this._selectListItem(e)}),this.countryList.addEventListener("click",this._handleClickCountryList);let t=!0;this._handleClickOffToClose=(()=>{t||this._closeDropdown(),t=!1}),document.documentElement.addEventListener("click",this._handleClickOffToClose);let e="",i=null;this._handleKeydownOnDropdown=(t=>{t.preventDefault(),"ArrowUp"===t.key||"ArrowDown"===t.key?this._handleUpDownKey(t.key):"Enter"===t.key?this._handleEnterKey():"Escape"===t.key?this._closeDropdown():/^[a-zA-ZÀ-ÿ ]$/.test(t.key)&&(i&&clearTimeout(i),e+=t.key.toLowerCase(),this._searchForCountry(e),i=setTimeout(()=>{e=""},1e3))}),document.addEventListener("keydown",this._handleKeydownOnDropdown)}_handleUpDownKey(t){let e="ArrowUp"===t?this.highlightedItem.previousElementSibling:this.highlightedItem.nextElementSibling;e&&(e.classList.contains("iti__divider")&&(e="ArrowUp"===t?e.previousElementSibling:e.nextElementSibling),this._highlightListItem(e,!0))}_handleEnterKey(){this.highlightedItem&&this._selectListItem(this.highlightedItem)}_searchForCountry(t){for(let e=0;e<this.countries.length;e++)if(this._startsWith(this.countries[e].name,t)){const t=this.countryList.querySelector(`#iti-item-${this.countries[e].iso2}`);this._highlightListItem(t,!1),this._scrollTo(t,!0);break}}_startsWith(t,e){return t.substr(0,e.length).toLowerCase()===e}_updateValFromNumber(t){let e=t;if(this.options.formatOnDisplay&&window.intlTelInputUtils&&this.selectedCountryData){const t=!this.options.separateDialCode&&(this.options.nationalMode||"+"!==e.charAt(0)),{NATIONAL:i,INTERNATIONAL:s}=intlTelInputUtils.numberFormat,o=t?i:s;e=intlTelInputUtils.formatNumber(e,this.selectedCountryData.iso2,o)}e=this._beforeSetNumber(e),this.telInput.value=e}_updateFlagFromNumber(t){let e=t;const i=this.selectedCountryData.dialCode,s="1"===i;e&&this.options.nationalMode&&s&&"+"!==e.charAt(0)&&("1"!==e.charAt(0)&&(e=`1${e}`),e=`+${e}`),this.options.separateDialCode&&i&&"+"!==e.charAt(0)&&(e=`+${i}${e}`);const o=this._getDialCode(e),n=this._getNumeric(e);let l=null;if(o){const t=this.countryCodes[this._getNumeric(o)],e=-1!==t.indexOf(this.selectedCountryData.iso2)&&n.length<=o.length-1;if(!("1"===i&&this._isRegionlessNanp(n)||e))for(let e=0;e<t.length;e++)if(t[e]){l=t[e];break}}else"+"===e.charAt(0)&&n.length?l="":e&&"+"!==e||(l=this.defaultCountry);return null!==l&&this._setFlag(l)}_isRegionlessNanp(t){const e=this._getNumeric(t);if("1"===e.charAt(0)){const t=e.substr(1,3);return-1!==regionlessNanpNumbers.indexOf(t)}return!1}_highlightListItem(t,e){const i=this.highlightedItem;i&&i.classList.remove("iti__highlight"),this.highlightedItem=t,this.highlightedItem.classList.add("iti__highlight"),e&&this.highlightedItem.focus()}_getCountryData(t,e,i){const s=e?allCountries:this.countries;for(let e=0;e<s.length;e++)if(s[e].iso2===t)return s[e];if(i)return null;throw new Error(`No country data for '${t}'`)}_setFlag(t){const e=this.selectedCountryData.iso2?this.selectedCountryData:{};this.selectedCountryData=t?this._getCountryData(t,!1,!1):{},this.selectedCountryData.iso2&&(this.defaultCountry=this.selectedCountryData.iso2),this.selectedFlagInner.setAttribute("class",`iti__flag iti__${t}`);const i=t?`${this.selectedCountryData.name}: +${this.selectedCountryData.dialCode}`:"Unknown";if(this.selectedFlag.setAttribute("title",i),this.options.separateDialCode){const t=this.selectedCountryData.dialCode?`+${this.selectedCountryData.dialCode}`:"";this.selectedDialCode.innerHTML=t;const e=this.selectedFlag.offsetWidth||this._getHiddenSelectedFlagWidth();this.telInput.style.paddingLeft=`${e+6}px`}if(this._updatePlaceholder(),this.options.allowDropdown){const e=this.activeItem;if(e&&(e.classList.remove("iti__active"),e.setAttribute("aria-selected","false")),t){const e=this.countryList.querySelector(`#iti-item-${t}`);e.setAttribute("aria-selected","true"),e.classList.add("iti__active"),this.activeItem=e,this.countryList.setAttribute("aria-activedescendant",e.getAttribute("id"))}}return e.iso2!==t}_getHiddenSelectedFlagWidth(){const t=this.telInput.parentNode.cloneNode();t.style.visibility="hidden",document.body.appendChild(t);const e=this.selectedFlag.cloneNode(!0);t.appendChild(e);const i=e.offsetWidth;return t.remove(),i}_updatePlaceholder(){const t="aggressive"===this.options.autoPlaceholder||!this.hadInitialPlaceholder&&"polite"===this.options.autoPlaceholder;if(window.intlTelInputUtils&&t){const t=intlTelInputUtils.numberType[this.options.placeholderNumberType];let e=this.selectedCountryData.iso2?intlTelInputUtils.getExampleNumber(this.selectedCountryData.iso2,this.options.nationalMode,t):"";e=this._beforeSetNumber(e),"function"==typeof this.options.customPlaceholder&&(e=this.options.customPlaceholder(e,this.selectedCountryData)),this.telInput.setAttribute("placeholder",e)}}_selectListItem(t){const e=this._setFlag(t.getAttribute("data-country-code"));this._closeDropdown(),this._updateDialCode(t.getAttribute("data-dial-code"),!0),this.telInput.focus();const i=this.telInput.value.length;this.telInput.setSelectionRange(i,i),e&&this._triggerCountryChange()}_closeDropdown(){this.countryList.classList.add("iti__hide"),this.countryList.setAttribute("aria-expanded","false"),this.dropdownArrow.classList.remove("iti__arrow--up"),document.removeEventListener("keydown",this._handleKeydownOnDropdown),document.documentElement.removeEventListener("click",this._handleClickOffToClose),this.countryList.removeEventListener("mouseover",this._handleMouseoverCountryList),this.countryList.removeEventListener("click",this._handleClickCountryList),this.options.dropdownContainer&&(this.isMobile||window.removeEventListener("scroll",this._handleWindowScroll),this.dropdown.parentNode&&this.dropdown.parentNode.removeChild(this.dropdown)),this._trigger("close:countrydropdown")}_scrollTo(t,e){const i=this.countryList,s=window.pageYOffset||document.documentElement.scrollTop,o=i.offsetHeight,n=i.getBoundingClientRect().top+s,l=n+o,r=t.offsetHeight,a=t.getBoundingClientRect().top+s,d=a+r;let h=a-n+i.scrollTop;const u=o/2-r/2;if(a<n)e&&(h-=u),i.scrollTop=h;else if(d>l){e&&(h+=u);const t=o-r;i.scrollTop=h-t}}_updateDialCode(t,e){const i=this.telInput.value,s=`+${t}`;let o;if("+"===i.charAt(0)){const t=this._getDialCode(i);o=t?i.replace(t,s):s}else{if(this.options.nationalMode||this.options.separateDialCode)return;if(i)o=s+i;else{if(!e&&this.options.autoHideDialCode)return;o=s}}this.telInput.value=o}_getDialCode(t){let e="";if("+"===t.charAt(0)){let i="";for(let s=0;s<t.length;s++){const o=t.charAt(s);if(!isNaN(parseInt(o,10))&&(i+=o,this.countryCodes[i]&&(e=t.substr(0,s+1)),i.length===this.dialCodeMaxLen))break}}return e}_getFullNumber(){const t=this.telInput.value.trim(),{dialCode:e}=this.selectedCountryData;let i;const s=this._getNumeric(t);return(i=this.options.separateDialCode&&"+"!==t.charAt(0)&&e&&s?`+${e}`:"")+t}_beforeSetNumber(t){let e=t;if(this.options.separateDialCode){let t=this._getDialCode(e);if(t){const i=" "===e[(t=`+${this.selectedCountryData.dialCode}`).length]||"-"===e[t.length]?t.length+1:t.length;e=e.substr(i)}}return this._cap(e)}_triggerCountryChange(){this._trigger("countrychange")}handleAutoCountry(){"auto"===this.options.initialCountry&&(this.defaultCountry=window.intlTelInputGlobals.autoCountry,this.telInput.value||this.setCountry(this.defaultCountry),this.resolveAutoCountryPromise())}handleUtils(){window.intlTelInputUtils&&(this.telInput.value&&this._updateValFromNumber(this.telInput.value),this._updatePlaceholder()),this.resolveUtilsScriptPromise()}destroy(){const{form:t}=this.telInput;if(this.options.allowDropdown){this._closeDropdown(),this.selectedFlag.removeEventListener("click",this._handleClickSelectedFlag),this.flagsContainer.removeEventListener("keydown",this._handleFlagsContainerKeydown);const t=this._getClosestLabel();t&&t.removeEventListener("click",this._handleLabelClick)}this.hiddenInput&&t&&t.removeEventListener("submit",this._handleHiddenInputSubmit),this.options.autoHideDialCode&&(t&&t.removeEventListener("submit",this._handleSubmitOrBlurEvent),this.telInput.removeEventListener("blur",this._handleSubmitOrBlurEvent)),this.telInput.removeEventListener("keyup",this._handleKeyupEvent),this.telInput.removeEventListener("cut",this._handleClipboardEvent),this.telInput.removeEventListener("paste",this._handleClipboardEvent),this.telInput.removeAttribute("data-intl-tel-input-id");const e=this.telInput.parentNode;e.parentNode.insertBefore(this.telInput,e),e.parentNode.removeChild(e),delete window.intlTelInputGlobals.instances[this.id]}getExtension(){return window.intlTelInputUtils?intlTelInputUtils.getExtension(this._getFullNumber(),this.selectedCountryData.iso2):""}getNumber(t){if(window.intlTelInputUtils){const{iso2:e}=this.selectedCountryData;return intlTelInputUtils.formatNumber(this._getFullNumber(),e,t)}return""}getNumberType(){return window.intlTelInputUtils?intlTelInputUtils.getNumberType(this._getFullNumber(),this.selectedCountryData.iso2):-99}getSelectedCountryData(){return this.selectedCountryData}getValidationError(){if(window.intlTelInputUtils){const{iso2:t}=this.selectedCountryData;return intlTelInputUtils.getValidationError(this._getFullNumber(),t)}return-99}isValidNumber(){const t=this._getFullNumber().trim(),e=this.options.nationalMode?this.selectedCountryData.iso2:"";return window.intlTelInputUtils?intlTelInputUtils.isValidNumber(t,e):null}setCountry(t){const e=t.toLowerCase();this.selectedFlagInner.classList.contains(`iti__${e}`)||(this._setFlag(e),this._updateDialCode(this.selectedCountryData.dialCode,!1),this._triggerCountryChange())}setNumber(t){const e=this._updateFlagFromNumber(t);this._updateValFromNumber(t),e&&this._triggerCountryChange()}setPlaceholderNumberType(t){this.options.placeholderNumberType=t,this._updatePlaceholder()}}window.intlTelInputGlobals.getCountryData=(()=>allCountries);const injectScript=(t,e,i)=>{const s=document.createElement("script");s.onload=(()=>{forEachInstance("handleUtils"),e&&e()}),s.onerror=(()=>{forEachInstance("rejectUtilsScriptPromise"),i&&i()}),s.className="iti-load-utils",s.async=!0,s.src=t,document.body.appendChild(s)};window.intlTelInputGlobals.loadUtils=(t=>{if(!window.intlTelInputUtils&&!window.intlTelInputGlobals.startedLoadingUtilsScript){if(window.intlTelInputGlobals.startedLoadingUtilsScript=!0,"undefined"!=typeof Promise)return new Promise((e,i)=>injectScript(t,e,i));injectScript(t)}return null}),window.intlTelInputGlobals.defaults=defaults,window.intlTelInputGlobals.version="<%= version %>";