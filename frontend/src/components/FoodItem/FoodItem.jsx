import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Ensure assets are defined to avoid potential undefined errors
  const addIconWhite = assets?.add_icon_white || '';
  const addIconGreen = assets?.add_icon_green || '';
  const removeIconRed = assets?.remove_icon_red || '';
  const ratingStars = assets?.rating_starts || '';

  // Fallback for cartItems[id] to ensure it is always a number
  const itemQuantity = cartItems[id] || 0;

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        
        {itemQuantity === 0 ? (
          <img
            className='add'
            onClick={() => addToCart(id)}
            src={addIconWhite}
            alt='Add to cart'
          />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={removeIconRed} alt='Remove from cart' />
            <p>{itemQuantity}</p>
            <img onClick={() => addToCart(id)} src={addIconGreen} alt='Add more to cart' />
          </div>
        )}
      </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <img src={ratingStars} alt='Rating stars' />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;







