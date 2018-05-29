import Shape from 'shape.js';

const idShape = Shape.integer({min: 1});
const dateShape = Shape.regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
const dateTimeShape = Shape.regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T/);

const itemShape = Shape.object()
					.fields({
						id: idShape,
						name: Shape.string(),
						order: Shape.integer(),
						createdAt: dateTimeShape,
						updatedAt: dateTimeShape
					});

const itemsShape = Shape.arrayOf(itemShape);

const customerShape = Shape.object()
						.fields({
							id: idShape,
							name: Shape.any(),
							email: Shape.string(),
							simple_name: Shape.string(),
							createdAt: dateTimeShape,
							updatedAt: dateTimeShape
						});

const bookingShape = Shape.object()
						.fields({
							id: idShape,
							start: dateShape,
							end: dateShape,
							search_data: Shape.array(),
							createdAt: dateTimeShape,
							updatedAt: dateTimeShape,
							ItemId: idShape,
							CustomerId: idShape,
							Customer: customerShape,
							Item: itemShape
						});

const bookingsShape = Shape.arrayOf(bookingShape);

export { itemsShape, bookingShape, bookingsShape };