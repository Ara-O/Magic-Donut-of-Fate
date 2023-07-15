<template>
  <main
    class="flex justify-center items-center h-screen flex-col"
    v-show="!worthinessHasBeenDecided"
  >
    <span v-if="userIsWorthy" class="flex flex-col items-center px-8">
      <h3 class="font-bold text-2xl text-center">
        The Magic Donut Has Deemed You Worthy
      </h3>
      <h3 class="mt-4 text-[15px] md:text-lg font-light">
        Click the Donut Below To Enter Its Presence
      </h3>
      <img
        src="./assets/donut.png"
        class="w-10 cursor-pointer mt-4"
        alt="Donut image"
        @click="enterDonutPresence"
      />
    </span>
    <span class="flex flex-col items-center" v-else>
      <h3 class="font-bold text-2xl text-center">
        The Magic Donut Has Deemed You Not Worthy.
      </h3>
      <h3 class="mt-4 text-[15px] md:text-lg font-light">
        Flee. Lest you feel its wrath
      </h3>
      <img
        src="./assets/donut.png"
        class="w-10 cursor-pointer mt-[100px] absolute"
        alt="Donut image"
        id="cursed-donut"
        ref="donutButtonImagePrank"
        @mouseover="moveDonutButtonPosition"
        @click="forbiddenDonutClick"
      />
    </span>
  </main>
  <Transition name="fade-in">
    <main
      v-show="worthinessHasBeenDecided"
      class="flex justify-center items-center h-screen flex-col"
    >
      <canvas
        class="bg-transparent"
        height="300"
        width="300"
        ref="donutCanvas"
        v-if="userQuestion !== 'Show me Homer'"
      ></canvas>

      <canvas
        class="bg-transparent"
        height="300"
        width="300"
        ref="homerCanvas"
        v-if="userQuestion === 'Show me Homer'"
      ></canvas>

      <section class="text-center w-96">
        <h3 class="text-lg tracking-wide font-medium">
          Ask the Magic Donut a question
        </h3>

        <span class="flex justify-center mt-6 items-center gap-5">
          <input
            type="text"
            v-model="userQuestion"
            class="h-11 w-72 px-4 font-light rounded-[4px] border-[0.01px] border-[#ffffffba] bg-transparent text-center text-sm outline-none"
            placeholder="Ask and ye shall receive"
          />
          <button
            class="transition ease-in-out"
            :class="{ 'animate-spin': fateIsLoading }"
            @click="receiveFate"
          >
            <img
              src="./assets/donut.png"
              class="w-9 cursor-pointer"
              alt="Donut image"
              ref="donutButtonImage"
            />
          </button>
        </span>

        <div class="h-56">
          <h5 class="leading-7 mt-5 font-light text-[14.5px]">
            {{ userFate }}
          </h5>
        </div>
      </section>
    </main>
  </Transition>
  <a href="https://github.com/Ara-O/Magic-Donut-of-Fate" target="_blank">
    <img
      src="./assets/github-logo.png"
      class="w-7 brightness-50 cursor-pointer absolute bottom-4 right-5 invert"
      alt="Github Logo"
    />
  </a>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import createDonut from "./threejs/donut";
import createHomer from "./threejs/homer";
import axios from "axios";
let donutCanvas = ref<HTMLCanvasElement>();
let homerCanvas = ref<HTMLCanvasElement>();
let donutButtonImage = ref<HTMLImageElement>();
let donutButtonImagePrank = ref<HTMLImageElement>();
let userQuestion = ref<string>("");
let userFate = ref<string>("");
let worthinessHasBeenDecided = ref<boolean>(false);
let userIsWorthy = ref<boolean>();
let fateIsLoading = ref<boolean>(false);

watchEffect(() => {
  if (donutCanvas.value) {
    createDonut(donutCanvas.value);
  }

  if (homerCanvas.value) {
    createHomer(homerCanvas.value);
  }
});

async function receiveFate() {
  donutButtonImage.value?.classList.add("animateDonutClick");
  fateIsLoading.value = true;
  setTimeout(() => {
    donutButtonImage.value?.classList.remove("animateDonutClick");
  }, 250);
  let response = await axios.post(
    "https://minim-jd5z.onrender.com/askMagicDonut",
    {
      question: userQuestion.value,
    }
  );

  fateIsLoading.value = false;
  userFate.value = response.data.message;
}

function enterDonutPresence() {
  userIsWorthy.value = true;
  worthinessHasBeenDecided.value = true;
}

function moveDonutButtonPosition() {
  let xValue = Math.random() * window.innerWidth;
  let yValue = Math.random() * window.innerHeight;

  let e: any = document.querySelector("#cursed-donut");
  e.style.left = `${xValue - 20}px`;
  e.style.top = `${yValue - 20}px`;
}

function forbiddenDonutClick() {
  alert(
    "Somehow, you managed to click it, you get no prize, but still. Good job :)"
  );
}

onMounted(async () => {
  const worthiness: number = Math.random();
  if (worthiness < 0.7) {
    userIsWorthy.value = true;
    console.log(` 
 _   _      _ _
| | | |    | | |
| |_| | ___| | | ___
|  _  |/ _ \\ | |/ _ \\ 
| | | |  __/ | | (_) |
\\_| |_/\\___|_|_\\____/
`);
    console.log("");
    console.log(
      "%cYour first easter egg is 'Show me Homer'!",
      "font-family: monospace,Poppins, Arial, sans-serif; font-size: 13px;color: lightgreen"
    );
  } else {
    userIsWorthy.value = false;
  }
});
</script>

<style scoped>
.animateDonutClick {
  transform: scale(0.8);
  animation: DonutBounce 250ms forwards 0s ease-in-out;
  transition: all 250ms;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.7s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
@keyframes DonutBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
