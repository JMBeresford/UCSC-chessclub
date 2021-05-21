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
    userMessage: function (id, message) {
      this.messages.push({
        "user_id": id,
        "msg": message
      })
    },
    sysMessage: function (message) {
      this.messages.push({
        "user_id": 0,
        "msg": message
      })
    },
    sendMessage: function() {
      this.userMessage(this.players['white'].user_id, this.messageInput)
      console.log("sending message...")
    }
  },
  mounted: function () {},
  created: function () {
    this.messageInput = ""
    this.messages = []
  },
  template: `
    <div id="ingamechat">
      <div class="chatBanner">
        <button class="btn" @click="userMessage(1, 'hi')">
          <img src="svg/pieces/wn.svg" alt="white knight image">
        </button>
        <h1>{{ this.players['white'].username }} VS {{ this.players['black'].username }}</h1>
        <button class="btn" @click="sendMessage()">
          <img src="svg/pieces/bn.svg" alt="white knight image">
        </button>
      </div>

      <div class="chatContainer">
        <div v-for="m in messages" class="block">
          <p>{{m['msg']}}</p>
        </div>
      </div>

      <div id="messageBox">
        <input class="input" @keyup.enter="userMessage" v-model="messageInput" placeholder="">
        <button class="btn" @click="sendMessage()">
          Send
        </button>
      </div>
    </div>
  `,
});

export default ingamechat;
