require('dotenv').config()
const mongoose = require('mongoose');
const Dog = require('./models/Dog'); // Adjust path if necessary
const faker = require('faker');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
    seedDogs();
})
.catch((err) => {
    console.error("Connection error:", err);
});

async function seedDogs() {
    await Dog.deleteMany(); // Clears existing data (optional)

    const dogSizes = ['Small', 'Medium', 'Large'];
    const dogStatus = ['Available', 'Adopted', 'Fostered'];

    // Placeholder dog images (you can add more URLs or use your own hosted images)
    const placeholderImages = [
        'https://placedog.net/640/480?id=1',
        'https://placedog.net/640/480?id=2',
        'https://placedog.net/640/480?id=3',
        'https://placedog.net/640/480?id=4',
        'https://placedog.net/640/480?id=5',
        'https://placedog.net/640/480?id=6',
        'https://placedog.net/640/480?id=7',
        'https://placedog.net/640/480?id=8',
        'https://placedog.net/640/480?id=9',
        'https://placedog.net/640/480?id=10',
    ];

    const dogs = Array.from({ length: 100 }, () => ({
        name: faker.name.firstName(),
        breed: faker.animal.dog(),
        age: faker.datatype.number({ min: 1, max: 15 }),
        size: faker.helpers.randomize(dogSizes),
        color: faker.commerce.color(),
        vaccinated: faker.datatype.boolean(),
        adoptionStatus: faker.helpers.randomize(dogStatus),
        location: faker.address.city(),
        // Use a random placeholder image from the array instead of faker.image.animals()
        imageUrl: faker.helpers.randomize(placeholderImages),
        description: faker.lorem.sentence(),
    }));

    try {
        await Dog.insertMany(dogs);
        console.log("✅ 100 Dogs inserted successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.error("Insert error:", err);
    }
}
