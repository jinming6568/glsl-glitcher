export default function (imgSrc) {
	return new Promise((resolve, reject) => {
		let oImage = new Image()
		oImage.onload = () => {
			resolve(oImage)
		}
		oImage.onerror = () => {
			reject(new Error('load error'))
		}
		oImage.src = imgSrc
	})
}
