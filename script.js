const colorPicker = new iro.ColorPicker(".main-color-block", {
  width: 120,
  color: "rgb(0, 0, 0)",
  borderWidth: 1,
  borderColor: "#fff",
});
const btnPick = document.querySelector(".pick");
const mainSelect = document.querySelector(".main-color-select");
const color2Select = document.querySelector(".color-2");
const color3Select = document.querySelector(".color-3");
const copy2Btn = document.querySelector(".copy-2");
const copy3Btn = document.querySelector(".copy-3");
const colorText2 = document.querySelector(".color-text-2");
const colorText3 = document.querySelector(".color-text-3");
const mainBlock = document.querySelector(".main-color-block");
const color2Block = document.querySelector(".color-2-block");
const color3Block = document.querySelector(".color-3-block");
const mainInput1 = document.querySelector(".main-input-1");
const mainInput2 = document.querySelector(".main-input-2");
const mainInput3 = document.querySelector(".main-input-3");
const mainInput4 = document.querySelector(".main-input-4");
const label1 = document.querySelector(".label-1");
const label2 = document.querySelector(".label-2");
const label3 = document.querySelector(".label-3");
const label4 = document.querySelector(".label-4");

let mainColor = [0, 0, 0];
let color2 = [0, 0, 0];
let color3 = [0, 0, 0];

colorPicker.on("color:change", function (color) {
  mainColor = hexToRgb(color.hexString);
  switch (mainSelect.value) {
    case "rgb":
      mainInput1.value = mainColor[0];
      mainInput2.value = mainColor[1];
      mainInput3.value = mainColor[2];
      break;
    case "hex":
      mainInput1.value = colorPicker.color.hexString;
      break;
    case "cmyk":
      let temp = rgbToCmyk(...mainColor);
      mainInput1.value = temp[0];
      mainInput2.value = temp[1];
      mainInput3.value = temp[2];
      mainInput4.value = temp[3];
      break;
    case "xyz":
      let temp1 = rgbToXyz(...mainColor);
      mainInput1.value = temp1[0];
      mainInput2.value = temp1[1];
      mainInput3.value = temp1[2];
      break;
    case "lab":
      let temp2 = rgbToLab(...mainColor);
      mainInput1.value = temp2[0];
      mainInput2.value = temp2[1];
      mainInput3.value = temp2[2];
      break;
    case "hsv":
      mainInput1.value = color.hsv["h"];
      mainInput2.value = color.hsv["s"];
      mainInput3.value = color.hsv["v"];
      break;
  }
  btnPick.dispatchEvent(new Event("click"));
});

/* Валидаторы */

function isRgb(r, g, b) {
  if (0 <= r && r <= 255 && 0 <= g && g <= 255 && 0 <= b && b <= 255) {
    return true;
  }
  return false;
}

function isHex(str) {
  str = String(str);
  let tempArray = str.substring(1).split("");
  let flag = false;

  tempArray.forEach((elem) => {
    if (
      !(
        (0 <= elem && elem <= 9) ||
        ("a" <= elem && "f" <= elem) ||
        ("A" <= elem && "F" <= elem)
      )
    ) {
      flag = true;
    }
  });

  if (str.charAt(0) !== "#" || str.length !== 7 || flag) {
    return false;
  }
  return true;
}

function isCmyk(c, m, y, k) {
  return (
    0 <= c &&
    c <= 100 &&
    0 <= m &&
    m <= 100 &&
    0 <= y &&
    y <= 100 &&
    0 <= k &&
    k <= 100
  );
}

function isXyz(x, y, z) {
  return 0 <= x && x <= 95.047 && 0 <= y && y <= 100 && 0 <= z && z <= 108.883;
}

function isLab(l, a, b) {
  return 0 <= l && l <= 100 && -128 <= a && a <= 128 && -128 <= b && b <= 128;
}

function isHsv(h, s, v) {
  return 0 <= h && h <= 360 && 0 <= s && s <= 100 && 0 <= v && v <= 100;
}

/* Отлавливание изменений */

