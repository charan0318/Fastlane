
const fs = require('fs');

// Read the w3cli configuration
const configPath = '.config/w3access/w3cli.json';

// Check if config file exists
if (!fs.existsSync(configPath)) {
  console.error('❌ Configuration file not found at:', configPath);
  console.log('Please make sure you have run `w3 login` and created a space');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract private key from config
const agentId = config.principal.id;
const privateKeyBytes = config.principal.keys[agentId]['$bytes'];
const privateKeyBuffer = new Uint8Array(privateKeyBytes);
const privateKeyBase64 = Buffer.from(privateKeyBuffer).toString('base64');

// Convert your provided proof to proper base64
const providedProof = "mAYIEAOkNEaJlcm9vdHOAZ3ZlcnNpb24B1wYBcRIgjh9+BxWqLwr5ESfn8D96syOSqCTbRvQhQ1R6dWqmPiyoYXNYRO2hA0AUH4+nODnOqRhAEHKJ7D/q4jc3ZaARvwdMjQobpbiADQJlEphwxLCc8gvgmUSMFhP2MqW298RIlMTsT/OlVN0CYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa2k4QjdRYVM5RldiWEs5WnN0WmhCREExQUJIbndjV1c4TEQ2Uzl6cmg1R3lxomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtpOEI3UWFTOUZXYlhLOVpzdFpoQkRBMUFCSG53Y1dXOExENlM5enJoNUd5caJjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa2k4QjdRYVM5RldiWEs5WnN0WmhCREExQUJIbndjV1c4TEQ2Uzl6cmg1R3lxomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa2k4QjdRYVM5RldiWEs5WnN0WmhCREExQUJIbndjV1c4TEQ2Uzl6cmg1R3lxomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtpOEI3UWFTOUZXYlhLOVpzdFpoQkRBMUFCSG53Y1dXOExENlM5enJoNUd5cWNhdWRYIu0BAubK/OA1ZUqRFygehuhCze0kgusTTRt8ccziK1X8B/BjZXhwGmpKndFjZmN0gaFlc3BhY2WhZG5hbWVoZmFzdGxhbmVjaXNzWCLtATaLIhnx7cxOUBvo8BntgA4H4WpwUQ/nAcPSW2CftfP8Y3ByZoD8BgFxEiBdd8rpFDvg5SHTl+9W3al/PNe8+ajQp7dlDMTo+6Pesahhc1hE7aEDQHhynmtUU1DS9VPm7RXiLhBzcYcHo8nH8VfD0Zu58XsK6uS/Q7ADpJgNDb/yibXAo5js1DXF9TEn4fb6ZvpqnAthdmUwLjkuMWNhdHSIomNjYW5nc3BhY2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtpOEI3UWFTOUZXYlhLOVpzdFpoQkRBMUFCSG53Y1dXOExENlM5enJoNUd5caJjY2FuZmJsb2IvKmR3aXRoeDhkaWQ6a2V5Ono2TWtpOEI3UWFTOUZXYlhLOVpzdFpoQkRBMUFCSG53Y1dXOExENlM5enJoNUd5caJjY2FuZ2luZGV4Lypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2NhbmdzdG9yZS8qZHdpdGh4OGRpZDprZXk6ejZNa2k4QjdRYVM5RldiWEs5WnN0WmhCREExQUJIbndjV1c4TEQ2Uzl6cmg1R3lxomNjYW5odXBsb2FkLypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2NhbmhhY2Nlc3MvKmR3aXRoeDhkaWQ6a2V5Ono2TWtpOEI3UWFTOUZXYlhLOVpzdFpoQkRBMUFCSG53Y1dXOExENlM5enJoNUd5caJjY2FuamZpbGVjb2luLypkd2l0aHg4ZGlkOmtleTp6Nk1raThCN1FhUzlGV2JYSzlac3RaaEJEQTFBQkhud2NXVzhMRDZTOXpyaDVHeXGiY2Nhbmd1c2FnZS8qZHdpdGh4OGRpZDprZXk6ejZNa2k4QjdRYVM5RldiWEs5WnN0WmhCREExQUJIbndjV1c4TEQ2Uzl6cmg1R3lxY2F1ZFgi7QE2iyIZ8e3MTlAb6PAZ7YAOB+FqcFEP5wHD0ltgn7Xz/GNleHD2Y2ZjdIGhZXNwYWNloWRuYW1laGZhc3RsYW5lY2lzc1gi7QEC5sr84DVlSpEXKB6G6ELN7SSC6xNNG3xxzOIrVfwH8GNwcmaB2CpYJQABcRIgjh9+BxWqLwr5ESfn8D96syOSqCTbRvQhQ1R6dWqmPiw";

// The fastlane space ID
const fastlaneSpaceId = 'did:key:z6Mki8B7QaS9FWbXK9ZstZhBDA1ABHnwcWW8LD6S9zrh5Gyq';

console.log('🔑 Web3.Storage Credentials for Fastlane Space');
console.log('===============================================\n');

console.log('Add these to your environment variables:\n');
console.log(`W3UP_PRIVATE_KEY=${privateKeyBase64}`);
console.log(`W3UP_PROOF=${providedProof}`);
console.log(`W3UP_SPACE=${fastlaneSpaceId}`);

console.log('\n✅ All credentials extracted successfully!');
console.log('📝 Copy these environment variables to configure your Web3.Storage client.');
