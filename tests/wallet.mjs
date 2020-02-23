import Waves from '/static/html/components/component_modules/bundle/waves/waves.mjs'
    const wvs = 10 ** 8;
    let object = {}
        object.dapp = '3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn'
        object.testnodes = 'http://testnodes.wavesnodes.com'
    describe('test waves suite', async function () {
        this.timeout(100000);

        before(async function () {
            // await setupAccounts(
            //     {foofoofoofoofoofoofoofoofoofoofoo: 10 * wvs,
            //          barbarbarbarbarbarbarbarbarbar: 2 * wvs,
            //           wallet: 0.05 * wvs});
            // const script = compile(file('wallet.ride'));
            // const ssTx = setScript({script}, accounts.wallet);
            // await broadcast(ssTx);
            // await waitForTx(ssTx.id)
        });
        describe('connecting dapp', async function () {
            this.timeout(100000);

            it('accountData', async function () {

                let dAppData = await Waves['default']['transactions']['nodeInteraction'].accountData(object.dapp, object.testnodes)
                if (dAppData) {
                    window.dAppDataKeys = Object.keys(dAppData);
                    console.log("dApp Account data:");
                    console.log(dAppData);
                }

            })

        })



        it('Can deposit', async function () {

            // const iTxFoo = invokeScript({
            //     dApp: address(accounts.wallet),
            //     call: {function: "deposit"},
            //     payment: [{assetId: null, amount: 0.9 * wvs}]
            // }, accounts.foofoofoofoofoofoofoofoofoofoofoo);


            // const iTxBar = invokeScript({
            //     dApp: address(accounts.wallet),
            //     call: {function: "deposit"},
            //     payment: [{assetId: null, amount: 1.9 * wvs}]
            // }, accounts.barbarbarbarbarbarbarbarbarbar)


            // await broadcast(iTxFoo);
            // await broadcast(iTxBar);
            // await waitForTx(iTxFoo.id);
            // await waitForTx(iTxBar.id);
        })

        it('Cannot withdraw more than was deposited', async function () {
            // const iTxFoo = invokeScript({
            //     dApp: address(accounts.wallet),
            //     call: {
            //         function: "withdraw",
            //         args: [{type:'integer', value: 2 * wvs}]
            //     },
            //
            // }, accounts.foofoofoofoofoofoofoofoofoofoofoo);
            //
            // expect(broadcast(iTxFoo)).to.be.rejectedWith("Not enough balance")
        })

        it('Can withdraw', async function () {
            // const iTxFoo = invokeScript({
            //     dApp: address(accounts.wallet),
            //     call: {
            //         function: "withdraw",
            //         args: [{ type: 'integer', value: 0.9 * wvs }]
            //     },
            //
            // }, accounts.foofoofoofoofoofoofoofoofoofoofoo);
            // await broadcast(iTxFoo)
        })
    })
