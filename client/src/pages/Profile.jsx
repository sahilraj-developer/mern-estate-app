import React, { useRef, useState, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase';
import {updateUserStart,updateUserSuccess,updateUserFailure,
   deleteUserFailure, deleteUserStart, deleteUserSuccess, logoutUserStart,
    logoutUserFailure, logoutUserSuccess} from '../redux/user/userSlice.js'

 import {Link} from 'react-router-dom'   

const Profile = () => {
  const { currentUser ,loading,error} = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)

  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [showListingsError,setShowListingsError] =useState(false);
  const [userListings, setUserListings] = useState([])

  useEffect(() => {
    if (file) {
      handleFileUpload(file);

    }

  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is' + progress + '% done');
        setFilePercentage(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    );

  }


  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      })

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    }catch(error){
      dispatch(updateUserFailure(error.message))
    }

  }

  const handleDelete =async()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))

    }catch(error){
      dispatch(deleteUserFailure(error.message))

    }

  }

  const handleSignout=async()=>{

    try{
      dispatch(logoutUserStart())
      const res = await  fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(logoutUserFailure(data.message))
        return;
      }
      dispatch(logoutUserSuccess(data))
    }catch(error){
       dispatch(logoutUserFailure(error.message))
    }

  }

  const handleShowListings=async()=>{
    
    try{
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
  
      setUserListings(data);
    }catch(error){
      setShowListingsError(true)
    }

  }

  const handleListingDelete=async(listingId)=>{
    try{

      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE'
      });

      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=>prev.filter((listing._id !== listingId)))

    }catch(error){
      console.log(error.message)

    }

  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={formData.avatar || currentUser.avatar} alt='profile' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email}  onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-95' disabled={loading}>{loading? 'Loading':'Update'}</button>
        <Link to='/create-listing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' >Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignout}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess? 'User is Updated Successfully':""}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Lisitings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error Showing Listings': ''}</p>
      {userListings && userListings.length>0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        { userListings.map((listings)=>
        <div key={listings._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listings._id}`}>

          <img src={listings.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
          </Link>

          <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listings._id}`}>
          <p >{listings.name}</p>
          </Link>

          <div className='flex flex-col item-center'>
            <button className='text-red-700' onClick={()=>handleListingDelete(listings?._id)}>Delete</button>
            <Link to={`/update-listings/${listings._id}`}>
            <button className='text-green-700'>Edit</button>
            </Link>
            

          </div>

        </div>

      ) }
      
      </div>
       }
    </div>
  )
}

export default Profile