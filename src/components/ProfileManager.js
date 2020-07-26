import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { makeStyles } from '@material-ui/core/styles';
import LocationOn from '@material-ui/icons/LocationOn';
import { BsPersonCheckFill, BsPersonPlus, BsTrash } from 'react-icons/bs';
import { MdAddAPhoto } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { IconButton } from '@material-ui/core';

import nullProfile from '../null.png';

const useStyles = makeStyles((theme) => ({
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%',
      },
      margin: 6,
    },
    '& .profile-image': {
      width: 150,
      height: 150,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%',
      backgroundColor: 'white',
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle',
        color: 'lightgrey',
        fontFamily: '"Comic Neue", cursive',
      },
    },
    '& hr': {
      border: 'none',
      margin: '0 0 7px 0',
    },
  },
}));

const ProfileManager = () => {
  const classes = useStyles();
  const {
    profile,
    editedProfile,
    setEditedProfile,
    deleteProfile,
    cover,
    setCover,
    createProfile,
    editProfile,
  } = useContext(ApiContext);
  const handleEditPicture = () => {
    // 指定されたIDの要素を取得して『fileInput』に格納
    const fileInput = document.getElementById('imageInput');
    // 『.click』を用いることで『IconButton』がクリックされた時に擬似的に『input』がクリックされたようにする
    fileInput.click();
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  return (
    <div className={classes.profile}>
      <div className='image-wrapper'>
        {profile.id ? (
          <img src={profile.img} alt='profile' className='profile-image' />
        ) : (
          <img src={nullProfile} alt='profile' className='profile-image' />
        )}
        {/* inputタグは機能だけ欲しいので画面には出ないようにhiddenにする */}
        <input
          type='file'
          id='imageInput'
          hidden='hidden'
          onChange={(event) => {
            setCover(event.target.files[0]);
            // 初期化しないと、次回のonChangeが反応しなくなる
            event.target.value = '';
          }}
        />
        {/* 側はMaterial-UIのものを使う */}
        <IconButton onClick={handleEditPicture}>
          <MdAddAPhoto className='photo' />
        </IconButton>
      </div>

      {editedProfile.id ? (
        // 編集の場合
        editedProfile.nickname ? (
          <button className='user' onClick={() => editProfile()}>
            <FaUserEdit />
          </button>
        ) : (
          <button className='user-invalid' disabled>
            <FaUserEdit />
          </button>
        )
      ) : // 新規作成の場合
      editedProfile.nickname && cover.name ? (
        <button className='user' onClick={() => createProfile()}>
          <BsPersonPlus />
        </button>
      ) : (
        <button className='user-invalid' disabled>
          <BsPersonPlus />
        </button>
      )}
      <button className='trash' onClick={() => deleteProfile()}>
        <BsTrash />
      </button>
      <div className='profile-details'>
        <BsPersonCheckFill className='badge' />
        {profile && <span>{profile.nickname}</span>}
        <hr />
        <label>
          <input
            type='text'
            value={editedProfile.nickname}
            name='nickname'
            onChange={handleInputChange}
          />
        </label>
        <hr />
        <span>Joined at {profile.created_on}</span>
        <hr />
        <LocationOn /> <span>JAPAN</span>
      </div>
    </div>
  );
};

export default ProfileManager;
