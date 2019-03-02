<template>
    <aside v-if="goldenHour" class="goldenHour">
        <header class="header">Today's Golden Hour:</header>
        <ul class="data">
            <li>Sunrise: {{goldenHour.sunrise}}</li>
            <li>Sunset: {{goldenHour.sunset}}</li>
        </ul>
    </aside>
</template>

<script>
export default {
  name: 'GoldenHour',
  data() {
    return {
      goldenHour: null
    };
  },
  methods: {
    dataToQueryString: function(data) {
      let queries = [];

      for (let prop in data) {
        queries.push(prop + '=' + data[prop]);
      }

      return queries.join('&');
    },
    getGoldenHour: function(position) {
      let requestData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        date: 'today',
        formatted: 0
      };

      let getData = fetch('http://api.sunrise-sunset.org/json?' + this.dataToQueryString(requestData))
        .then(r => r.json())
        .then(data => {
          this.populateData(data);
        });
    },
    populateData: function(data) {
      let sunriseDate = new Date(data.results.sunrise);
      let sunriseGH = new Date(new Date(sunriseDate).setMinutes(sunriseDate.getMinutes() + 20)).toLocaleTimeString();

      let sunsetDate = new Date(data.results.sunset);
      let sunsetGH = new Date(new Date(sunsetDate).setMinutes(sunsetDate.getMinutes() - 20)).toLocaleTimeString();

      //   let sunrise = sunriseDate.toLocaleTimeString();
      //   let sunriseBH = new Date(new Date(sunriseDate).setMinutes(sunriseDate.getMinutes() - 20)).toLocaleTimeString();
      //   let sunset = sunsetDate.toLocaleTimeString();
      //   let sunsetBH = new Date(new Date(sunsetDate).setMinutes(sunsetDate.getMinutes() + 20)).toLocaleTimeString();

      this.goldenHour = {
        sunrise: sunriseGH,
        sunset: sunsetGH
      };
    }
  },
  mounted: function() {
    // Get user lat lng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getGoldenHour);
    } else {
      // default to London
      let pos = {
        coords: {
          latitude: 51.509865,
          longitude: -0.118092
        }
      };

      this.getGoldenHour(pos);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../scss/shared/_variables.scss';
@import '../../../scss/shared/_mixins.scss';

.goldenHour {
  float: right;
  //   top: 4rem;
  //   left: 0.66rem;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  width: 11.2rem;
  background: $slideMenuColour;
  color: $altFontColour;
  border: 2px solid $darkGrey;
  @include z-index(goldenHour);
}
.header {
  margin-bottom: 0.5rem;
  @include font-size(12px);
}
.data {
  @include noListStyle;
  @include font-size(10px);
}
</style>