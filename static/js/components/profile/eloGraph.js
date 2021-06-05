const eloGraph = Vue.component('eloGraph', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
      allElos: [],
      dates: [],
      elos: [],
    };
  },
  methods: {

    populateGraph: function (months, elo){
        // console.log(this.allElosSorted);
        //console.log(months);
        let monthsdata = [];
        let elosData =[];
        Object.values(months).forEach((key) => {
        //  console.log(typeof(key.date))
          let string = key.date.split(" ");
        //  console.log(string);

          monthsdata.push(
            string[0]          );
          
        });

        Object.values(elo).forEach((key) => {
          elosData.push(
key.elo          
);
         
        });

      // console.log(Array.from(months));
         let eloChart = document.getElementById('eloChart').getContext('2d');
         let linechart = new Chart(eloChart, {
           type: 'line',
           data: {
             labels: Array.from(monthsdata),
             elements: {
               points: {
                 backgroundColor: '#000',
               },
             },
             datasets: [
               {
                 label: this.getName(),
                 data: Array.from(elosData).reverse(),
                 borderColor: '#DD8281FF',
                 backgroundColor: '#DD828133',
                 fill: 'start',
               },
             ],
           },
           options: {
             responsive: true,
             maintainAspectRatio: false,
             scales: {
               x: {
                 ticks: {
                   font: {
                     weight: 'normal',
                   },
                 },
               },
               y: {
                 ticks: {
                   font: {
                     weight: 'normal',
                   },
                 },
               },
             },
             interaction: {
               intersect: false,
               mode: 'nearest',
             },
             plugins: {
               title: {
                 text: 'Elo Vs. Time',
                 display: true,
                 color: '#D6EDFF',
                 font: {
                   size: 20,
                 },
               },
             },
           },
         });
     
       },

    
    getName: function () {
      return this.user.username;
    },
    getMonthsData: function () {
      let id = this.user.id;
      axios
      .all([
        axios.get('../get/elo?id=' + id),
      ])
      .then((responseArr) => {
        //this will be executed only when all requests are complete
        Object.values(responseArr[0].data).forEach((key) => {
        //  console.log(responseArr[0].data[key].date);
        console.log(key);
          this.allElos.push({
            date: key.updated_on,
            elo:  key.rating,
           // date:responseArr[0].data[key].updated_on,
           // elo:responseArr[0].data[key].rating,
          });

        });

        this.allElos.sort(function(a,b){
          return new Date(b.date) - new Date(a.date);
        });

        Object.values(this.allElos).forEach((key) => {
          this.dates.push({
            date: key.date,
          });
          this.elos.push({
            elo: key.elo,

          });
        });

        this.populateGraph(this.dates, this.elos);



        });
       // return parsedyourElement;
      //need to return the date of the "elos " request end pt
     },
    getEloData: function () {
     //need to return something at some time? 
    },
  },
  created: function () {
    this.getMonthsData();

  },
  
  template: `
    <canvas id="eloChart"></canvas>
  `,
});

export default eloGraph;