btnPick.addEventListener("click", () => {
  switch (mainSelect.value) {
    case "rgb":
      if (!isRgb(mainInput1.value, mainInput2.value, mainInput3.value)) {
        alert(
          "Неверно введены данные: значения в RGB должны быть не меньше 0 и не больше 255."
        );
        mainInput1.value = "0";
        mainInput2.value = "0";
        mainInput3.value = "0";
      }
      mainColor = [mainInput1.value, mainInput2.value, mainInput3.value];
      break;
    case "hex":
      if (!isHex(mainInput1.value)) {
        alert("Неверно введены данные: кодировка Hex имеет вид #123456");
        mainInput1.value = "#000000";
      }
      mainColor = hexToRgb(mainInput1.value);
      break;
    case "cmyk":
      if (
        !isCmyk(
          mainInput1.value,
          mainInput2.value,
          mainInput3.value,
          mainInput4.value
        )
      ) {
        alert(
          "Неверно введены данные: значения в CMYK должны быть не меньше 0% и не больше 100%."
        );
        mainInput1.value = "0";
        mainInput2.value = "0";
        mainInput3.value = "0";
        mainInput4.value = "100";
      }
      mainColor = cmykToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value,
        mainInput4.value
      );
      break;
    case "xyz":
      if (!isXyz(mainInput1.value, mainInput2.value, mainInput3.value)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= x <= 95.047, 0 <= y <= 100, 0 <= z <= 108.883."
        );
        mainInput1.value = "0";
        mainInput2.value = "0";
        mainInput3.value = "0";
      }
      mainColor = xyzToRgb(
        ...[mainInput1.value, mainInput2.value, mainInput3.value]
      );
      break;
    case "lab":
      if (!isLab(mainInput1.value, mainInput2.value, mainInput3.value)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= L <= 100, -128 <= y <= 128, -128 <= z <= 128."
        );
        mainInput1.value = "0";
        mainInput2.value = "0";
        mainInput3.value = "0";
      }
      mainColor = labToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value
      );
      break;
    case "hsv":
      if (!isHsv(mainInput1.value, mainInput2.value, mainInput3.value)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= H <= 360, 0 <= s <= 100, 0 <= v <= 100."
        );
        mainInput1.value = "0";
        mainInput2.value = "0";
        mainInput3.value = "0";
      }
      mainColor = hsvToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value
      );
      break;
  }
  colorPicker.color.hexString = rgbToHex(...mainColor);
  color2Select.dispatchEvent(new Event("change"));
  color3Select.dispatchEvent(new Event("change"));
});

mainSelect.addEventListener("change", () => {
  switch (mainSelect.value) {
    case "rgb":
      mainInput1.disabled = false;
      mainInput1.value = mainColor[0];
      mainInput2.disabled = false;
      mainInput2.value = mainColor[1];
      mainInput3.disabled = false;
      mainInput3.value = mainColor[2];
      mainInput4.disabled = true;
      mainInput4.value = "";
      mainColor = [mainInput1.value, mainInput2.value, mainInput3.value];
      break;
    case "hex":
      mainInput1.value = rgbToHex(...mainColor);
      mainInput1.disabled = false;
      mainInput2.disabled = true;
      mainInput2.value = "";
      mainInput3.disabled = true;
      mainInput3.value = "";
      mainInput4.disabled = true;
      mainInput4.value = "";
      break;
    case "cmyk":
      mainInput1.disabled = false;
      mainInput1.value = rgbToCmyk(...mainColor)[0];
      mainInput2.disabled = false;
      mainInput2.value = rgbToCmyk(...mainColor)[1];
      mainInput3.disabled = false;
      mainInput3.value = rgbToCmyk(...mainColor)[2];
      mainInput4.disabled = false;
      mainInput4.value = rgbToCmyk(...mainColor)[3];
      mainColor = cmykToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value,
        mainInput4.value
      );
      break;
    case "xyz":
      mainInput1.disabled = false;
      mainInput1.value = rgbToXyz(...mainColor)[0];
      mainInput2.disabled = false;
      mainInput2.value = rgbToXyz(...mainColor)[1];
      mainInput3.disabled = false;
      mainInput3.value = rgbToXyz(...mainColor)[2];
      mainInput4.disabled = true;
      mainInput4.value = "";
      mainColor = xyzToRgb(
        ...[mainInput1.value, mainInput2.value, mainInput3.value]
      );
      break;
    case "lab":
      mainInput1.disabled = false;
      mainInput1.value = rgbToLab(...mainColor)[0];
      mainInput2.disabled = false;
      mainInput2.value = rgbToLab(...mainColor)[1];
      mainInput3.disabled = false;
      mainInput3.value = rgbToLab(...mainColor)[2];
      mainInput4.disabled = true;
      mainInput4.value = "";
      mainColor = labToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value
      );
      break;
    case "hsv":
      mainInput1.disabled = false;
      mainInput1.value = rgbToHsv(...mainColor)[0];
      mainInput2.disabled = false;
      mainInput2.value = rgbToHsv(...mainColor)[1];
      mainInput3.disabled = false;
      mainInput3.value = rgbToHsv(...mainColor)[2];
      mainInput4.disabled = true;
      mainInput4.value = "";
      mainColor = hsvToRgb(
        mainInput1.value,
        mainInput2.value,
        mainInput3.value
      );
      break;
  }
  changeLetters(mainSelect.value);
});

