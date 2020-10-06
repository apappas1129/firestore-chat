import * as ImagePicker from 'expo-image-picker'

export default async function pickFromLibrary(
  options = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  }
) {
  let result = await ImagePicker.launchImageLibraryAsync(options)
  return result
}
