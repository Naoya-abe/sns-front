import React, { useState, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { RiMailAddLine } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
// import { TextareaAutosize } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  text: {
    margin: theme.spacing(3),
  },
}));

const Ask = ({ ask, prof }) => {
  const classes = useStyles();
  // react-modalを使用する際に記述
  Modal.setAppElement('#root');
  const { changeApprovalRequest, sendDMCont } = useContext(ApiContext);
  // modalの表示・非表示切り替え
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // DMの内容を保持
  const [text, setText] = useState('');

  const customStyles = {
    content: {
      top: '50%',
      left: '42%',
      right: 'auto',
      bottom: 'auto',
    },
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setText(value);
  };

  const sendDM = () => {
    const uploadDM = new FormData();
    uploadDM.append('receiver', ask.askFrom);
    uploadDM.append('message', text);
    sendDMCont(uploadDM);
    setModalIsOpen(false);
  };

  const changeApproval = () => {
    const uploadDataAsk = new FormData();
    uploadDataAsk.append('askTo', ask.askTo);
    uploadDataAsk.append('approved', true);
    changeApprovalRequest(uploadDataAsk, ask);
  };

  return (
    <li className='list-item'>
      {/* 友人申請を送ってきた人の名前を表示 */}
      <h4> {prof[0].nickname}</h4>
      {!ask.approved ? (
        <Button
          size='small'
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={changeApproval}
        >
          Approve
        </Button>
      ) : (
        //   友人申請が許可されている場合はDM作成ボタンを表示
        <button className='mail' onClick={() => setModalIsOpen(true)}>
          <RiMailAddLine />
        </button>
      )}

      {/* modalIsOpenで表示を制御 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <Typography>Message</Typography>
        <TextField
          className={classes.text}
          type='text'
          onChange={handleInputChange}
        />
        <br />
        <button className='btn-modal' onClick={sendDM}>
          <IoIosSend />
        </button>
        <button className='btn-modal' onClick={() => setModalIsOpen(false)}>
          <IoMdClose />
        </button>
      </Modal>
    </li>
  );
};

export default Ask;
