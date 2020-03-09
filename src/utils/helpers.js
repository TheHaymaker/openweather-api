import { weatherIcons } from "../icons";

export const buildIcon = day => {
  let dayOrNight;
  let prefix = "wi wi-";

  const today = new Date();
  const hour = today.getHours();

  if (hour > 6 && hour < 20) {
    dayOrNight = "day-";
  } else {
    dayOrNight = "night-";
  }

  const code = day.weather[0].id;
  let iconDesc = weatherIcons.filter(x => {
    if (x[code]) {
      return x;
    }
    return null;
  });
  iconDesc = iconDesc[0][code].icon;
  prefix = `${prefix}${iconDesc}`;

  return `${prefix} wi-owm-${dayOrNight}${code}`;
};

export const buildIconFromID = id => {
  let dayOrNight;
  let prefix = "wi wi-";

  const today = new Date();
  const hour = today.getHours();

  if (hour > 6 && hour < 20) {
    dayOrNight = "day-";
  } else {
    dayOrNight = "night-";
  }

  const code = id;
  let iconDesc = weatherIcons.filter(x => {
    if (x[code]) {
      return x;
    }
    return null;
  });
  iconDesc = iconDesc[0][code].icon;
  prefix = `${prefix}${iconDesc}`;

  return `${prefix} wi-owm-${dayOrNight}${code}`;
};

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const titleCase = str => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

export const kelvinToFahrenheit = k => {
  const temp = (k - 273.15) * 1.8 + 32;
  return temp;
};
