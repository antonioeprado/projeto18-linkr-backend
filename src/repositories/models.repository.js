export function validateBySchema(obj, schema, res) {
	const { error } = schema.validate(obj, { abortEarly: false });
	if (error) {
		const errors = error.details.map((detail) => detail.message);
		res.status(422).send(errors);
		return false;
	}
	return true;
}
