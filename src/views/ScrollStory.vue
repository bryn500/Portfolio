<template>
    <article class="article">
        <div class="headerPadding viewport-height relative">
            <h1 v-html="msg" class="pageHeading"></h1>
        </div>
        <section class="relative viewport-height">
            <div class="text-over text-middle">
                <p>
                    On a bitter Icelandic night in 1974, teenager Erla Bolladottir was having a nightmare.
                    Voices were whispering outside her room.
                </p>
                <p>Who were they? What were they saying? It seemed so real. Terrified, she wet the bed.</p>
                <p>The dream would continue to haunt her for years to come.</p>
            </div>
            <div class="background-overlay"></div>
            <div class="background-image">
                <picture class="background-fixed">
                    <source
                        media="(min-aspect-ratio: 1/1)"
                        srcset="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-a-ch_0_openingtext-lr.jpg 1001w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-a-ch_0_openingtext-mr.jpg 1401w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-a-ch_0_openingtext-hr.jpg"
                    >
                    <source
                        media="(max-aspect-ratio: 1/1)"
                        srcset="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-1440-a-ch_0_openingtext-lr.jpg 1001w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-1440-a-ch_0_openingtext-mr.jpg 1401w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-1440-a-ch_0_openingtext-hr.jpg"
                    >
                    <img
                        src="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-a-ch_0_openingtext-mr.jpg"
                    >
                </picture>
            </div>
        </section>
        <section class="text">
            <p>The lava rolls down from the jagged, snowcapped mountain ridge and across the Reykjanes peninsula, swamping the land like a petrified ocean - a swell of charcoal, grey and brown, flecked with a sickly mossy green.</p>
            <p>This barren landscape stretches for 100km, the only interruption the odd gloomy mound rising from the earth like an ancient tomb.</p>
            <p>A place to dwell for the ghosts of those lost in the network of crevasses and fissures, some of them going down 30 metres, deep enough to swallow a person, to make them disappear.</p>
            <p>On the night of 26 January 1974, these fields would have been perilous. A storm had blown in from the Atlantic with snow falling in thick clumps but Gudmundur Einarsson was oblivious to this.</p>
            <div class="inline-image">
                <img
                    src="https://news.files.bbci.co.uk/include/shorthand/42193/media/ch1_victim_gudmundureinarssoncredited-mr_iw6jhx1.jpg"
                >
            </div>
        </section>
        <section class="relative scroll-fix">
            <div class="text text-narrow text-over">
                <p>An extensive search was made of Keflavik harbour, the rugged coastline and the desolate lava fields of the Reykjanes, but there was no trace of Geirfinnur.</p>
                <p>The inquiry focused on the man who had phoned him from the cafe in Keflavik harbour. A nationwide hunt was launched to find him but even in this tiny nation of fewer than 300,000 people, he couldn’t be found.</p>
                <p>After months of effort there was still no body, no forensic evidence and no witnesses. In the summer of 1975 the investigation was wound down.</p>
                <p>There was an added impetus for the investigators to solve these disappearances.</p>
                <p>In 1968 the police had bungled the investigation into the shooting dead of a taxi driver. Veteran detective Snorri Magnusson, says it bugged the police.</p>
                <p>“That case has never been solved and it was still very fresh in everyone’s memory in 1974. So the police were under enormous pressure to solve these two disappearances.”</p>
                <p>In the bars of south Iceland, Geirfinnur’s case lived on, a source for conspiracy theories and wild rumours.</p>
                <p>The police were listening too.</p>
                <p>They heard a rumour about a petty criminal who, the word went, knew something about the disappearances.</p>
                <p>He was Saevar Ciesielski.</p>
            </div>
            <div class="background-overlay"></div>
            <div class="scroll-change-wrapper">
                <div class="scroll-change viewport-height">
                    <div class="scroll-change-inner">
                        <img
                            class="scroll-change-img"
                            src="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-c-ch_1_disappearances_harbv2-hr_bgsaazc.jpg"
                        >
                    </div>
                </div>
            </div>
        </section>
        <section class="viewport-height relative">
            <div class="text-over text-middle">
                <h2>Title here</h2>
            </div>
            <div class="background-overlay"></div>
            <div class="background-image">
                <picture class="background-fixed">
                    <source
                        srcset="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-g-ch_1_disappearances_harbv2-lr.jpg 1001w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-g-ch_1_disappearances_harbv2-mr.jpg 1401w, https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-g-ch_1_disappearances_harbv2-hr.jpg"
                    >
                    <img
                        src="https://news.files.bbci.co.uk/include/shorthand/42193/media/2018-g-ch_1_disappearances_harbv2-mr.jpg"
                    >
                </picture>
            </div>
        </section>
        <div style="height:600px">
            <h2>End</h2>
        </div>
    </article>
