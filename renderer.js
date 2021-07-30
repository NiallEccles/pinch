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
  const wcag = { aa: true, aaa: false };
  for (let i = 0; i < data.results.aa.length; i++) {
    const aa = data.results.aa[i];
    if (aa.grade === "PASS") wcag.aa = true;
  }

  for (let i = 0; i < data.results.aaa.length; i++) {
    const aaa = data.results.aaa[i];
    if (aaa.grade === "PASS") wcag.aaa = true;
  }

  if (wcag.aa && !wcag.aaa) {
    document.querySelector(".rating").innerHTML = "AA";
    document.querySelector("#multiple").style.display = 'none';
    document.querySelector("#single").style.display = 'initial';
  } else if (wcag.aa && wcag.aaa) {
    document.querySelector(".rating").innerHTML = "AAA";
    document.querySelector("#multiple").style.display = 'initial';
    document.querySelector("#single").style.display = 'none';
  } else if (!wcag.aa && !wcag.aaa) {
    document.querySelector(".rating").innerHTML = "";
  }
});