color2Select.addEventListener("change", () => {
  switch (color2Select.value) {
    case "rgb":
      color2 = mainColor;
      colorText2.value = "rgb(" + color2.join(", ") + ")";
      color2Block.style.backgroundColor = colorText2.value;
      break;
    case "hex":
      color2 = mainColor;
      colorText2.value = rgbToHex(...color2);
      color2Block.style.backgroundColor = colorText2.value;
      break;
    case "cmyk":
      color2 = mainColor;
      colorText2.value = rgbToCmyk(...color2).join("%, ") + "%";
      color2Block.style.backgroundColor =
        "rgb(" + cmykToRgb(...rgbToCmyk(...color2)).join(", ") + ")";
      break;
    case "xyz":
      color2 = mainColor;
      colorText2.value = rgbToXyz(...color2).join(", ");
      color2Block.style.backgroundColor =
        "rgb(" + xyzToRgb(...rgbToXyz(...color2)).join(", ") + ")";
      break;
    case "lab":
      color2 = mainColor;
      colorText2.value = rgbToLab(...color2).join(", ");
      color2Block.style.backgroundColor =
        "rgb(" + labToRgb(...rgbToLab(...color2)).join(", ") + ")";
      break;
    case "hsv":
      color2 = mainColor;

      colorText2.value =
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[0] +
        ", " +
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[1] +
        "%, " +
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[2] +
        "%";
      color2Block.style.backgroundColor =
        "rgb(" + hsvToRgb(...rgbToHsv(...color2)).join(", ") + ")";
      break;
  }
});

color3Select.addEventListener("change", () => {
  switch (color3Select.value) {
    case "rgb":
      color3 = mainColor;
      colorText3.value = "rgb(" + color3.join(", ") + ")";
      color3Block.style.backgroundColor = colorText3.value;
      break;
    case "hex":
      color3 = mainColor;
      colorText3.value = rgbToHex(...color3);
      color3Block.style.backgroundColor = colorText3.value;
      break;
    case "cmyk":
      color3 = mainColor;
      colorText3.value = rgbToCmyk(...color2).join("%, ") + "%";
      color3Block.style.backgroundColor =
        "rgb(" + cmykToRgb(...rgbToCmyk(...color3)).join(", ") + ")";
      break;
    case "xyz":
      color3 = mainColor;
      colorText3.value = rgbToXyz(...color3).join(", ");
      color3Block.style.backgroundColor =
        "rgb(" + xyzToRgb(...rgbToXyz(...color3)).join(", ") + ")";
      break;
    case "lab":
      color3 = mainColor;
      colorText3.value = rgbToLab(...color3).join(", ");
      color3Block.style.backgroundColor =
        "rgb(" + labToRgb(...rgbToLab(...color3)).join(", ") + ")";
      break;
    case "hsv":
      color3 = mainColor;
      colorText3.value =
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[0] +
        ", " +
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[1] +
        "%, " +
        rgbToHsv(mainInput1.value, mainInput2.value, mainInput3.value)[2] +
        "%";
      color3Block.style.backgroundColor =
        "rgb(" + hsvToRgb(...rgbToHsv(...color3)).join(", ") + ")";
      break;
  }
});

/* Функции конвертирования */

function componentToHex(c) {
  var hex = Number(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbToCmyk(r, g, b) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, Math.min(m, y));

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  c = isNaN(c) ? 0 : c;
  m = isNaN(m) ? 0 : m;
  y = isNaN(y) ? 0 : y;
  k = isNaN(k) ? 0 : k;

  return [
    Math.round(c * 100),
    Math.round(m * 100),
    Math.round(y * 100),
    Math.round(k * 100),
  ];
}

function fXyz(x) {
  return x >= 0.04045 ? ((x + 0.055) / 1.055) ** 2.4 : x / 12.92;
}

