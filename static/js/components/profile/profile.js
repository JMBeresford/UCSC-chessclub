const profile = Vue.component("profile", {
    props: {
        user: {},
        games: {},
        "is-me": Boolean,
    },
    computed: {
        getUser: function () {
            return JSON.parse(this.user);
        },
    },
    data() {
        return {};
    },
    template: `
    <main>
        <div class="bg">
            <div class="wrapper">
                <div class="info">
                    <label for="image">
                        <input type="file" name="image" id="image" style="display:none;"/>
                        <img src="https://via.placeholder.com/150x150">
                    </label>
                    <div class="text">
                        <p class="username"> {{getUser.username}} </p>
                        <p class="status"> {{getUser.status}} </p>
                    </div>
                    <div class="buttons">
                        <button>Match History</button>
                        <button v-if="!is-Me">Challenge</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="charts">
                <div>
                    Elo Rating
                    <!-- replace with chart -->
                </div>
                <div>
                    Games
                    <!-- replace with chart -->
                </div>
            </div>
        </div>
    </main>
    `,
});

export default profile;
