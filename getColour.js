const {
  getColorHexRGB,

  // for more control and customized checks
  DARWIN_IS_PLATFORM_PRE_CATALINA, // darwin only, undefined on other platform
  darwinGetColorHexRGB, // darwin only, throw error on other platform
  darwinGetScreenPermissionGranted, // darwin only, throw error on other platform
  darwinRequestScreenPermissionPopup, // darwin only, throw error on other platform
} = require("electron-color-picker");

module.exports = async () => {
  // color may be '#0099ff' or '' (pick cancelled with ESC)
  let colour;
  colour = await getColorHexRGB().catch((error) => {
    console.warn("[ERROR] getColor", error);
  });
  //   console.log(`getColor: ${color}`);
  // color && clipboard.writeText(color)

  if (process.platform === "darwin" && !DARWIN_IS_PLATFORM_PRE_CATALINA) {
    const darwinScreenPermissionSample = async () => {
      const isGranted = await darwinGetScreenPermissionGranted(); // initial check
      console.log("darwinGetScreenPermissionGranted:", isGranted);
      if (!isGranted) {
        // request user for permission, no result, and will not wait for user click
        await darwinRequestScreenPermissionPopup();
        console.warn("no permission granted yet, try again");
        return "";
      }
      colour = await darwinGetColorHexRGB().catch((error) => {
        console.warn("[ERROR] getColor", error);
        return "";
      });
      // console.log(`getColor: ${color}`);
      // color && clipboard.writeText(color)
    };
    return colour;
  }
};
