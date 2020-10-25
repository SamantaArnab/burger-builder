import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name"
        },
        value: "",
        validation: {
          required: true
        },
        valid: true
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street"
        },
        value: "",
        validation: {
          required: true
        },
        valid: true
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP Code"
        },
        value: "",
        validation: {
          required: true,
          minLength: 4,
          maxLength: 8
        },
        valid: true
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "",
        validation: {
          required: true
        },
        valid: true
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Email"
        },
        value: "",
        validation: {
          required: true
        },
        valid: true
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" }
          ]
        },
        value: "",
        validation: {}
      }
    }
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ing,
      price: this.props.price,
      orderData: formData
    };

    axios
      .post("/orders.json", order)
      .then(response => {
        this.props.history.push("/");
      })
      .catch(error => console.log(error));
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

  checkValidity(value, rules) {
    let isValid = true;
    // if(rules.required) {
    //     isValid = value.trim()!=='' && isValid;
    // }
    // if(rules.type){

    //     console.log("rules.type.",rules.type.test("a"))
    //     console.log("value",value)
    //     const vali = rules.type;
    //     isValid = vali.test(value)
    // }
    if (rules.minLength) {
      console.log(value.length);
      console.log(rules.minLength);
      console.log(value.length >= rules.minLength);
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      console.log();
      isValid = value.length <= rules.maxLength && isValid;
    }
    console.log("is valid", isValid);
    return isValid;
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        <form onSubmit={this.orderHandler}>
          {formElementsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              valid={formElement.config.valid}
              value={formElement.config.value}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          ))}
          <Button btnType="Success">ORDER</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ing: state.ingredients,
    price: state.totalPrice
  };
};
export default connect(mapStateToProps, null)(ContactData);
