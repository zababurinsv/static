export default obj=>new Promise(function(resolve,reject){bundle.default(obj,null,async function(error,config){let template=config.babel.transform("\n\n            let React =   config['React']\n            resolve(() => {\n              return (\n                <div>\n                  <img\n                    src='/static/html/react/waves-auth/common/spinner.gif'\n                    style={{ width: '200px', margin: 'auto', display: 'block' }}\n                    alt=\"Loading...\"\n                  />\n                </div>\n              );\n            }) \n            ",config.babel.availablePresets.react);eval(template.code)})});