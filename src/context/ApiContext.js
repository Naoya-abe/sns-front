import React, { createContext, useState, useEffect } from 'react';
import { withCookies } from 'react-cookie';
import axios from 'axios';
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  // API通信を行うためのtokenをcookieから取得
  const token = props.cookies.get('current-token');
  // 自身のプロフィール情報を取得
  const [profile, setProfile] = useState([]);
  // ユーザのプロフィール情報一覧を取得
  const [profiles, setProfiles] = useState([]);
  // 自身のプロフィールを更新するときに送信する情報
  const [editedProfile, setEditedProfile] = useState({ id: '', nickname: '' });
  // 自身に来ている友達申請一覧を取得
  const [askList, setAskList] = useState([]);
  // 自身に来ている友達申請一覧を取得+自身が出した友達申請一覧を取得
  const [askListFull, setAskListFull] = useState([]);
  // 受信メール一覧を取得
  const [inbox, setInbox] = useState([]);
  // 自身のプロフィール画像
  const [cover, setCover] = useState([]);

  // useEffectを用いてアプリを起動したときに必要な情報を取得
  useEffect(() => {
    const getMyProfile = async () => {
      try {
        // 自身の情報を取得
        const resmy = await axios.get(
          'http://localhost:8080/api/user/myprofile/',
          { headers: { Authorization: `Token ${token}` } }
        );
        // 友達申請の情報を取得
        const res = await axios.get(
          'http://localhost:8080/api/user/approval/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // データが取得できたらstateに入れ込む
        // listでユーザデータが返ってくるので、オブジェクトとして受け取るようにindex番号を指定
        // 自身のデータ
        resmy.data[0] && setProfile(resmy.data[0]);
        // 自身の編集データ
        resmy.data[0] &&
          setEditedProfile({
            id: resmy.data[0].id,
            nickname: resmy.data[0].nickname,
          });
        // 自身に来ている友達申請一覧を取得
        resmy.data[0] &&
          setAskList(
            res.data.filter((ask) => {
              return resmy.data[0].userPro === ask.askTo;
            })
          );
        // 友達申請：自身が申請したものと来ているもの全てを取得
        setAskListFull(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    // 他のユーザのプロフィール一覧を取得
    const getProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user/profile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfiles(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    // 自身に来ているDM一覧を取得
    const getInbox = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/dm/inbox/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setInbox(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMyProfile();
    getProfile();
    getInbox();
  }, [token, profile.id]);

  // ログインしたユーザがプロフィールを作成する時に実行される関数
  const createProfile = async () => {
    // FormData()を使うと簡単にデータ送信ができる
    const createData = new FormData();
    // backendのmodelで定義したデータ名と揃える
    createData.append('nickname', editedProfile.nickname);
    // cover画像が選択されていれば
    cover.name && createData.append('img', cover, cover.name);
    // post method実行
    try {
      const res = await axios.post(
        'http://localhost:8080/api/user/profile/',
        createData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
      setEditedProfile({ id: res.data.id, nickname: res.data.nickname });
    } catch (err) {
      console.log(err);
    }
  };
  // delete methodの実行
  const deleteProfile = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/user/profile/${profile.id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      // profileが削除された時に各ステートの状態を変更する
      setProfiles(
        profiles.filter((dev) => {
          return dev.id !== profile.id;
        })
      );
      setProfile([]);
      setEditedProfile({ id: '', nickname: '' });
      setCover([]);
      setAskList([]);
    } catch (err) {
      console.log(err);
    }
  };

  const editProfile = async () => {
    const editData = new FormData();
    editData.append('nickname', editedProfile.nickname);
    cover.name && editData.append('img', cover, cover.name);
    try {
      const res = await axios.put(
        `http://localhost:8080/api/user/profile/${profile.id}/`,
        editData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const newRequestFriend = async (askData) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/approval/`,
        askData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskListFull([...askListFull, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const sendDMCont = async (uploadDM) => {
    try {
      await axios.post(`http://localhost:8080/api/dm/message/`, uploadDM, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const changeApprovalRequest = async (uploadDataAsk, ask) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/user/approval/${ask.id}/`,
        uploadDataAsk,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskList(askList.map((item) => (item.id === ask.id ? res.data : item)));

      const newDataAsk = new FormData();
      newDataAsk.append('askTo', ask.askFrom);
      newDataAsk.append('approved', true);

      const newDataAskPut = new FormData();
      newDataAskPut.append('askTo', ask.askFrom);
      newDataAskPut.append('askFrom', ask.askTo);
      newDataAskPut.append('approved', true);

      const resp = askListFull.filter((item) => {
        return item.askFrom === profile.userPro && item.askTo === ask.askFrom;
      });

      !resp[0]
        ? await axios.post(
            `http://localhost:8080/api/user/approval/`,
            newDataAsk,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            }
          )
        : await axios.put(
            `http://localhost:8080/api/user/approval/${resp[0].id}/`,
            newDataAskPut,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            }
          );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        profile,
        profiles,
        cover,
        setCover,
        askList,
        askListFull,
        inbox,
        newRequestFriend,
        createProfile,
        editProfile,
        deleteProfile,
        changeApprovalRequest,
        sendDMCont,
        editedProfile,
        setEditedProfile,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default withCookies(ApiContextProvider);
