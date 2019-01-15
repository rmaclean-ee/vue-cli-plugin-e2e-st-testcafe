exports.arraySetting = (options, key) => {
  let found = -1;
  for (let index = 0; index < options.length; index++) {
    const element = options[index].toLowerCase();
    if (element.startsWith(`--${key.toLowerCase()}:`)) {
      found = index;
      break;
    }
  }

  if (found === -1) {
    return [];
  }

  const data = options[found];
  options.splice(found, 1);
  return data.substring(key.length + 3).split(',');
};

exports.booleanSetting = (options, key) => {
  let found = -1;
  for (let index = 0; index < options.length; index++) {
    const element = options[index].toLowerCase();
    if (element.startsWith(`--${key.toLowerCase()}`)) {
      found = index;
      break;
    }
  }

  if (found === -1) {
    return false;
  }

  options.splice(found, 1);
  return true;
};
