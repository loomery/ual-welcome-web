#!/usr/bin/env node
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

/**
 * This is a demo script to upload a large file to the LF Endpoint of filestore.
 * It should be run with Node.js.
 */

const API_KEY = process.env.DXP_ACCESS_KEY; // Read from environment variable
const TENANT_ID = process.env.DXP_TENANT_ID; // Read from environment variable
const DXP_URL = process.env.DXP_SERVER_URL; // Read from environment variable
const FS_ENDPOINT = '__dxp/service/file-storage/api/v2'; // This is the LF endpoint

// Define multiple files to upload
const FS_DIRECTORY = process.argv.includes('--dev')
  ? '/dev.arts.ac.uk/'
  : '/studentcentre.arts.ac.uk/';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = `${dir}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      const relativePath = filePath.replace('build/', '');
      const lastSlashIndex = relativePath.lastIndexOf('/');
      fileList.push({
        directory: lastSlashIndex > -1 ? relativePath.substring(0, lastSlashIndex + 1) : '',
        filename: lastSlashIndex > -1 ? relativePath.substring(lastSlashIndex + 1) : relativePath,
      });
    }
  });
  return fileList;
}

let FILES_TO_UPLOAD = fs.existsSync('build') ? getAllFiles('build') : [];

// Define multiple files to upload
FILES_TO_UPLOAD.push({
  directory: '',
  filename: 'student-centre.tar.gz',
  target: 'student-centre/',
});

/**
 * This is the main function that will be run when the script is executed.
 * It will upload multiple files to the large files endpoint.
 * It will process each file in sequence, making an initial request to get the file ID,
 * then streaming the file data in chunks, extracting it, and cleaning up.
 * The chunk size is set to 5MB.
 * The script will log the progress as it goes.
 * If there are any errors, they will be logged to the console.
 * A success message will be logged to the console if all files are uploaded successfully.
 */
(async () => {
  console.log(`Uploading ${FILES_TO_UPLOAD.length} files...`);

  try {
    for (let i = 0; i < FILES_TO_UPLOAD.length; i++) {
      const file = FILES_TO_UPLOAD[i];
      const fullPath = file.directory + file.filename;
      console.log(`\n--- Processing file ${i + 1}/${FILES_TO_UPLOAD.length}: ${fullPath} ---`);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.warn(`File ${fullPath} not found, skipping...`);
        continue;
      }

      const oldFileId = await doFindFile(FS_DIRECTORY, file.filename);

      if (oldFileId) {
        await doCleanup(oldFileId);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Make our initial request to the LF endpoint
      const { fileId } = await doInitialRequest(FS_DIRECTORY + file.filename);

      // Now we can start streaming the file data to the LF endpoint
      await doStreamRequests(fileId, file.filename);
      console.log(`File ${file.filename} uploaded successfully!`);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const directory = await doFindDirectory(FS_DIRECTORY, file.target);

      if (directory) {
        console.log(`Directory ${FS_DIRECTORY + file.target} found successfully!`);
        await doDirectoryCleanup(directory);
        console.log(`Directory ${FS_DIRECTORY + file.target} deleted successfully!`);
      } else {
        console.log(
          `No directory found for target ${FS_DIRECTORY + file.target}, skipping deletion`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));

      await doCreateDirectory(FS_DIRECTORY + file.target);
      console.log(`Directory ${FS_DIRECTORY + file.target} created successfully!`);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Extract the file
      await doExtract(fileId, FS_DIRECTORY + file.target);
      console.log(`File ${file.filename} extracted to ${FS_DIRECTORY + file.target} successfully!`);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Cleanup
      await doCleanup(fileId);
      console.log(`Cleanup for ${file.filename} completed!`);
    }

    console.log('\nAll files processed successfully!');
  } catch (error) {
    console.error('Error uploading files:', error);
    process.exit(1);
  }
})();

/**
 * This function will stream the file data to the LF endpoint in chunks.
 * @param fileId The file ID returned from the initial request
 * @param fileName The name of the file to upload
 */
async function doStreamRequests(fileId, fileName) {
  // Get the file size so we can calculate the number of chunks we need to send
  const { size } = fs.statSync(path.resolve('./', fileName));

  // Set the chunk size to 5MB
  const chunkSize = 5 * 1024 * 1024;

  // Calculate the number of chunks we need to send
  const numberOfChunks = Math.ceil(size / chunkSize);

  // Create a buffer to store the chunk data
  const buffer = Buffer.alloc(chunkSize);

  // Open the file for reading
  const file = fs.openSync(path.resolve('./', fileName), 'r');

  // Loop through the file and send the chunks
  for (let i = 0; i < numberOfChunks; i++) {
    // Read the chunk from the file
    const bytesRead = fs.readSync(file, buffer, 0, chunkSize, i * chunkSize);

    // Log the progress
    console.log(
      `Uploading chunk ${i + 1} of ${numberOfChunks} (${bytesRead} bytes) for ${fileName}`,
    );

    // Send the chunk to the LF endpoint
    await fetch(`${DXP_URL}/${FS_ENDPOINT}/file/${fileId}`, {
      method: 'PATCH',
      headers: {
        'x-api-key': API_KEY,
        'x-dxp-tenant': TENANT_ID,
        'content-type': 'application/octet-stream',
        'content-range': `bytes ${i * chunkSize}-${i * chunkSize + bytesRead - 1}/${size}`,
      },
      body: buffer.subarray(0, bytesRead),
    });
  }

  // Close the file
  fs.closeSync(file);
}

/**
 * This function will make the initial request to the LF endpoint to get the file ID.
 * @param fileName The name of the file to upload
 * @returns The response from the LF endpoint
 */
async function doInitialRequest(fileName) {
  // Make our initial request to the LF endpoint
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      uploadType: 'resumable',
      source: fileName,
      access: 'private',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create upload session for ${fileName}: ${response.statusText}`);
  }

  return await response.json();
}

