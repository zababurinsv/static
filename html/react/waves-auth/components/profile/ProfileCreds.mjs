export default obj=>new Promise(async function(resolve,reject){bundle.default(obj,null,async function(error,config){let template=config.babel.transform('        \n      let React =   config[\'React\']\n      let Component = config[\'Component\']\n      let Moment = config[\'Moment\']\n          \n        class ProfileCreds extends Component {\n          render() {\n            const { experience, education } = this.props;\n        \n            const expItems = experience.map(exp => (\n              <li key={exp._id} className="list-group-item">\n                <h4>{exp.company}</h4>\n                <p>\n                  <Moment format="YYYY/MM/DD">{exp.from}</Moment> -\n                  {exp.to === null ? (\n                    \' Now\'\n                  ) : (\n                    <Moment format="YYYY/MM/DD">{exp.to}</Moment>\n                  )}\n                </p>\n                <p>\n                  <strong>Position:</strong> {exp.title}\n                </p>\n                <p>\n                  {exp.location === \'\' ? null : (\n                    <span>\n                      <strong>Location: </strong> {exp.location}\n                    </span>\n                  )}\n                </p>\n                <p>\n                  {exp.description === \'\' ? null : (\n                    <span>\n                      <strong>Description: </strong> {exp.description}\n                    </span>\n                  )}\n                </p>\n              </li>\n            ));\n        \n            const eduItems = education.map(edu => (\n              <li key={edu._id} className="list-group-item">\n                <h4>{edu.school}</h4>\n                <p>\n                  <Moment format="YYYY/MM/DD">{edu.from}</Moment> -\n                  {edu.to === null ? (\n                    \' Now\'\n                  ) : (\n                    <Moment format="YYYY/MM/DD">{edu.to}</Moment>\n                  )}\n                </p>\n                <p>\n                  <strong>Degree:</strong> {edu.degree}\n                </p>\n                <p>\n                  <strong>Field Of Study:</strong> {edu.fieldofstudy}\n                </p>\n                <p>\n                  {edu.description === \'\' ? null : (\n                    <span>\n                      <strong>Description: </strong> {edu.description}\n                    </span>\n                  )}\n                </p>\n              </li>\n            ));\n            return (\n              <div className="row">\n                <div className="col-md-6">\n                  <h3 className="text-center text-info">Experience</h3>\n                  {expItems.length > 0 ? (\n                    <ul className="list-group">{expItems}</ul>\n                  ) : (\n                    <p className="text-center">No Experience Listed</p>\n                  )}\n                </div>\n        \n                <div className="col-md-6">\n                  <h3 className="text-center text-info">Education</h3>\n                  {eduItems.length > 0 ? (\n                    <ul className="list-group">{eduItems}</ul>\n                  ) : (\n                    <p className="text-center">No Education Listed</p>\n                  )}\n                </div>\n              </div>\n            );\n          }\n        }\n\n    \n      resolve(ProfileCreds)\n      \n            ',config.babel.availablePresets.react);eval(template.code)})});