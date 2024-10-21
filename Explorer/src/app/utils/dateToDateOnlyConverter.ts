export const toDateOnly = (date: Date) => {
	return date.toISOString().split('T')[0];
};
