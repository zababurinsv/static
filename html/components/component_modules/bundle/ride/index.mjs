import interop from '/static/html/components/component_modules/bundle/ride/interop.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'

function wrappedCompile(code, estimatorVersion = 2) {
    if (typeof code !== 'string') {
        return {
            error: 'Type error: contract should be string'
        }
    }
    try {
        const result = waves.scalaJsCompiler.compile(code, estimatorVersion);
        if (result.error) {
            try {
                result.size = new Uint8Array(result.result).length;
            } catch (e) {
            }
            return result;
        } else {
            const bytes = new Uint8Array(result.result);
            const {ast, complexity, verifierComplexity, callableComplexities, userFunctionComplexities, globalVariableComplexities, stateCallsComplexities} = result;
            return {
                result: {
                    bytes,
                    base64: waves.crypto.base64Encode(bytes),
                    size: bytes.byteLength,
                    ast,
                    complexity,
                    verifierComplexity,
                    callableComplexities,
                    userFunctionComplexities,
                    globalVariableComplexities,
                    stateCallsComplexities
                }
            }
        }
    } catch (e) {
        console.log(e)
        return typeof e === 'object' ?
            {error: e.message} :
            {error: e}
    }
}

function wrappedRepl(opts) {
    const repl = (opts != null)
        ? waves.scalaJsCompiler.repl(new waves.scalaJsCompiler.NodeConnectionSettings(opts.nodeUrl, opts.chainId.charCodeAt(0), opts.address))
        : waves.scalaJsCompiler.repl();

    const wrapReconfigure = (repl) => {
        let reconfigureFn = repl.reconfigure.bind(repl);
        return (opts) => {
            const settings = new waves.scalaJsCompiler.NodeConnectionSettings(opts.nodeUrl, opts.chainId.charCodeAt(0), opts.address);
            const newRepl = reconfigureFn(settings);
            newRepl.reconfigure = wrapReconfigure(newRepl);
            return newRepl;
        }
    };

    repl.reconfigure = wrapReconfigure(repl);

    return repl
}

const flattenCompilationResult = (compiled) => {
    let result = {};
    if (compiled.error) {
        if (compiled.result) {
            const bytes = new Uint8Array(compiled.result);
            const base64 = crypto.base64Encode(bytes);
            result = {...compiled, base64};
            result.result && delete result.result
        }
    } else {
        result = compiled.result
    }
    return result
}

export const api = {
    compile: wrappedCompile,
    repl: wrappedRepl,
    get contractLimits() {
        return waves.scalaJsCompiler.contractLimits()
    },
    get version() {
        const version = waves.scalaJsCompiler.nodeVersion();
        return version && version.version
    },
    buildSyntheticCall: waves.scalaJsCompiler.buildSyntheticCall,
    scriptInfo: waves.scalaJsCompiler.scriptInfo,
    getTypes: waves.scalaJsCompiler.getTypes,
    getVarsDoc: waves.scalaJsCompiler.getVarsDoc,
    getFunctionsDoc: waves.scalaJsCompiler.getFunctionsDoc,
    decompile: waves.scalaJsCompiler.decompile,
    flattenCompilationResult,
    parseAndCompile: waves.scalaJsCompiler.parseAndCompile
}
export default api