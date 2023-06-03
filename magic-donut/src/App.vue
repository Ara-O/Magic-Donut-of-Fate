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
        @click="
          userIsWorthy = true;
          worthinessHasBeenDecided = true;
        "
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
  <main
    v-show="worthinessHasBeenDecided"
    class="flex justify-center items-center h-screen flex-col"
  >
    <canvas
      class="bg-gray-400 bg-transparent"
      height="300"
      width="300"
      ref="donutCanvas"
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
          class="transition ease-in-out hover:animate-spin"
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
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import createDonut from "./threejs/donut";
import axios from "axios";
let donutCanvas = ref<HTMLCanvasElement>();
let donutButtonImage = ref<HTMLImageElement>();
let donutButtonImagePrank = ref<HTMLImageElement>();
let userQuestion = ref<string>("");
let userFate = ref<string>("");
let worthinessHasBeenDecided = ref<boolean>(false);
let userIsWorthy = ref<boolean>();

watchEffect(() => {
  if (donutCanvas.value) {
    createDonut(donutCanvas.value);
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
});

async function receiveFate() {
  donutButtonImage.value?.classList.add("animateDonutClick");
  setTimeout(() => {
    donutButtonImage.value?.classList.remove("animateDonutClick");
  }, 250);
  let response = await axios.post("http://localhost:8080/askMagicDonut", {
    question: userQuestion.value,
  });

  console.log(response);
  userFate.value = response.data.message;
  console.log("ahh");
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
    "Somehow, you managed to click it, you get no prize, but stil. Good job :)"
  );
}

onMounted(async () => {
  const worthiness: number = Math.random();
  if (worthiness < 0.7) {
    userIsWorthy.value = true;
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
