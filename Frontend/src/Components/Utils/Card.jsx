import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountData } from '../../App/Slice/UserSlice';
import { useNavigate } from 'react-router-dom';
// import { addWishlistReceipes, getWishlistReceipes, removeFromWishlist } from '../../Services/Repository/ReceipesRepo';
// import { setWishListReceipes } from '../../App/Slice/ReceipeSlice';

const Card = ({ receipes_id, image_1, uploaded_by, title, username, type, id }) => {
    const account = useSelector(getAccountData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToWishList = async () => {
        console.log("UserId :" + account?.userId + "receipeId :" + receipes_id);
        // if (type === "1") {
        //     await addWishlistReceipes(receipes_id, navigate);
        //     const wishListReceipes = await getWishlistReceipes(navigate);
        //     dispatch(setWishListReceipes(wishListReceipes));
        // }
        // if (type === "2") {
        //     await removeFromWishlist(receipes_id, navigate);
        //     const wishListReceipes = await getWishlistReceipes(navigate);
        //     dispatch(setWishListReceipes(wishListReceipes));
        // }
    }

    const viewRecipe = () => {
        // Add logic to navigate to the recipe details page
        // navigate(`/receipe/${receipes_id}`);
    }

    return (
        <div className="flex flex-col rounded-lg overflow-hidden shadow-lg ">
            <div className="relative  p-[12px] bg-gray-200 ">
                <img src={image_1} alt={`Card_imageid_${id}`} className="w-full h-full object-cover group-hover:scale-105 duration-300 rounded-[15px]" />
            </div>
            <div className="bg-white p-4 flex flex-col justify-between flex-grow rounded-b-lg">
                <div>
                    <h2 className={`text-xl font-bold text-gray-800 mb-2 ${type === "2" && 'text-sm'}`}>{title}</h2>
                    <p className={`text-gray-600 ${type === "2" && 'text-xs'}`}>By {username}</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <button onClick={addToWishList} className={`bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ${type === '2' && 'text-xs'} ${type === '3' ? 'hidden' : ''}`}>
                        {type === "1" ? "Add to Wishlist" : "Remove from Wishlist"}
                    </button>
                    <button onClick={viewRecipe} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400 transition duration-300">
                        View Recipe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
