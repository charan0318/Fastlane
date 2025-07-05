
const fs = require('fs');

// If you have the binary data in a file
function convertProofToBase64(binaryFilePath) {
    try {
        // Read the binary file
        const binaryData = fs.readFileSync(binaryFilePath);
        
        // Convert to Base64
        const base64String = binaryData.toString('base64');
        
        console.log('Base64 Proof:');
        console.log(base64String);
        
        console.log('\nAdd this to your environment variables:');
        console.log(`W3UP_PROOF=${base64String}`);
        
        return base64String;
    } catch (error) {
        console.error('Error converting proof:', error.message);
    }
}

// If you have the binary data as a string/buffer
function convertBinaryStringToBase64(binaryString) {
    try {
        // Convert string to Buffer then to Base64
        const buffer = Buffer.from(binaryString, 'binary');
        const base64String = buffer.toString('base64');
        
        console.log('Base64 Proof:');
        console.log(base64String);
        
        console.log('\nAdd this to your environment variables:');
        console.log(`W3UP_PROOF=${base64String}`);
        
        return base64String;
    } catch (error) {
        console.error('Error converting proof:', error.message);
    }
}

// Usage examples:
// convertProofToBase64('path/to/your/proof.car');
// convertBinaryStringToBase64(yourBinaryString);

module.exports = { convertProofToBase64, convertBinaryStringToBase64 };
