/**
 * Язык тернарного описания
 * @namespace LTD
 */
/**
 * @memberof LTD
 * @typedef {Object} T
 * @property {String} name - type ltd.
 * @property {String} type - type bio.
 */
 /**
 * @memberof LTD
 * @typedef {Object} System
 * @property {boolean} v - views
 * @property {any} p - property
 * @property {String} c - color
 * @property {T} s - substrate
 * @property {String} r - relation
 */

/**
 * @memberof Utils
 * @function createDocs
 * @param {Object} data
 * @return String
 */
function createDocs (data) {

}
export default async () => {
  let core = await import('/static/html/components/component_modules/ride/index.mjs')
  core = core.Core
  let type = core.message.ltd
  console.assert(false, core)
  createDocs({
    FunctionsDoc: core.message.FunctionsDoc,
    doc: core.message.doc
  })
  let ltd = {
   /**
   * @memberof RAID
   * @function toBytes
   * @param {string} s
   * @return Bytes
   */
   toBytes: (s) => { },

   /**
   * @memberof LTD
   * @function synthesis
   * @param {T} a object
   * @param {T} b object
   * */
   synthesis: (a, b) => {
     return new Promise(function (resolve) {
       try {
         console.assert(false, core)
         let out = ''
         switch (a.name) {
           case 't':
             switch (b.name) {
               case 't':
                 out = 't'
                 break
               case `t'`:
                 out = 't'
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `t'`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `T'`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `a`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `A`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `Lt`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `Lt'`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           case `La`:
             switch (b.name) {
               case 't':
                 break
               case `t'`:
                 break
               case `T'`:
                 break
               case `a`:
                 break
               case `A`:
                 break
               case `Lt`:
                 break
               case `Lt'`:
                 break
               case `La`:
                 break
               default:
                 console.assert(false, 'нет такого типа')
             }
             break
           default:
             console.assert(false, 'нет такого типа')
         }
         resolve( {
           status: '',
           success: true,
           message: out,
           _scriptDir: import.meta.url
         })
       } catch (e) {
         resolve({
           _scriptDir: import.meta.url,
           status: '',
           success: false,
           message: e
         })
       }
     })
   },
   core: await core
 }

  return ltd
}