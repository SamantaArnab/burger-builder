import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        error: false
    };
    componentDidMount() {
        axios.get('https://burger-builder-2b3ec.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true});
            })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceReduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceReduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0})
};
    purchaseHandler = () => {
        console.log('hi');
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        //alert('You continue');
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Arnab Samanta',
                address: {
                    street: 'TestStreet',
                    zipCode: '41321',
                    country: 'India'
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'fastest',
            };

        axios.post('/orders.json', order)
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };
    render () {

        const disabledInfo = { ... this.state.ingredients};
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }
        return (
            <Aux>
                {
                    !this.state.error &&
                    <div>

                        {
                            this.state.ingredients &&
                            <div>
                                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                                    <OrderSummary
                                        ingredients={this.state.ingredients}
                                        price={this.state.totalPrice}
                                        purchaseCanceled={this.purchaseCancelHandler}
                                        purchaseContinued={this.purchaseContinueHandler}
                                    />
                                </Modal>
                                < Burger ingredients={this.state.ingredients}/>
                            </div>
                        }
                        <BuildControls
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disabledInfo}
                            purchaseable={this.state.purchaseable}
                            ordered={this.purchaseHandler}
                            price={this.state.totalPrice}/>
                    </div>
                }
            </Aux>

        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);