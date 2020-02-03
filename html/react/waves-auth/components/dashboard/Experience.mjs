export default  (obj) => {
    return new Promise(async function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
        let template = config['babel']['transform'](`        
         let React =   config['React']
         let connect =   config['connect']
         let Moment =   config['Moment']
         let PropTypes = config['PropTypes']
         let Component = config['Component']
         let deleteExperience = config['actions']['profileActions']['deleteExperience']
              
        class Experience extends Component {
          onDeleteClick(id) {
            this.props.deleteExperience(id);
          }
        
          render() {
            const experience = this.props.experience.map(exp => (
              <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>
                  <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
                  {exp.to === null ? (
                    ' Now'
                  ) : (
                    <Moment format="YYYY/MM/DD">{exp.to}</Moment>
                  )}
                </td>
                <td>
                  <button
                    onClick={this.onDeleteClick.bind(this, exp._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ));
            return (
              <div>
                <h4 className="mb-4">Experience Credentials</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Title</th>
                      <th>Years</th>
                      <th />
                    </tr>
                    {experience}
                  </thead>
                </table>
              </div>
            );
          }
        }
  
        Experience.propTypes = {
          deleteExperience: PropTypes.func.isRequired
        };

        resolve(connect(null, { deleteExperience })(Experience))
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}