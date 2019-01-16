const findSetting = (key) => {
  let found = -1;
  for (let index = 0; index < options.length; index++) {
    const element = options[index].toLowerCase();
    if (element.startsWith(`--${key.toLowerCase()}:`)) {
      found = index;
      break;
    }
  }

  return found;
};

exports.arraySetting = (options, key) => {
  return stringSetting(options, key).split(',');
};

exports.stringSetting = (options, key) => {
  const found = findSetting(key);
  if (found === -1) {
    return undefined;
  }

  const data = options[found];
  options.splice(found, 1);
  return data.substring(key.length + 3);
};

exports.booleanSetting = (options, key) => {
  const found = findSetting(key);

  if (found === -1) {
    return false;
  }

  options.splice(found, 1);
  return true;
};
