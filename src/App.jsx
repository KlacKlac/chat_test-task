import React, { useState } from 'react';

import Chat from './Chat'

import './App.css';

function App() {
  const [name, setName] = useState('');
  const [fetching, setFetching] = useState(false);
  const [validateError, setValidateError] = useState(false);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);

  return (
    <div className="App">
      {page === 1 && <>
        <div className='App__input-wrapper'>
          <input type="text"
            className="App__name-input input"
            value={name}
            onChange={ev => {
              if (validateError) setValidateError(false);
              setName(ev.target.value);
            }}
            onKeyDown={ev => ev.keyCode === 13 && letsStart()}
            placeholder='Имя пользователя'
          />
          {validateError && <p className="error error_name">Введите имя пользователя</p>}
        </div>
        <input type="button"
          value={fetching ? 'Загрузка сообщений...' : 'Стартуем!'}
          className='App__start-btn btn'
          onClick={letsStart} />
      </>}
      {page === 2 && <Chat messages={messages}
        userName={name}
        setPage={setPage}
        getMsgs={getMessages}
        deleteMsg={deleteMessage}
        setMessages={setMessages}
        sendMsg={sendMessage} />}
    </div>
  );

  function letsStart() {
    if (name.trim().length > 0) {
      setFetching(true);
      getMessages()
    } else setValidateError(true)
  }
  async function getMessages() {
    let response = await fetch('https://5f1aa612610bde0016fd2d67.mockapi.io/messages?sortBy=date&order=desc');

    if (response.status === 200) {
      let data = await response.json();
      setMessages(data);
      setFetching(false);
      if (page === 1) setPage(2);
    } else {
      console.error(response.statusText);
    }
  }
  async function sendMessage(msg) {
    let response = await fetch('https://5f1aa612610bde0016fd2d67.mockapi.io/messages', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date(),
        name: name,
        text: msg
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 201) {
      getMessages();
    } else {
      console.error(response.statusText);
    }
  }
  async function deleteMessage(msgId) {
    let response = await fetch(`https://5f1aa612610bde0016fd2d67.mockapi.io/messages/${msgId}`, {
      method: 'DELETE'
    });

    if (response.status === 200) {
      getMessages();
    } else {
      console.error(response.statusText);
    }
  }
}

export default App;