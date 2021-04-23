const board = Vue.component('board', {
  methods: {
    // functions to animate the board on hover
    handleOut: function (e) {
      let elem = e.target.parentElement;

      requestAnimationFrame(() => {
        this.out(elem);
      });
    },
    handleIn: function (e) {
      let elem = e.target.parentElement;

      requestAnimationFrame(() => {
        this.in(elem);
      });
    },
    in: function (elem) {
      elem.classList.add('lift');
    },
    out: function (elem) {
      setInterval((target) => target.classList.remove('lift'), 500, elem);
    },
  },
  template: `
    <div class="background">
      <div id="board-wrap">
        <div class="transparency-mask"></div>

        <svg xmlns="http://www.w3.org/2000/svg" width="2126.315" height="423.96" viewBox="0 0 2126.315 423.96">
          <g id="board_art" data-name="board art" opacity="0.996">
            <g id="board" transform="translate(0 0)">
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_1" data-name="Rectangle 1" d="M30.687,0h80.248L87.92,17.53H0Z" transform="translate(711.467)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_2" data-name="Rectangle 2" d="M23.015,0h80.248L87.92,17.53H0Z" transform="translate(799.386)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_3" data-name="Rectangle 3" d="M15.344,0H95.592L87.92,17.53H0Z" transform="translate(887.306)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_4" data-name="Rectangle 4" d="M7.671,0H87.919V17.53H0Z" transform="translate(975.242)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_5" data-name="Rectangle 5" d="M0,0H80.248L87.92,17.53H0Z" transform="translate(1063.161)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_6" data-name="Rectangle 6" d="M0,0H80.248L95.592,17.53H7.672Z" transform="translate(1143.409)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_7" data-name="Rectangle 7" d="M0,0H80.248l23.016,17.53H15.344Z" transform="translate(1223.657)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_8" data-name="Rectangle 8" d="M0,0H80.248l30.687,17.53H23.016Z" transform="translate(1303.905)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_9" data-name="Rectangle 9" d="M0,0H87.92l37.175,21.236H27.881Z" transform="translate(1326.921 17.53)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_10" data-name="Rectangle 10" d="M0,0H87.92L115.8,21.236H18.588Z" transform="translate(1239.001 17.53)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_11" data-name="Rectangle 11" d="M0,0H87.92l18.588,21.236H9.294Z" transform="translate(1151.081 17.53)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_12" data-name="Rectangle 12" d="M0,0H87.92l9.295,21.236H0Z" transform="translate(1063.162 17.53)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_13" data-name="Rectangle 13" d="M9.292,0h87.92V21.236H0Z" transform="translate(965.95 17.53)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_14" data-name="Rectangle 14" d="M18.587,0h87.92L97.213,21.236H0Z" transform="translate(868.718 17.53)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_15" data-name="Rectangle 15" d="M27.881,0H115.8L97.213,21.236H0Z" transform="translate(771.505 17.53)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_16" data-name="Rectangle 16" d="M37.174,0h87.92L97.213,21.236H0Z" transform="translate(674.292 17.53)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_17" data-name="Rectangle 17" d="M45.962,0h97.213L108.7,26.256H0Z" transform="translate(628.331 38.766)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_18" data-name="Rectangle 18" d="M34.472,0h97.213L108.7,26.256H0Z" transform="translate(737.034 38.766)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_19" data-name="Rectangle 19" d="M22.981,0h97.213L108.7,26.256H0Z" transform="translate(845.737 38.766)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_20" data-name="Rectangle 20" d="M11.489,0H108.7V26.256H0Z" transform="translate(954.461 38.766)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_21" data-name="Rectangle 21" d="M0,0H97.213L108.7,26.256H0Z" transform="translate(1063.163 38.766)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_22" data-name="Rectangle 22" d="M0,0H97.213l22.982,26.256H11.492Z" transform="translate(1160.376 38.766)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_23" data-name="Rectangle 23" d="M0,0H97.213l34.472,26.256H22.982Z" transform="translate(1257.589 38.766)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_24" data-name="Rectangle 24" d="M0,0H97.213l45.962,26.256H34.472Z" transform="translate(1354.802 38.766)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_25" data-name="Rectangle 25" d="M0,0H108.706l58.287,33.3H43.716Z" transform="translate(1389.281 65.028)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_26" data-name="Rectangle 26" d="M0,0H108.706l43.716,33.3H29.144Z" transform="translate(1280.576 65.028)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_27" data-name="Rectangle 27" d="M0,0H108.706L137.85,33.3H14.573Z" transform="translate(1171.87 65.028)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_28" data-name="Rectangle 28" d="M0,0H108.706l14.573,33.3H0Z" transform="translate(1063.164 65.028)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_29" data-name="Rectangle 29" d="M14.57,0H123.275l0,33.3H0Z" transform="translate(939.889 65.028)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_30" data-name="Rectangle 30" d="M29.144,0H137.849L123.277,33.3H0Z" transform="translate(816.588 65.028)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_31" data-name="Rectangle 31" d="M43.715,0H152.421L123.277,33.3H0Z" transform="translate(693.311 65.028)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_32" data-name="Rectangle 32" d="M58.286,0H166.992L123.277,33.3H0Z" transform="translate(570.034 65.028)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_33" data-name="Rectangle 33" d="M76.331,0H199.608L142.359,43.6H0Z" transform="translate(493.703 98.324)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_34" data-name="Rectangle 34" d="M57.248,0H180.525L142.359,43.6H0Z" transform="translate(636.063 98.324)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_35" data-name="Rectangle 35" d="M38.166,0H161.443L142.359,43.6H0Z" transform="translate(778.422 98.324)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_36" data-name="Rectangle 36" d="M19.08,0H142.357l0,43.6H0Z" transform="translate(920.809 98.324)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_37" data-name="Rectangle 37" d="M0,0H123.277l19.085,43.6H0Z" transform="translate(1063.166 98.324)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_38" data-name="Rectangle 38" d="M0,0H123.277l38.167,43.6H19.085Z" transform="translate(1186.443 98.324)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_39" data-name="Rectangle 39" d="M0,0H123.277l57.249,43.6H38.167Z" transform="translate(1309.72 98.324)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_40" data-name="Rectangle 40" d="M0,0H123.277l76.332,43.6H57.249Z" transform="translate(1432.997 98.324)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_41" data-name="Rectangle 41" d="M0,0H142.359L246.65,59.576H78.219Z" transform="translate(1490.246 141.929)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_42" data-name="Rectangle 42" d="M0,0H142.359l78.219,59.576H52.147Z" transform="translate(1347.887 141.929)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_43" data-name="Rectangle 43" d="M0,0H142.359l52.147,59.576H26.075Z" transform="translate(1205.528 141.929)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_44" data-name="Rectangle 44" d="M0,0H142.359l26.075,59.576H0Z" transform="translate(1063.169 141.929)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_45" data-name="Rectangle 45" d="M26.069,0H168.428l0,59.576H0Z" transform="translate(894.74 141.929)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_46" data-name="Rectangle 46" d="M52.146,0H194.5L168.431,59.576H0Z" transform="translate(726.277 141.929)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_47" data-name="Rectangle 47" d="M78.218,0H220.577L168.431,59.576H0Z" transform="translate(557.845 141.929)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_48" data-name="Rectangle 48" d="M104.289,0H246.649L168.431,59.576H0Z" transform="translate(389.414 141.929)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_49" data-name="Rectangle 49" d="M151.053,0H319.485L206.194,86.29H0Z" transform="translate(238.361 201.505)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_50" data-name="Rectangle 50" d="M113.291,0H281.722L206.194,86.29H0Z" transform="translate(444.555 201.505)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_51" data-name="Rectangle 51" d="M75.528,0H243.959L206.194,86.29H0Z" transform="translate(650.748 201.505)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_52" data-name="Rectangle 52" d="M37.758,0H206.189l0,86.29H0Z" transform="translate(856.982 201.505)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_53" data-name="Rectangle 53" d="M0,0H168.431L206.2,86.29H0Z" transform="translate(1063.172 201.505)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_54" data-name="Rectangle 54" d="M0,0H168.431l75.53,86.29H37.767Z" transform="translate(1231.603 201.505)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_55" data-name="Rectangle 55" d="M0,0H168.431L281.724,86.29H75.53Z" transform="translate(1400.034 201.505)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_56" data-name="Rectangle 56" d="M0,0H168.431L319.486,86.29H113.292Z" transform="translate(1568.465 201.505)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_57" data-name="Rectangle 57" d="M0,0H206.194L444.557,136.165H178.774Z" transform="translate(1681.757 287.795)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_58" data-name="Rectangle 58" d="M0,0H206.194L384.968,136.165H119.185Z" transform="translate(1475.564 287.795)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_59" data-name="Rectangle 59" d="M0,0H206.194L325.379,136.165H59.6Z" transform="translate(1269.37 287.795)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_60" data-name="Rectangle 60" d="M0,0H206.194l59.6,136.165H.007Z" transform="translate(1063.176 287.795)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_61" data-name="Rectangle 61" d="M59.582,0H265.776l.007,136.165H0Z" transform="translate(797.4 287.795)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_62" data-name="Rectangle 62" d="M119.183,0H325.376L265.783,136.165H0Z" transform="translate(531.566 287.795)" fill="#f2e6da"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_63" data-name="Rectangle 63" d="M178.772,0H384.965L265.783,136.165H0Z" transform="translate(265.783 287.795)" fill="#a97c50"/>
              </g>
              <g @mouseover="handleIn" @mouseout="handleOut">
                <path id="Rectangle_64" data-name="Rectangle 64" d="M238.361,0H444.555L265.783,136.165H0Z" transform="translate(0 287.795)" fill="#f2e6da"/>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  `,
});

export default board;
