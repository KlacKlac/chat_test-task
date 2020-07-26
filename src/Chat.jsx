import React, { useEffect, useState } from 'react'

export default function Chat(props) {
  const { messages, getMsgs, deleteMsg, sendMsg, userName, setPage, setMessages } = props;
  const [msgValue, setMsgValue] = useState('');
  const [msgError, setMsgError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => getMsgs(), 2000);
    return () => {
      clearInterval(interval);
      setMessages([]);
    }
  }, [])

  return (
    <div className="Chat__wrapper">
      <input type="button"
        className='Chat__cancel-btn btn'
        value="Выйти из чата"
        onClick={() => setPage(1)}
      />
      <div className="Chat__window">
        {messages.length > 0 ?
          messages.map(msg => {
            const date = new Date(msg.date);
            return <Message date={date}
              msg={msg}
              deleteMsg={deleteMsg}
              userName={userName}
              key={msg.id} />
          })
          :
          <p className="Chat__no-messages">Сообщений нет</p>
        }
      </div>
      <div className="Chat__input-wrapper">
        <p className="Chat__user-name">{userName}:</p>
        <input type="text"
          className='Chat__input input'
          value={msgValue}
          onChange={ev => {
            if (msgError) setMsgError(false);
            setMsgValue(ev.target.value);
          }}
          onKeyDown={ev => ev.keyCode === 13 && handleSendMsg()}
          placeholder='Введите текст сообщения'
        />
        {msgError && <p className="error error_message">Введите сообщение</p>}
        <input type="button"
          className='Chat__submit-btn btn'
          value="Отправить"
          onClick={handleSendMsg}
        />
      </div>
    </div>
  )

  function handleSendMsg() {
    if (msgValue.trim().length > 0) {
      sendMsg(msgValue.trim());
      setMsgValue('');
    } else {
      setMsgError(true);
    }
  }
}

function Message(props) {
  const { date, msg, deleteMsg, userName } = props;
  return (
    <div className={`Chat__message-wrapper ${msg.name === userName ? 'Chat__message-wrapper_my-message' : ''}`}>
      <div className='Chat__message'>
        <p className="Chat__message-date">{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</p>
        <p className="Chat__message-author">Автор: {msg.name}</p>
        <p className="Chat__message-text">{msg.text}</p>
      </div>
      {msg.name === userName && <input type="button"
        className='Chat__delete-message-btn btn btn_small'
        value="&#128937;"
        onClick={() => deleteMsg(msg.id)}
        title='Удалить сообщение'
      />}
    </div>
  )
}