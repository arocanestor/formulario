import { Component } from 'react'
import axios from 'axios'

var ruta = 'http://localhost.76:4000'

const emailRegex = RegExp(
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 3 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};


export default class NewUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            email: '',         
            tel: '',
            formErrors: {
                nombre: '',
                apellido: '',
                email: '',
                tel: ''
            }
        }
    }

    onImputChanges = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {

            case "nombre":

                formErrors.nombre =
                    value.length < 3 ? "Mínimo 6 caracteres" : "";
                break;

            case "apellido":

                formErrors.apellido =
                    value.length < 3 ? "Mínimo 3 caracteres" : "";
                break;

            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "Email no válido";
                break;
            case "tel":
                formErrors.tel =
                    value.length < 6 ? "Mínimo 6 caracteres" : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value });

    }

    onSubmit = async (e) => {
        e.preventDefault();
      const state = this.state

        const data = {
            'nombre': state.nombre + ' '+ state.apellido,
            'email': state.email,            
            'tel': state.tel
        }            

        if (formValid(state)) {
            const log = JSON.stringify(data)
            
            axios.post(ruta +'/api',
                data
            ).then( (e) => {
               console.log(e.data)
            }).catch( (error) => {
                console.log(error);
            });
        }
        else {
            console.error("FORM INVALIDO");
        }



    }

    render() {
        const { formErrors } = this.state;
        
            return (
                <form className="box" onSubmit={this.onSubmit}>
                    <h2>Evangelio del día</h2>
                    <div>
                        <input
                            onChange={this.onImputChanges}
                            type="text" name="nombre"
                            placeholder="Nombre"
                            className={formErrors.nombre.length < 3 ? "error" : null}
                        />
                        {formErrors.nombre.length > 3 && (
                            <p className="errorMessage ">{formErrors.nombre}</p>
                        )}

                    </div>
                    <div>
                        <input
                            onChange={this.onImputChanges}
                            type="text" name="apellido"
                            placeholder="Apellido"
                            className={formErrors.apellido.length < 3 ? "error" : null} />
                        {formErrors.apellido.length > 3 && (
                            <p  className="errorMessage ">{formErrors.apellido}</p>
                        )}
                    </div>
                    <div>
                        <input onChange={this.onImputChanges}
                            type="text" name="email"
                            placeholder="Email"
                            className={formErrors.email.length > 3 ? "error" : null} />
                        {formErrors.email.length > 3 && (
                            <p  className="errorMessage ">{formErrors.email}</p>
                        )}
                    </div>
                    <div>
                        <input onChange={this.onImputChanges}
                            type="text" name="tel"
                            placeholder="Telefono"
                            className={formErrors.tel.length > 3 ? "error" : null} />
                        {formErrors.tel.length > 3 && (
                            <p  className="errorMessage ">{formErrors.tel}</p>
                        )}
                    </div>

                    <button type="submit" value="Login">Registrar</button>
                </form>
            )      
    }
}
