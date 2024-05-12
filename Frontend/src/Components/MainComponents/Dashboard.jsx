import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
// import { getAllReceipes, getWishlistReceipes } from '../../Services/Repository/ReceipesRepo';
import ReceipeList from '../Utils/ReceipeList';
// import { setWishListReceipes } from '../../App/Slice/ReceipeSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [receipesData, setReceipes] = useState([]);
  // const [isDataAvail, SetIsDataAvail] = useState(false);
  // useEffect(()=>{
  //   const fetchReceipes = async () => {
  //     try{
  //       const receipes = await getAllReceipes();
  //       const WishListreceipes = await getWishlistReceipes(navigate);
  //       dispatch(setWishListReceipes(WishListreceipes));
  //       // console.log("Receipes from backend are as follows : ", receipes);
  //       setReceipes(receipes);
  //     }catch(error){
  //       console.error("Error fetching receipes : ", error);
  //     }
  //   }

  //   fetchReceipes();
  // },[]);
  // useEffect(() => {
  //   console.log(receipesData);
  // }, [receipesData]);

  const dummyData = [
    {
        "receipes_id": 1,
        "title": "haresh title ",
        "image_1": "http://res.cloudinary.com/devharesh/image/upload/v1714566099/tfjfe2e78hauvonnfqcx.png",
        "uploaded_by": 8,
        "username": "Haresh-729"
    },
    {
        "receipes_id": 2,
        "title": "Custard melon",
        "image_1": "http://res.cloudinary.com/devharesh/image/upload/v1714566731/vkjtpguq8j0dyvewfzwd.png",
        "uploaded_by": 8,
        "username": "Haresh-729"
    }
];
  return (
    <>
      <div className="flex flex-col items-center h-[99vh] overflow-y-auto scrollbar-hide bg-gradient-to-br from-purple-400 to-indigo-700">
        <div>Welcome to the FoodTrek Dashboard...You have been successfully logged in...</div>
        <ReceipeList endpoint={dummyData} type={"1"}/>
      </div>
        
    </>
  )
}

export default Dashboard