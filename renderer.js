const getProp = (propName) =>
  document.documentElement.style.getPropertyValue(propName);

const setProp = (propName, value) =>
  document.documentElement.style.setProperty(propName, value);

document.querySelector(".picker1-button").addEventListener("click", () => {
  const colour1 = getProp("--bg-colour");
  const colour2 = getProp("--text-colour");
  window.api.send("pickColour", {
    type: "picker1",
    colours: { colour1, colour2 },
  });
});

document.querySelector(".picker2-button").addEventListener("click", () => {
  const colour1 = getProp("--bg-colour");
  const colour2 = getProp("--text-colour");
  window.api.send("pickColour", {
    type: "picker2",
    colours: { colour1, colour2 },
  });
});

window.api.receive("sendColour", (data) => {
  console.log(`Received ${data} from main process`);
  console.log(data);
  if (data.for === "picker1") {
    document.querySelector("body").style.backgroundColor = data.colour;
    setProp("--bg-colour", data.colour);
  } else {
    setProp("--text-colour", data.colour);
  }

  const colour1 = getProp("--bg-colour");
  const colour2 = getProp("--text-colour");
  window.api.send("requestWCAG", {
    colours: { colour1, colour2 },
  });

  document.querySelector(`.${data.for}`).innerHTML = data.colour;
});

window.api.receive("WCAGresults", (data) => {
  console.log(data);
});
