import Module from"/static/html/components/component_modules/oscillator/RingBuffer.mjs";import{HeapAudioBuffer,RingBuffer}from"/static/html/components/component_modules/oscillator/helper.mjs";class RingBufferWorkletProcessor extends AudioWorkletProcessor{constructor(e){super(),this._kernelBufferSize=e.processorOptions.kernelBufferSize,this._channelCount=e.processorOptions.channelCount,this._inputRingBuffer=new RingBuffer(this._kernelBufferSize,this._channelCount),this._outputRingBuffer=new RingBuffer(this._kernelBufferSize,this._channelCount),this._heapInputBuffer=new HeapAudioBuffer(Module,this._kernelBufferSize,this._channelCount),this._heapOutputBuffer=new HeapAudioBuffer(Module,this._kernelBufferSize,this._channelCount),this._kernel=new Module.VariableBufferKernel(this._kernelBufferSize)}process(e,t,r){let n=e[0],u=t[0];return this._inputRingBuffer.push(n),this._inputRingBuffer.framesAvailable>=this._kernelBufferSize&&(this._inputRingBuffer.pull(this._heapInputBuffer.getChannelData()),this._kernel.process(this._heapInputBuffer.getHeapAddress(),this._heapOutputBuffer.getHeapAddress(),this._channelCount),this._outputRingBuffer.push(this._heapOutputBuffer.getChannelData())),this._outputRingBuffer.pull(u),!0}}registerProcessor("processor",RingBufferWorkletProcessor);