function rgbToXyz(r, g, b) {
  let a = [fXyz(r / 255) * 100, fXyz(g / 255) * 100, fXyz(b / 255) * 100];

  return [
    Math.round((0.412453 * a[0] + 0.35758 * a[1] + 0.180423 * a[2]) * 100) /
      100,
    Math.round((0.212671 * a[0] + 0.71516 * a[1] + 0.072169 * a[2]) * 100) /
      100,
    Math.round(
      ((0.019334 * a[0] + 0.119193 * a[1] + 0.950227 * a[2]) * 100) / 100
    ),
  ];
}

function fLab(x) {
  return x >= 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
}

function rgbToLab(r, g, b) {
  let xyz = rgbToXyz(r, g, b);
  return [
    Math.round((116 * fLab(xyz[1] / 100) - 16) * 100) / 100,
    Math.round(500 * (fLab(xyz[0] / 95.047) - fLab(xyz[1] / 100)) * 100) / 100,
    Math.round(200 * (fLab(xyz[1] / 100) - fLab(xyz[2] / 108.883)) * 100) / 100,
  ];
}

function rgbToHsv(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hexToRgb(c) {
  var bigint = parseInt(c.split("#")[1], 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}

function cmykToRgb(c, m, y, k) {
  c = c / 100;
  m = m / 100;
  y = y / 100;
  k = k / 100;

  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;

  let r = 1 - c;
  let g = 1 - m;
  let b = 1 - y;

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function fXyzRgb(x) {
  return x >= 0.0031308 ? (1.055 * x) ** (1 / 2.4) - 0.055 : 12.92 * x;
}

function xyzToRgb(x, y, z) {
  let a = [
    (3.2406 * x - 1.5372 * y - 0.4986 * z) / 100,
    (-0.9689 * x + 1.8758 * y + 0.0415 * z) / 100,
    (0.0557 * x - 0.204 * y + 1.057 * z) / 100,
  ];

  return [
    Math.round(fXyzRgb(a[0]) * 255),
    Math.round(fXyzRgb(a[1]) * 255),
    Math.round(fXyzRgb(a[2]) * 255),
  ];
}

function fLabRgb(x) {
  return x >= 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787;
}

function labToRgb(l, a, b) {
  let xyz = [
    Math.round(fLabRgb(a / 500 + (l + 16) / 116) * 100),
    Math.round(fLabRgb((l + 16) / 116) * 95.047),
    Math.round(fLabRgb((l + 16) / 116 - b / 200) * 108.883),
  ];
  return xyzToRgb(...xyz);
}

function hsvToRgb(h, s, v) {
  h /= 360;
  s /= 100;
  v /= 100;
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/* Копирование текста с 2-го и 3-го цветов */

copy2Btn.addEventListener("click", () => {
  navigator.clipboard.writeText(colorText2.value);
  alert("Код " + color2Select.value + " скопирован в буфер обмена.");
});

copy3Btn.addEventListener("click", () => {
  navigator.clipboard.writeText(colorText3.value);
  alert("Код " + color3Select.value + " скопирован в буфер обмена.");
});

/* Изменение инпутов у 2 и 3 блока */

function changeAllColor(colorsOptions) {
  console.log(colorsOptions);
  switch (mainSelect.value) {
    case "rgb":
      mainInput1.value = colorsOptions[0];
      mainInput2.value = colorsOptions[1];
      mainInput3.value = colorsOptions[2];
      break;
    case "hex":
      colorsOptions = rgbToHex(colorsOptions);
      mainInput1.value = colorsOptions[0];
      break;
    case "cmyk":
      colorsOptions = rgbToCmyk(colorsOptions);
      mainInput1.value = colorsOptions[0];
      mainInput2.value = colorsOptions[1];
      mainInput3.value = colorsOptions[2];
      mainInput4.value = colorsOptions[3];
      break;
    case "xyz":
      colorsOptions = rgbToXyz(colorsOptions);
      mainInput1.value = colorsOptions[0];
      mainInput2.value = colorsOptions[1];
      mainInput3.value = colorsOptions[2];
      break;
    case "lab":
      colorsOptions = rgbToLab(colorsOptions);
      mainInput1.value = colorsOptions[0];
      mainInput2.value = colorsOptions[1];
      mainInput3.value = colorsOptions[2];
      break;
    case "hsv":
      colorsOptions = rgbToHsv(colorsOptions);
      mainInput1.value = colorsOptions[0];
      mainInput2.value = colorsOptions[1];
      mainInput3.value = colorsOptions[2];
      break;
  }

  btnPick.dispatchEvent(new Event("click"));
}

colorText2.addEventListener("change", () => {
  switch (color2Select.value) {
    case "rgb":
      let rgb = colorText2.value.split(",").map((elem) => Number(elem));
      if (!isRgb(...rgb)) {
        alert(
          "Неверно введены данные: значения в RGB должны быть не меньше 0 и не больше 255."
        );
        rgb[0] = 0;
        rgb[1] = 0;
        rgb[2] = 0;
      }
      color2 = rgb;
      colorText2.value = "rgb(" + color2.join(", ") + ")";
      color2Block.style.backgroundColor = colorText2.value;
      changeAllColor(color2);
      break;
    case "hex":
      if (!isHex(colorText2.value)) {
        alert("Неверно введены данные: кодировка Hex имеет вид #123456");
        colorText2.value = "#000000";
      }
      color2 = hexToRgb(colorText2.value);
      colorText2.value = rgbToHex(...color2);
      color2Block.style.backgroundColor = colorText2.value;
      changeAllColor(color2);
      break;
    case "cmyk":
      let cmyk = (colorText2.value + ",")
        .split("%,")
        .map((elem) => Number(elem));
      if (!isCmyk(...cmyk)) {
        alert(
          "Неверно введены данные: значения в CMYK должны быть не меньше 0% и не больше 100%."
        );
        cmyk[0] = "0";
        cmyk[1] = "0";
        cmyk[2] = "0";
        cmyk[3] = "100";
      }
      cmyk = cmyk.slice(0, 4);
      color2 = cmykToRgb(...cmyk);
      colorText2.value = cmyk.join("%, ") + "%";
      color2Block.style.backgroundColor =
        "rgb(" + cmykToRgb(...rgbToCmyk(...color2)).join(", ") + ")";
      changeAllColor(color2);
      break;
    case "xyz":
      let xyz = colorText2.value.split(",").map((elem) => Number(elem));
      if (!isXyz(...xyz)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= x <= 95.047, 0 <= y <= 100, 0 <= z <= 108.883."
        );
        xyz[0] = "0";
        xyz[1] = "0";
        xyz[2] = "0";
      }
      color2 = xyzToRgb(...xyz);
      colorText2.value = xyz.join(", ");
      color2Block.style.backgroundColor =
        "rgb(" + xyzToRgb(...rgbToXyz(...color2)).join(", ") + ")";
      changeAllColor(color2);
      break;
    case "lab":
      let lab = colorText2.value.split(",").map((elem) => Number(elem));
      if (!isLab(...lab)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= L <= 100, -128 <= y <= 128, -128 <= z <= 128."
        );
        lab[0] = "0";
        lab[1] = "0";
        lab[2] = "0";
      }
      color2 = labToRgb(...lab);
      colorText2.value = lab.join(", ");
      color2Block.style.backgroundColor =
        "rgb(" + labToRgb(...rgbToLab(...color2)).join(", ") + ")";
      changeAllColor(color2);
      break;
    case "hsv":
      let hsv = colorText2.value.split(",");
      hsv = [hsv[0], hsv[1].split("%")[0], hsv[2].split("%")[0]].map((elem) =>
        Number(elem)
      );
      if (!isHsv(...hsv)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= H <= 360, 0 <= s <= 100, 0 <= v <= 100."
        );
        hsv[0] = "0";
        hsv[1] = "0";
        hsv[2] = "0";
      }
      color2 = hsvToRgb(...hsv);
      colorText2.value = hsv[0] + ", " + hsv[1] + "%, " + hsv[2] + "%";
      color2Block.style.backgroundColor =
        "rgb(" + hsvToRgb(...rgbToHsv(...color2)).join(", ") + ")";
      changeAllColor(color2);
      break;
  }
});

colorText3.addEventListener("change", () => {
  switch (color3Select.value) {
    case "rgb":
      let rgb = colorText3.value.split(",").map((elem) => Number(elem));
      if (!isRgb(...rgb)) {
        alert(
          "Неверно введены данные: значения в RGB должны быть не меньше 0 и не больше 255."
        );
        rgb[0] = 0;
        rgb[1] = 0;
        rgb[2] = 0;
      }
      color3 = rgb;
      colorText3.value = color2.join(", ");
      color3Block.style.backgroundColor = colorText3.value;
      changeAllColor(color3);
      break;
    case "hex":
      if (!isHex(colorText3.value)) {
        alert("Неверно введены данные: кодировка Hex имеет вид #123456");
        colorText3.value = "#000000";
      }
      color3 = hexToRgb(colorText3.value);
      colorText3.value = rgbToHex(...color3);
      color3Block.style.backgroundColor = colorText3.value;
      changeAllColor(color3);
      break;
    case "cmyk":
      let cmyk = (colorText3.value + ",")
        .split("%,")
        .map((elem) => Number(elem));
      if (!isCmyk(...cmyk)) {
        alert(
          "Неверно введены данные: значения в CMYK должны быть не меньше 0% и не больше 100%."
        );
        cmyk[0] = "0";
        cmyk[1] = "0";
        cmyk[2] = "0";
        cmyk[3] = "100";
      }
      cmyk = cmyk.slice(0, 4);
      color3 = cmykToRgb(...cmyk);
      colorText3.value = cmyk.join("%, ") + "%";
      color3Block.style.backgroundColor =
        "rgb(" + cmykToRgb(...rgbToCmyk(...color3)).join(", ") + ")";
      changeAllColor(color3);
      break;
    case "xyz":
      let xyz = colorText3.value.split(",").map((elem) => Number(elem));
      if (!isXyz(...xyz)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= x <= 95.047, 0 <= y <= 100, 0 <= z <= 108.883."
        );
        xyz[0] = "0";
        xyz[1] = "0";
        xyz[2] = "0";
      }
      color3 = xyzToRgb(...xyz);
      colorText3.value = xyz.join(", ");
      color3Block.style.backgroundColor =
        "rgb(" + xyzToRgb(...rgbToXyz(...color3)).join(", ") + ")";
      changeAllColor(color3);
      break;
    case "lab":
      let lab = colorText3.value.split(",").map((elem) => Number(elem));
      if (!isLab(...lab)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= L <= 100, -128 <= y <= 128, -128 <= z <= 128."
        );
        lab[0] = "0";
        lab[1] = "0";
        lab[2] = "0";
      }
      color3 = labToRgb(...lab);
      colorText3.value = lab.join(", ");
      color3Block.style.backgroundColor =
        "rgb(" + labToRgb(...rgbToLab(...color3)).join(", ") + ")";
      changeAllColor(color3);
      break;
    case "hsv":
      let hsv = colorText3.value.split(",");
      hsv = [hsv[0], hsv[1].split("%")[0], hsv[2].split("%")[0]].map((elem) =>
        Number(elem)
      );
      if (!isHsv(...hsv)) {
        alert(
          "Неверно введены данные: валидные значения 0 <= H <= 360, 0 <= s <= 100, 0 <= v <= 100."
        );
        hsv[0] = "0";
        hsv[1] = "0";
        hsv[2] = "0";
      }
      color3 = hsvToRgb(...hsv);
      colorText3.value = hsv[0] + ", " + hsv[1] + "%, " + hsv[2] + "%";
      color3Block.style.backgroundColor =
        "rgb(" + hsvToRgb(...rgbToHsv(...color3)).join(", ") + ")";
      changeAllColor(color3);
      break;
  }
});

/* Изменение букав у Input */

function changeLetters(codeName) {
  switch (codeName) {
    case "rgb":
      label1.innerHTML = "R";
      label2.innerHTML = "G";
      label3.innerHTML = "B";
      label4.innerHTML = "";
      break;
    case "hex":
      label1.innerHTML = "";
      label2.innerHTML = "";
      label3.innerHTML = "";
      label4.innerHTML = "";
      break;
    case "cmyk":
      label1.innerHTML = "C";
      label2.innerHTML = "M";
      label3.innerHTML = "Y";
      label4.innerHTML = "K";
      break;
    case "xyz":
      label1.innerHTML = "X";
      label2.innerHTML = "Y";
      label3.innerHTML = "Z";
      label4.innerHTML = "";
      break;
    case "lab":
      label1.innerHTML = "L";
      label2.innerHTML = "A";
      label3.innerHTML = "B";
      label4.innerHTML = "";
      break;
    case "hsv":
      label1.innerHTML = "H";
      label2.innerHTML = "S";
      label3.innerHTML = "V";
      label4.innerHTML = "";
      break;
  }
}