async function doFindFile(directory, target) {
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file?source=${directory}`, {
    method: 'GET',
    headers: new Headers({
      'x-api-key': API_KEY ?? '',
      'x-dxp-tenant': TENANT_ID ?? '',
      'content-type': 'application/json',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file ${target}: ${response.statusText}`);
  }

  const files = await response.json();
  const file = files.find((file) => file.source === directory + target);
  return file ? file.fileId : null;
}

async function doPatch(fileId, content) {
  // Make a request to the LF endpoint to update the file
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file/${fileId}`, {
    method: 'PATCH',
    headers: new Headers({
      'x-api-key': API_KEY ?? '',
      'x-dxp-tenant': TENANT_ID ?? '',
      'content-type': 'application/json',
    }),
    body: JSON.stringify({
      access: 'public',
      data: content,
      uploadType: 'direct',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update file to ${fileId}: ${response.statusText}`);
  }

  return await response.json();
}

async function doPost(directory, content) {
  // Make a request to the LF endpoint to create the file
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file`, {
    method: 'POST',
    headers: new Headers({
      'x-api-key': API_KEY ?? '',
      'x-dxp-tenant': TENANT_ID ?? '',
      'content-type': 'application/json',
    }),
    body: JSON.stringify({
      access: 'public',
      data: content,
      uploadType: 'direct',
      source: directory,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create file to ${directory}: ${response.statusText}`);
  }

  return await response.json();
}

async function doFindDirectory(target, subTarget) {
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/directory?source=${target}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
      'content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch directory ${target}: ${response.statusText}`);
  }

  const directories = await response.json();
  const filtered = directories.filter((dir) => dir.source === target + subTarget);
  return filtered.length > 0 ? filtered[0] : null;
}

async function doDirectoryCleanup(directory) {
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/directory/${directory.directoryId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
      'content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete directory ${directory.source}: ${response.statusText}`);
  }

  return await response.json();
}

async function doCreateDirectory(target) {
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/directory`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      source: target,
      access: 'public',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create directory ${target}: ${response.statusText}`);
  }

  return await response.json();
}

async function doExtract(fileId, target) {
  // Make a request to the LF endpoint to extract the file
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file/${fileId}/extract`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      access: 'public',
      target: target,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to extract file to ${target}: ${response.statusText}`);
  }

  return await response.json();
}

async function doCleanup(fileId) {
  // Make a request to the LF endpoint to delete the file
  const response = await fetch(`${DXP_URL}/${FS_ENDPOINT}/file/${fileId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
      'x-dxp-tenant': TENANT_ID,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete file: ${response.statusText}`);
  }

  return await response.json();
}
