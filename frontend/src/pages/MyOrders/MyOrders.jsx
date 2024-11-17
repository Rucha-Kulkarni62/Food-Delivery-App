import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets/frontend_assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        console.log(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {data.map((order) => {
                    return (
                        <div key={order._id} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt='' />
                            <p>{order.items.map((item, index) => {
                                return `${item.name} x ${item.quantity}${index === order.items.length - 1 ? '' : ','}`;
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button
                                id={`track-order-${order._id}`} // Assign a unique ID for each button
                                onClick={fetchOrders}
                                type="button" // Added type="button" to prevent form submit behavior
                            >
                                Track order
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;




