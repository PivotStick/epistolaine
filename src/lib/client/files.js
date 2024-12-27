export const files = {
	/**
	 * @param {Blob} file
	 * @returns {Promise<string>}
	 */
	read(file) {
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onerror = reject;
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					resolve(reader.result);
				} else {
					reject({
						message: 'Result is not text',
						value: reader.result
					});
				}
			};

			reader.readAsDataURL(file);
		});
	}
};
