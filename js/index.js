const Open = document.querySelector(".OpenNav");
const Close = document.querySelector(".CloseNav");
const navigation = document.querySelector("nav");

Open.addEventListener("click", () => {
  navigation.classList.add("open");
});

Close.addEventListener("click", () => {
  navigation.classList.remove("open");
});
