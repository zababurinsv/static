let object = {}
export default async (obj)=>{
    return new Promise(async (resolve, reject) => {
        if (!navigator.gpu) {
            console.log('WebGPU is not supported. Enable chrome://flags/#enable-unsafe-webgpu flag.')
            return;
        }

        object['adapter'] = await navigator.gpu.requestAdapter();
        object['device'] = await object['adapter'].requestDevice();
        [object['gpuBuffer'], object['arrayBuffer']] = object['device'].createBufferMapped({
            size: 4,
            usage: GPUBufferUsage.MAP_WRITE
        });
        [object['gpuWriteBuffer'], object['arrayBuffer']] = object['device'].createBufferMapped({
            size: 4,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
        });

        new Uint8Array(object['arrayBuffer']).set([0, 1, 2, 3]);

        object['gpuWriteBuffer'].unmap();

        // Get a GPU buffer for reading in an unmapped state.
        object['gpuReadBuffer'] = object['device'].createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });


        // Encode commands for copying buffer to buffer.
        object['copyEncoder'] = object['device'].createCommandEncoder();
        object['copyEncoder'].copyBufferToBuffer(
            object['gpuWriteBuffer'] /* source buffer */,
            0 /* source offset */,
            object['gpuReadBuffer'] /* destination buffer */,
            0 /* destination offset */,
            4 /* size */
        );
        object['copyCommands'] = object['copyEncoder'].finish();
        object['device'].defaultQueue.submit([object['copyCommands']]);

        object['copyArrayBuffer'] = await object['gpuReadBuffer'].mapReadAsync();
        console.log(new Uint8Array(object['copyArrayBuffer']));

        object['class'] = class Speech {
            constructor(name) {


            }
            self() {
                return object
            }
        }
        resolve(object)
    })
}