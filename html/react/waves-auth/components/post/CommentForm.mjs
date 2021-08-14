import componentTextAreaFieldGroup from '../common/TextAreaFieldGroup.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let TextAreaFieldGroup = await componentTextAreaFieldGroup('TextAreaFieldGroup')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      
      let addComment = config['actions']['postActions']['addComment']
    
            
        class CommentForm extends Component {
          constructor(props) {
            super(props);
            this.state = {
              text: '',
              errors: {}
            };
        
            this.onChange = this.onChange.bind(this);
            this.onSubmit = this.onSubmit.bind(this);
          }
        
          componentWillReceiveProps(newProps) {
            if (newProps.errors) {
              this.setState({ errors: newProps.errors });
            }
          }
        
          onSubmit(e) {
            e.preventDefault();
        
            const { user } = this.props.auth;
            const { postId } = this.props;
        
            const newComment = {
              text: this.state.text,
              name: user.name,
              avatar: user.avatar
            };
        
            this.props.addComment(postId, newComment);
            this.setState({ text: '' });
          }
        
          onChange(e) {
            this.setState({ [e.target.name]: e.target.value });
          }
        
          render() {
            const { errors } = this.state;
        
            return (
              <div className="post-form mb-3">
                <div className="card card-info">
                  <div className="card-header bg-info text-white">
                    Make a comment...
                  </div>
                  <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <TextAreaFieldGroup
                          placeholder="Reply to post"
                          name="text"
                          value={this.state.text}
                          onChange={this.onChange}
                          error={errors.text}
                        />
                      </div>
                      <button type="submit" className="btn btn-dark">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          }
        }
        
        CommentForm.propTypes = {
          addComment: PropTypes.func.isRequired,
          auth: PropTypes.object.isRequired,
          postId: PropTypes.string.isRequired,
          errors: PropTypes.object.isRequired
        };
        
        const mapStateToProps = state => ({
          auth: state.auth,
          errors: state.errors
        });

      resolve(connect(mapStateToProps, { addComment })(CommentForm))
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
