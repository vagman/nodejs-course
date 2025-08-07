// Task 1: Read the dog breed from dog.txt and then make an HTTP request (https://dog.ceo/dog-api/) and fetch a2 dog image of that breed and save it in current directory.
import { readFile, writeFile } from 'node:fs/promises';

try {
  const dogBreed = await readFile('./dog.txt', 'utf-8');

  // Fetch random dog image
  const response = await fetch(
    `https://dog.ceo/api/breed/${dogBreed.trim()}/images/random`
  );
  if (!response.ok) throw new Error('Something went wrong!');

  // Extract JSON
  const data = await response.json();
  await writeFile('./dog-img.txt', data.message);
  console.log('Random dog image saved to file!');
} catch (error) {
  console.error('Error:', error);
}
