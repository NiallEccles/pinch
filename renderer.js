document.querySelector(".picker1-button").addEventListener("click", () => {
  window.api.send("toMain", { type: "picker1" });
});

document.querySelector(".picker2-button").addEventListener("click", () => {
  window.api.send("toMain", { type: "picker2" });
});

window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
  console.log(data);
  document.querySelector(`.${data.for}`).style.backgroundColor = data.colour;
});
// window.api.send("toMain", "some data");
