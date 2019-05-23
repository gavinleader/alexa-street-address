const DIRECTIONS = require('./constants/directions');
const STREET_TYPE = require('./constants/streetType');
const ORDINALS = require('./constants/ordinals');
const errors = require('./constants/errors');

const isNumber = (val) => {
  return /^\d+$/.test(val);
};

const processString = (spokenAddress) => {
  const wordArray = spokenAddress.split(' ');
  let streetTypeIndex;
  const words = wordArray.map((word, i) => {
    let type;

    if (DIRECTIONS.includes(word)) {
      type = 'direction';
    }
    else if (STREET_TYPE.includes(word)) {
      if (streetTypeIndex) {
        type = 'word';
      } else {
        type = 'type';
        streetTypeIndex = i;
      }
    }
    else if (Object.keys(ORDINALS).includes(word)) {
      type = 'ordinal';
    }
    else {
      type = isNumber(word) ? 'number' : 'word';
    }

    return {
      value: word,
      type
    };
  });

  return {
    words,
    streetTypeIndex
  };
};

const appendProp = (obj, name, val) => {
  if (obj[name])
    obj[name] += val;
  else
    obj[name] = val;
};

const parseAddress = (spokenAddress) => {
  const { words, streetTypeIndex } = processString(spokenAddress);
  const addr = {};
  let i = 1;

  if (words[0].type !== 'number')
    return { error: errors.START_WITH_NUMBER };
  if (!streetTypeIndex)
    return { error: errors.NO_STREET_TYPE };

  // house number
  appendProp(addr, 'number', words[0].value);

  // street direction prefix (optional)
  while (words[i].type === 'direction') {
    appendProp(addr, 'prefix', words[i].value);
    i++;
  }

  // street name
  while (i < streetTypeIndex) {
    if (words[i].type === 'ordinal') {
      const number = addr.name 
        ? Number.parseInt(addr.name) + ORDINALS[words[i].value] 
        : ORDINALS[words[i].value];
      let suffix = 'th';

      if (words[i].value === 'first')
        suffix = 'st';
      else if (words[i].value === 'second')
        suffix = 'nd';
      else if (words[i].value === 'third')
        suffix = 'rd';
      addr.name = number + suffix;
    } else {
      if (addr.name)
        addr.name += ` ${words[i].value}`;
      else
        addr.name = words[i].value;
    }
    i++;
  }

  // street type
  addr.type = words[i].value;
  i++;

  // street direction suffix (optional)
  while (i < words.length) {
    appendProp(addr, 'suffix', words[i].value);
    i++;
  }

  return addr;
};

module.exports.getFriendlyAddress = (spokenAddress) => {
  const a = parseAddress(spokenAddress);
  if (a.error) throw a;

  const friendly = [a.number];
  if (a.prefix) friendly.push(a.prefix);
  friendly.push(a.name, a.type);
  if (a.suffix) friendly.push(a.suffix);

  return friendly.join(' ').trim();
};