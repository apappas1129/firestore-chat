import { cloudStorage } from '../firebase/firebase.app'
/**
 * Uploads the file to a Firebase Cloud Storage service.
 * @param {string} uri Either a path or a Base64 string representing the binary data of the file to be uploaded.
 * @param {string} fileName The desired file name to be saved on Cloud Storage. Make sure this is unique. Otherwise, it will replace an existing file with the same name.
 * @param {Storage} storage The Cloud Storage application instance
 * @returns {UploadTask} Read more about {@link https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask firebase.storage.UploadTask}
 * @typedef {import ("firebase").storage.Storage} Storage
 * @typedef {import ("firebase").storage.UploadTask} UploadTask
 */
export default async function upload(uri, fileName, storage = cloudStorage) {
  // Why are we using XMLHttpRequest? See: https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      resolve(xhr.response)
    }
    xhr.onerror = function (e) {
      console.warn('An error occured when attempting to create a Blob.', e)
      reject(new TypeError('Network request failed'))
    }
    xhr.responseType = 'blob'
    xhr.open('GET', uri, true)
    xhr.send(null)
  })

  // Get's file extension (e.g. ".png" or ".jpg")
  const extension =
    '.' +
    (uri.startsWith('data:')
      ? uri.match(/[^:/]\w+(?=;|,)/)[0]
      : uri.split('.').pop())

  const task = storage
    .ref()
    .child('chat-images/' + fileName + extension)
    .put(blob)

  // We're done with the blob, close and release it.
  // TODO: Investigate about Blob .close function [TypeError: blob.close is not a function"]
  // https://github.com/w3c/FileAPI/issues/10
  // blob.close && blob.close()

  return task
}
