import componentTextAreaFieldGroup from"../common/TextAreaFieldGroup.mjs";export default obj=>new Promise(async function(resolve,reject){bundle.default(obj,null,async function(error,config){let TextAreaFieldGroup=await componentTextAreaFieldGroup("TextAreaFieldGroup"),template=config.babel.transform("        \n      let React =   config['React']\n      let Component = config['Component']\n      let connect =   config['connect']\n      let PropTypes = config['PropTypes']\n      \n      let addComment = config['actions']['postActions']['addComment']\n    \n            \n        class CommentForm extends Component {\n          constructor(props) {\n            super(props);\n            this.state = {\n              text: '',\n              errors: {}\n            };\n        \n            this.onChange = this.onChange.bind(this);\n            this.onSubmit = this.onSubmit.bind(this);\n          }\n        \n          componentWillReceiveProps(newProps) {\n            if (newProps.errors) {\n              this.setState({ errors: newProps.errors });\n            }\n          }\n        \n          onSubmit(e) {\n            e.preventDefault();\n        \n            const { user } = this.props.auth;\n            const { postId } = this.props;\n        \n            const newComment = {\n              text: this.state.text,\n              name: user.name,\n              avatar: user.avatar\n            };\n        \n            this.props.addComment(postId, newComment);\n            this.setState({ text: '' });\n          }\n        \n          onChange(e) {\n            this.setState({ [e.target.name]: e.target.value });\n          }\n        \n          render() {\n            const { errors } = this.state;\n        \n            return (\n              <div className=\"post-form mb-3\">\n                <div className=\"card card-info\">\n                  <div className=\"card-header bg-info text-white\">\n                    Make a comment...\n                  </div>\n                  <div className=\"card-body\">\n                    <form onSubmit={this.onSubmit}>\n                      <div className=\"form-group\">\n                        <TextAreaFieldGroup\n                          placeholder=\"Reply to post\"\n                          name=\"text\"\n                          value={this.state.text}\n                          onChange={this.onChange}\n                          error={errors.text}\n                        />\n                      </div>\n                      <button type=\"submit\" className=\"btn btn-dark\">\n                        Submit\n                      </button>\n                    </form>\n                  </div>\n                </div>\n              </div>\n            );\n          }\n        }\n        \n        CommentForm.propTypes = {\n          addComment: PropTypes.func.isRequired,\n          auth: PropTypes.object.isRequired,\n          postId: PropTypes.string.isRequired,\n          errors: PropTypes.object.isRequired\n        };\n        \n        const mapStateToProps = state => ({\n          auth: state.auth,\n          errors: state.errors\n        });\n\n      resolve(connect(mapStateToProps, { addComment })(CommentForm))\n      \n            ",config.babel.availablePresets.react);eval(template.code)})});