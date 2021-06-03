const ingamechat = Vue.component('ingamechat', {
  props: {
    game: Object,
    players: Object,
  },  
  computed: {
  },
  data() {
    return {
      messageInput: String,
      messages: Array,
    };
  },
  methods:{
    addMessage: function(id, message) {
      this.messages.push({
        "user_id": id,
        "msg": message
      })
      let el = document.querySelector(".spacer")
      el.scrollIntoView(false, 
        {
          behavior: "smooth", 
          block: "end",
          inline: "end",
        });
    },
    userMessage: function (id, message) {
      this.addMessage(id, message)
    },
    sysMessage: function (message) {
      this.addMessage(0, message)
    },
    sendMessage: function() {
      this.userMessage(this.players['white'].id, this.messageInput)
      this.messageInput = ""
    },
    isWhite: function(message) {
      return message['user_id'] == this.players['white'].id
    },
    isBlack: function(message) {
      return message['user_id'] == this.players['black'].id
    },
    getUsername: function(color) {
      return this.players[color].username
    },
  },
  mounted: function () {},
  created: function () {
    this.messageInput = ""
    this.messages = []
  },
  template: `
    <div id="ingamechat">
      <div class="chatBanner">
        <div id="leftHorse">
          <img src="svg/pieces/bn.svg" alt="white knight image" style="transform: scaleX(-1)" @click="userMessage(2, 'I am user 2')">
        </div>
        <div id="versusText">
          <h1>{{ getUsername('white') }} VS {{ getUsername('black') }}</h1>
          <hr>
        </div>
        <div id="rightHorse">
          <img src="svg/pieces/wn.svg" alt="white knight image" @click="sysMessage('I am the server')">
        </div>
      </div>

      <div class="wrapper">
        <div class="chatContainer">
          <div v-for="m in messages" class="chatMessage">
            <div class="whiteMessage"  v-if="isWhite(m)">{{ getUsername('white') }}: {{m['msg']}}</div>
            <div class="blackMessage"  v-if="isBlack(m)">{{ getUsername('black') }}: {{m['msg']}}</div>
            <div class="serverMessage" v-if="m['user_id'] == 0">⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ {{m['msg']}} ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
          </div>
          <div class="spacer"></div>
        </div>
      </div>
      
      <div id="messageBox">
        <div class="inputWrap">
          <input class="input" @keyup.enter="sendMessage" v-model="messageInput" placeholder="Send a message (click horses to test other user and server)">
          <i class="fa fa-paper-plane" @click="sendMessage"></i>
        </div>
      </div>
    </div>
  `,
});

export default ingamechat;
