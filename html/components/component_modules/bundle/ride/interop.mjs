import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']
let sys = {}
sys.base58Encode = function (bytes) {
    return crypto.base58Encode(new Uint8Array(bytes))
};
sys.base58Decode = function (data) {
    return crypto.base58Decode(data).buffer
};
sys.base64Encode = function (bytes) {
    return crypto.base64Encode(new Uint8Array(bytes))
};
sys.base64Decode = function (data) {
    return crypto.base64Decode(data)
};
sys.keccak256 = function (bytes) {
    return Uint8Array.from(crypto.keccak(new Uint8Array(bytes))).buffer
};
sys.sha256 = function (bytes) {
    return Buffer.from((crypto.sha256(new Uint8Array(bytes))), 'hex');
};
sys.blake2b256 = function (bytes) {
    return crypto.blake2b(new Uint8Array(bytes)).buffer
};
sys.curve25519verify = function (msg, sig, key) {
    return crypto.verifySignature(new Uint8Array(key), new Uint8Array(msg), new Uint8Array(sig))
};
sys.merkleVerify = function (rootHash, merkleProof, leafData) {
    return crypto.merkleVerify(new Uint8Array(rootHash), new Uint8Array(merkleProof), new Uint8Array(leafData))
};
sys.rsaVerify = function (digest, msg, sig, key) {
    let alg = digest.toString();
    switch (digest.toString()) {
        case   'SHA3224':
            alg = "SHA3-224";
            break;
        case   'SHA3256':
            alg = "SHA3-256";
            break;
        case   'SHA3384':
            alg = "SHA3-384";
            break;
        case   'SHA3512':
            alg = "SHA3-512";
            break;
        case   "NONE":
            alg = undefined;
            break;
    }//fixme
    return crypto.rsaVerify(new Uint8Array(key), new Uint8Array(msg), new Uint8Array(sig), alg)
};
sys.httpGet = async function (data) {
    if (!data.url) return {...data, status: 404, body: 'url is undefined'};
    let
        resp = await axios.get(data.url, {validateStatus: () => true}),
        status = resp.status,
        body = await resp.data;
    if (typeof body !== 'string') body = JSON.stringify(body);
    return {...data, status, body}
};

export default sys
