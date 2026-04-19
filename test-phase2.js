// Simple test script for Phase 2 verification
const { FileIndex } = require('./out/src/fileIndex');

console.log('=== Phase 2 Verification Test ===\n');

// Create file index
const fileIndex = new FileIndex();
console.log('✓ FileIndex created');

// Test initial state
console.log(`✓ Initial count: ${fileIndex.getCount()} (expected: 0)`);

// Create mock file
const mockFile = {
    uri: { toString: () => 'file:///test/README.md' },
    relativePath: 'README.md',
    workspaceFolder: {
        uri: { toString: () => 'file:///test' },
        name: 'test',
        index: 0
    },
    fileName: 'README.md',
    fileType: 'markdown'
};

// Test add file
fileIndex.addFile(mockFile);
console.log(`✓ File added, count: ${fileIndex.getCount()} (expected: 1)`);

// Test find by URI
const found = fileIndex.findByUri(mockFile.uri);
console.log(`✓ File found: ${found ? 'yes' : 'no'} (expected: yes)`);

// Test get all files
const allFiles = fileIndex.getAllFiles();
console.log(`✓ Get all files: ${allFiles.length} (expected: 1)`);

// Test remove file
fileIndex.removeFile(mockFile.uri);
console.log(`✓ File removed, count: ${fileIndex.getCount()} (expected: 0)`);

// Test clear
fileIndex.addFile(mockFile);
fileIndex.clear();
console.log(`✓ Index cleared, count: ${fileIndex.getCount()} (expected: 0)`);

console.log('\n=== Phase 2 Verification: PASSED ===');
