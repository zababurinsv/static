export default function parseBemIdentifier(pattern, options) {
    let result = {};
    options = options || {};
    let short = options.short;

    let blockElement = pattern.split('__');

    let blockArray = blockElement[0].split('_');
    result.block = blockArray[0];
    if (blockArray.length > 1) {
        result.mod = blockArray[1];
        if (blockArray[2]) {
            result[short ? 'val' : 'modVal'] = blockArray[2];
        }
    }

    if (blockElement.length > 1) {
        let elementArray = blockElement[1].split('_');
        result.elem = elementArray[0];
        if (elementArray.length > 1) {
            result[short ? 'mod' : 'elemMod'] = elementArray[1];
            if (elementArray[2]) {
                result[short ? 'val' : 'elemModVal'] = elementArray[2];
            }
        }
    }
    return result;
};
