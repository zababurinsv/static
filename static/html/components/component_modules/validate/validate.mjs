export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'form':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'request':
                                (async (obj, props,data) => {
                                    try {


                                        function showError(container, errorMessage) {
                                            container.className = 'error';
                                            var msgElem = document.createElement('span');
                                            msgElem.className = "error-message";
                                            msgElem.innerHTML = errorMessage;
                                            container.appendChild(msgElem);
                                        }

                                        function resetError(container) {
                                            container.className = '';
                                            if (container.lastChild.className == "error-message") {
                                                container.removeChild(container.lastChild);
                                            }
                                        }

                                        function validate(form) {
                                            var elems = form.elements;

                                            resetError(elems.from.parentNode);
                                            if (!elems.from.value) {
                                                showError(elems.from.parentNode, ' Укажите от кого.');
                                            }

                                            resetError(elems.password.parentNode);
                                            if (!elems.password.value) {
                                                showError(elems.password.parentNode, ' Укажите пароль.');
                                            } else if (elems.password.value != elems.password2.value) {
                                                showError(elems.password.parentNode, ' Пароли не совпадают.');
                                            }

                                            resetError(elems.to.parentNode);
                                            if (!elems.to.value) {
                                                showError(elems.to.parentNode, ' Укажите, куда.');
                                            }

                                            resetError(elems.message.parentNode);
                                            if (!elems.message.value) {
                                                showError(elems.message.parentNode, ' Отсутствует текст.');
                                            }

                                        }

                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
