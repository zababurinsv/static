export default async (v,p,c,obj,r) => {
    try {
        console.log('window.FS', window.FS)


        return  {
            _:"#external_fs",
            path: ["/static/html/components/varan-header/external/fs.mjs"],
            status:false,
            ok:false,
            object: { ok:undefined }
        }
    } catch (error) {

        return {
            _:"#external_fs",
            path: ["/static/html/components/varan-header/external/fs.mjs"],
            status:false,
            ok:false,
            object: {
                container: error,
                state: error
            }
        }
    }
}