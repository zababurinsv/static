export default obj=>new Promise(async function(resolve,reject){bundle.default(obj,null,async function(error,config){let React=config.React,Component=config.Component;console.log("@@@1@@@@1@@@@1@@",config);let template=config.babel.transform("        \n   \n   \n       \n        const App = () => {\n            const {\n                selectedCoupon,\n                dialog: [dialogOpened, onDialogOpen, onDialogClose],\n                result: [resultOpened, onResultOpen, onResultClose],\n                form: [formOpened, onFormOpen, onFormClose],\n            } = useAppDialogs();\n        \n            const [coupons, updateCoupons] = useState([]);\n            const [userCoupons, updateUserCoupons] = useState([]);\n            const [filterActive, changeFilterState] = useState(false);\n        \n            useEffect(() => {\n                async function fetchData() {\n                    const response = await getCoupons();\n                    updateCoupons(response);\n        \n                    updateUserCoupons([response[0]]);\n                }\n                fetchData();\n            }, []);\n        \n            return (\n                    <Header\n                        onCreateCoupon={onFormOpen}\n                        filterActive={filterActive}\n                        onChangeFilterState={changeFilterState}\n                    />\n                    <Flex\n                        justifyContent=\"center\"\n                        p={{\n                            0: '10px',\n                            md: '20px',\n                        }}\n                        flexWrap=\"wrap\"\n                    >\n                        <Coupons\n                            onDialogOpen={onDialogOpen}\n                            coupons={filterActive ? userCoupons : coupons}\n                        />\n                    </Flex>\n                    <Modal open={dialogOpened} onClose={onDialogClose}>\n                        <Dialog\n                            coupon={selectedCoupon}\n                            onClose={onDialogClose}\n                            onSubmit={() => {\n                                onDialogClose();\n                                onResultOpen();\n                            }}\n                        />\n                    </Modal>\n                    <Modal open={resultOpened} onClose={onResultClose}>\n                        <Result onClose={onResultClose} />\n                    </Modal>\n                    <Modal\n                        open={formOpened}\n                        onClose={onFormClose}\n                        width={{\n                            0: '100%',\n                            lg: 'initial',\n                        }}\n                        mx=\"10px\"\n                    >\n                        <Form\n                            onClose={onFormClose}\n                            onSubmit={(data) => {\n                                const fn = filterActive ? updateUserCoupons : updateCoupons;\n                                const entity = filterActive ? userCoupons : coupons;\n                                fn([...entity, { ...data, id: new Date().valueOf() }]);\n                                onFormClose();\n                                onResultOpen();\n                            }}\n                        />\n                    </Modal>\n            );\n        };\n\n       \n       resolve(App)",config.babel.availablePresets.react);eval(template.code)})});