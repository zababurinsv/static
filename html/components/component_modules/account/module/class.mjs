import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import Provider from"/static/html/components/component_modules/waves-provider/waves-provider.mjs";import Signer from"/static/html/components/component_modules/bundle/waves/waves.mjs";let signer=Signer.default,Class=class{constructor(){this.create=this.create.bind(this),this.open=this.open.bind(this),this.saveAs=this.saveAs.bind(this)}create(e,t,s){return new Promise(async(r,i)=>{let o=await Provider(),n={},a=!1;if("w"===s?(n=new signer.Signer,a=!0):"t"===s?(n=new signer.Signer({NODE_URL:"https://pool.testnet.wavesnodes.com"}),a=!0):console.assert(!1,"укажите сеть t -тестнет или w - майннет"),a){let i={};i.type=s,i.private={},i.public={},i.date={},i.date.timestap=Date.now().toString(),i.date.GMT=new Date(parseInt(i.date.timestap,10)).toString(),i.private.seed=signer.libs.crypto.randomSeed(25),i.private.seedBinary=signer.libs.crypto.seedWithNonce(i.private.seed,parseInt(i.date.timestap-20,10)),"w"===s?(i.private.privateKey=signer.libs.crypto.privateKey(i.private.seed),i.public.key=signer.libs.crypto.publicKey(i.private.seed),i.public.address=signer.libs.crypto.address(i.private.seed)):(i.private.privateKey=signer.libs.crypto.privateKey(i.private.seed,signer.libs.crypto.TEST_NET_CHAIN_ID),i.public.key=signer.libs.crypto.publicKey(i.private.seed,signer.libs.crypto.TEST_NET_CHAIN_ID),i.public.address=signer.libs.crypto.address(i.private.seed,signer.libs.crypto.TEST_NET_CHAIN_ID)),n.setProvider(o.ProviderSeed(i.private.seed));let a=signer.libs.crypto.encryptSeed(JSON.stringify(i),t),p=new Blob([`${a}`],{type:"text/plain;charset=utf-8"});await this.saveAs(p,`${e}.boc`),r(i)}else r(!1)})}open(e,t){return new Promise(async(s,r)=>{let i=new FileReader;i.onload=function(e){s(JSON.parse(signer.libs.crypto.decryptSeed(e.target.result,t)))},i.readAsText(e)})}saveAs(e,t){return new Promise(async(s,r)=>{let i=window.URL.createObjectURL(e),o=document.createElement("a");o.style="display: none",o.href=i,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),setTimeout(function(){window.URL.revokeObjectURL(i),s(!0)},1e3)})}get self(){return Signer}};export default Class;