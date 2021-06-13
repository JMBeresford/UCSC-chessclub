const ingamechat = Vue.component('ingamechat', {
  props: {
    game: Object,
    players: Object,
    user: Object,
  },
  computed: {},
  data() {
    return {
      messageInput: '',
      messages: [],
      ws: WebSocket,
    };
  },
  methods: {
    addMessage: function (id, message) {
      this.messages.push({
        user_id: id,
        msg: message,
      });
      let el = document.querySelector('.spacer');
      el.scrollIntoView(false, {
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    },
    userMessage: function (id, message) {
      this.addMessage(id, message);
    },
    sysMessage: function (message) {
      this.addMessage(0, message);
    },
    sendMessage: function () {
      let message = JSON.stringify({
        type: 'chat',
        game_id: this.game.id,
        id: this.user.id,
        msg: this.messageInput,
      });

      this.ws.send(message);
      this.messageInput = '';
    },
    isWhite: function (message) {
      return message['user_id'] == this.players['white'].id;
    },
    isBlack: function (message) {
      return message['user_id'] == this.players['black'].id;
    },
    getUsername: function (color) {
      return this.players[color].username;
    },
    handleMessage: function (e) {
      let message = JSON.parse(e.data);

      if (message.game_id != this.game.id) {
        return;
      }

      if (message.type == 'chat') {
        this.addMessage(message.id, message.msg);
      } else if (message.type == 'system') {
        this.addMessage(0, message.msg);
      }
    },
    wsOpened: function (e) {
      console.log('chat websocket connection established');
    },
    wsClosed: function (e) {
      console.log('game websocket connection closed, attempting to re-connect.');
      
      this.ws = new WebSocket(
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
          window.location.host +
          `/websocket/${this.game.id}`
      );

      this.ws.onopen = this.wsOpened;
      this.ws.onclose = this.wsClosed;
      this.ws.onmessage = this.pullFen;
      this.ws.onerror = (err) => {
        console.log(err);
      };
    },
  },
  mounted: function () {},
  created: function () {
    if (window.MozWebSocket) {
      window.WebSocket = window.MozWebSocket;
    }

    this.ws = new WebSocket(
      (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
        window.location.host +
        `/websocket/${this.game.id}`
    );

    this.ws.onopen = this.wsOpened;
    this.ws.onclose = this.wsClosed;
    this.ws.onmessage = this.handleMessage;
    this.ws.onerror = (err) => console.log(err);
  },
  template: `
    <div id="ingamechat">
      <div class="chatBanner">
        <div id="leftHorse">
          <img src="svg/pieces/bn.svg" alt="white knight image" style="transform: scaleX(-1)" @click="userMessage(2, 'I am user 2')">
        </div>
        <div id="versusText">
          <h1><strong>{{ getUsername('white') }}</strong> VS <strong>{{ getUsername('black') }}</strong></h1>
        </div>
        <div id="rightHorse">
          <img src="svg/pieces/wn.svg" alt="white knight image" @click="sysMessage('I am the server')">
        </div>
      </div>
      <div class="wrapper">
        <div class="chatContainer">
          <div v-for="m in messages" class="chatMessage">
            <div class="whiteMessage"  v-if="isWhite(m)">
              <p>{{ getUsername('white') }}: </p>
              <p>{{m['msg']}}</p>
            </div>
            <div class="blackMessage"  v-if="isBlack(m)">
              <p>{{ getUsername('black') }}: </p>
              <p>{{m['msg']}}</p>
            </div>
            <div class="serverMessage" v-if="m['user_id'] == 0"> {{m['msg']}} </div>
          </div>
          <div class="spacer"></div>
        </div>
      </div>
      
      <div id="messageBox">
        <div class="inputWrap">
          <input class="input" @keyup.enter="sendMessage" v-model="messageInput" placeholder="Send a message">
          <i class="fa fa-paper-plane" @click="sendMessage"></i>
        </div>
      </div>
    </div>
  `,
});

export default ingamechat;
