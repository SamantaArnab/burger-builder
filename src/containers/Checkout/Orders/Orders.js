import React, { Component } from 'react';
import Order from '../../../components/Order/Order';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../axios-orders';
class Orders extends Component {
    state= {
        orders:[]
    };
    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                console.log("hiii");
                console.log(res);
                const fetchOrders = [];
                for (let key in res.data){
                    fetchOrders.push({
                        ...res.data[key],
                        id:key
                    });
                }
                this.setState({orders:fetchOrders})
            });
    }

    render() {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order key={order.id}
                           ingredients={order.ingredients}
                           price={order.price}/>
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders,axios);