</template>

<script>
import { throttle } from '../js/utils/utils.js';

let scrollfixers;

let scrollTopClass = 'scroll-change-inner--top';
let scrollFixedClass = 'scroll-change-inner--fixed';
let scrollBottomClass = 'scroll-change-inner--bottom';

export default {
  name: 'Scrollstory',
  data() {
    return {
      msg: '<a href="https://www.bbc.co.uk/news/resources/idt-sh/the_reykjavik_confessions">Scroll Story - like BBC</a>'
    };
  },
  methods: {
    switchScrollClass: function(element, cssClass) {
      requestAnimationFrame(function() {
        element.scrollChangeElement.classList.remove(scrollTopClass);
        element.scrollChangeElement.classList.remove(scrollFixedClass);
        element.scrollChangeElement.classList.remove(scrollBottomClass);

        element.scrollChangeElement.classList.add(cssClass);
      });
    },
    onScroll: function(evt) {
      scrollfixers.forEach((element, index) => {
        let box = element.getBoundingClientRect();

        if (box.top - window.innerHeight <= 0 && box.top >= 0) {
          if (element.lastClassChange != 1) {
            element.lastClassChange = 1;
            this.switchScrollClass(element, scrollTopClass);
          }
        }

        if (box.top <= 0 && box.bottom - window.innerHeight >= 0) {
          if (element.lastClassChange != 2) {
            element.lastClassChange = 2;
            this.switchScrollClass(element, scrollFixedClass);
          }
        }

        if (box.bottom - window.innerHeight <= 0) {
          if (element.lastClassChange != 3) {
            element.lastClassChange = 3;
            this.switchScrollClass(element, scrollBottomClass);
          }
        }
      });
    }
  },
  mounted: function() {
    window.app.useDarkHeader();
      
    scrollfixers = Array.from(document.getElementsByClassName('scroll-fix'));
    scrollfixers.forEach(element => {
      element.scrollChangeElement = element.querySelector('.scroll-change');
    });

    let throttled = throttle(this.onScroll, 20);
    window.addEventListener('scroll', throttled);
  }  
};
</script>


<style scoped lang="scss">
@import '../scss/shared/_variables.scss';

.firstElement {
  background-image: url('/img/high-res/2017-Japan-5.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}

.pageHeading {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  margin: auto;
}

.background-section {
  background-repeat: no-repeat;
  background-size: cover;
}

.text {
  position: relative;
  padding: 30px;
  text-align: center;
  min-width: 250px;
}

.text-over {
  color: $mainFontColour;
  text-align: left;
  z-index: 10;
  margin: 0 auto;
  padding: 5%;
  width: 80%;
}

.text-middle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  left: 50%;
}

.text-narrow {
  max-width: 50%;
}

.background-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  background-color: $darkGrey;
  opacity: 0.2;
  transition: opacity 1s ease-out;
}

.background-image {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  clip: rect(0, auto, auto, 0);
}

.background-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  width: 100%;
  height: 100vh;

  img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.scroll-change-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}

.scroll-change {
  position: absolute;
  bottom: auto;
  z-index: 1;
  width: 100%;
  overflow: hidden;
}

.scroll-change-inner {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  bottom: auto;
  top: auto;
}

.scroll-change-inner--bottom {
  bottom: 0;
}

.scroll-change-inner--top {
  top: 0;
}

.scroll-change-inner--fixed {
  position: fixed;
  top: 0;
}

.scroll-change-img {
  position: absolute;
  top: 0;
  overflow: hidden;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
