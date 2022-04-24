import { IDBFS } from '/static/html/components/component_modules/fs/modules/fs/index.mjs';
import * as Comlink from "/static/html/components/component_modules/fs/modules/comlink/dist/esm/comlink.mjs";
(async () => {
  const idbfs = await IDBFS();
  const obj = {
    create: {
      dir: idbfs.create.dir
    },
    is: {
      file: idbfs.is.file,
      dir: idbfs.is.dir
    },
    get: {
      all: {
        files: async (dir, call) => {
          call(await idbfs.get.all.files(dir))
        }
      },
      dir: idbfs.get.dir,
      file: idbfs.get.file
    },
    set: {
      file: idbfs.set.file,
      data: idbfs.set.data
    },
    file: {
      rename: idbfs.file.rename
    },
    load: idbfs.load,
    save: idbfs.save,
    info: () => {
      console.log(JSON.stringify({
        create: {
          dir: '() => {}'
        },
        is: {
          file: '() => {}',
          dir: '() => {}'
        },
        get: {
          all: {
            files: '() => {}'
          },
          dir: '() => {}',
          file: '() => {}'
        },
        set: {
          file: '( file, contents, path ) => {}',
          data: '() => {}'
        },
        file: {
          rename: '() => {}'
        }
      }, null, 4))
    }
  }

  onmessage = function (event) {
    if (event.data.state.isConnected && event.data.state.type === 'main-memory') {
      console.log('🌷 🎫 main-memory message', event.data.state)
      for (let port in event.data.state.from) {
        Comlink.expose(obj, event.data.state.from[port])
      }
      self.postMessage({
        state: {
          'main-memory': true
        }
      })
    }
  }

  self.postMessage({
    state: {
      install: true
    }
  })
})()