const parser = require('./index');
const errors = require('./constants/errors')

const testAddresses = [
  {
    spoken: '123 northeast 30 first avenue',
    friendly: '123 northeast 31st avenue'
  },
  {
    spoken: '123 north east 20 second avenue',
    friendly: '123 northeast 22nd avenue'
  },
  {
    spoken: '123 northeast 50 third avenue',
    friendly: '123 northeast 53rd avenue'
  },
  {
    spoken: '123 northeast 50 fifth avenue',
    friendly: '123 northeast 55th avenue'
  },
  {
    spoken: '123 50 fifth avenue north',
    friendly: '12350 5th avenue north'
  },
  {
    spoken: '123 fifth avenue',
    friendly: '123 5th avenue'
  },
  {
    spoken: '123 lower green hills drive south',
    friendly: '123 lower green hills drive south'
  },
  {
    spoken: '123 old highway road',
    friendly: '123 old highway road'
  },
  {
    spoken: 'one two eight zero se market street',
    friendly: '1280 se market street'
  },
  {
    spoken: 'one two zero eight se market street',
    friendly: '1208 se market street'
  },
  {
    spoken: 'four thousand two twenty se clinton street',
    friendly: '4220 se clinton street'
  },
  {
    spoken: 'four hundred twenty se clinton ave',
    friendly: '420 se clinton ave'
  },
  {
    spoken: '4,220 se Clinton street',
    friendly: '4220 se clinton street'
  },
  {
    spoken: '410 TERRY AVE',
    friendly: '410 terry ave'
  }
];

testAddresses.map(addr => {
  test(`address: ${addr.spoken}`, () => {
    const friendlyAddress = parser.getFriendlyAddress(addr.spoken);
    expect(friendlyAddress).toEqual(addr.friendly);
  });
});

test('must start with house number', () => {
  expect(() => {
    const friendlyAddress = parser.getFriendlyAddress('lake drive');
    return friendlyAddress;
  }).toThrow(errors.START_WITH_NUMBER);
});

test('must have a street type', () => {
  expect(() => {
    const friendlyAddress = parser.getFriendlyAddress('123 lake');
    return friendlyAddress;
  }).toThrow(errors.NO_STREET_TYPE);
});