# Alexa Street Address
A node module to parse spoken street addresses into a common format

## Installing
```
npm install --save alexa-street-address
```
## Example
```javascript
const { getFriendlyAddress } = require('alexa-address-parser');

const spokenAddress = '123 northeast 30 first avenue';
try {
  const friendlyAddress = getFriendlyAddress(spokenAddress);
  // equals '123 northeast 31st avenue'
} catch (ex) {
  // format not recognized
}
```