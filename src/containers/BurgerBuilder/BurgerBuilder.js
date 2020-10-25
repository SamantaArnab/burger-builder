import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { ADD_INGREDIENTS, REMOVE_INGREDIENTS } from '../../store/actions';
import { connect } from 'react-redux';


class BurgerBuilder extends Component {
    state = {
        purchaseable: false,
        purchasing: false,
        error: false
    };
    componentDidMount() {
        axios.get('https://burger-builder-2b3ec.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            })
            .catch(error => {
                this.setState({ error: true });
            })
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };

    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
    //     this.updatePurchaseState(updatedIngredients);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };

    //     updatedIngredients[type] = updatedCount;
    //     const priceReduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceReduction;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0
    };
    purchaseHandler = () => {
        console.log('hi');
        this.setState({ purchasing: true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    };

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    };
    render() {

        const disabledInfo = { ... this.props.ing };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>
                {!this.state.error && (
                    <div>
                        {this.props.ing && (
                            <div>
                                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                                    <OrderSummary
                                        ingredients={this.props.ing}
                                        price={this.props.totalPrice}
                                        purchaseCanceled={this.purchaseCancelHandler}
                                        purchaseContinued={this.purchaseContinueHandler}
                                    />
                                </Modal>
                                <Burger ingredients={this.props.ing} />
                            </div>
                        )}
                        <BuildControls
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disabledInfo}
                            purchaseable={this.updatePurchaseState(this.props.ing)}
                            ordered={this.purchaseHandler}
                            price={this.props.totalPrice}
                        />
                    </div>
                )}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.ingredients,
        totalPrice: state.totalPrice
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: ADD_INGREDIENTS, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({ type: REMOVE_INGREDIENTS, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));