const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const BlogPost = require('./models/BlogPost');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
	try {
		// Clear existing data
		await User.deleteMany({});
		await Category.deleteMany({});
		await BlogPost.deleteMany({});

		console.log('Cleared existing data...');

		// Create Admin User (who is also the author)
		const adminUser = await User.create({
			username: 'victory-atet',
			email: 'victoryatet@gmail.com',
			password: 'victory.atet2025',
			name: 'Victory Atet',
			role: 'admin',
			avatar: '/professional-woman-developer.png',
			title: 'Writer | Creative Strategist',
			bio: 'A versatile writer and creative strategist whose work spans poetry, essays, editorial content, and cultural commentary. Her writing explores themes of faith, identity, human complexity, and societal views.',
			social: {
				facebook: 'victory.atet',
				linkedin: 'victory-atet-writes'
			}
		});

		// Create Editor User (optional)


		console.log('Created users (who are also authors)...');

		// Create Categories
		const categories = await Category.create([
			{
				name: 'Poetry & Prose',
				description: 'Original poems and lyrical prose exploring humanity, spirituality, emotion, and imagination',
				slug: 'poetry-prose'
			},
			{
				name: 'Faith & Spirituality',
				description: 'Faith based writing, spiritual reflections, and critical views on religion and belief systems',
				slug: 'faith-spirituality'
			},
			{
				name: 'Culture & Society',
				description: 'Explorations of societal trends, cultural values, and the tensions between tradition and modernity',
				slug: 'culture-society'
			},
			{
				name: 'Essays & Reviews',
				description: 'Analytical pieces, cultural critique, social commentary, personal insights, and media/book reviews',
				slug: 'essays-reviews'
			}
		]);

		console.log('Created categories...');

		// Create Blog Posts
		await BlogPost.create([
			{
				title: 'When Faith Finds a Canvas',
				content: `# 🖋️ When Faith Finds a Canvas

Sometimes I think of faith as a quiet color — the kind that doesn't scream for attention, but once you notice it, you can't unsee it. It bleeds through the edges of everything we create. For me, art is the way faith speaks when words run out.

I've learned that artists of faith don't always paint crosses or angels. Sometimes their work simply carries a pulse — a rhythm of hope, tension, or redemption that feels divine. You see it in the way light hits a painting, or how a dancer holds a moment longer than expected. It's not about preaching; it's about revealing.

Faith and art share one thing: both ask us to believe in something unseen. Every brushstroke is a small act of trust — that color will blend, that the image will come alive. Maybe that's why God's first act was creation itself. In that moment, art and faith became forever linked.

Culture often tries to separate the two, but I think faith always finds a way back onto the canvas. Maybe not in obvious symbols, but in the spirit behind the work — the longing for meaning, beauty, and truth.`,
				excerpt: 'Sometimes I think of faith as a quiet color — the kind that doesn\'t scream for attention, but once you notice it, you can\'t unsee it.',
				author: adminUser._id,
				category: categories[0]._id,
				tags: ['Faith', 'Art', 'Creativity', 'Symbolism'],
				slug: 'when-faith-finds-a-canvas',
				featuredImage: '/placeholder.jpg',
				isPublished: true,
				publishedAt: new Date('2024-01-15')
			},
			{
				title: 'The Sacred in the Ordinary',
				content: `# 🎭 The Sacred in the Ordinary

I've stopped trying to find God only in church. I find Him in quiet cafes, in jazz improvisations, in old architecture that still holds its breath. Somewhere between the hum of traffic and the sound of rain, faith becomes real again.

Art has a way of slowing time — forcing us to notice what we'd normally ignore. Maybe that's what worship really is: paying attention. Every creative act, no matter how small, becomes sacred when done with intention.

We tend to think faith needs to be loud or miraculous, but most of the time it shows up subtly — like a lyric that hits deeper than expected or a photograph that says more than words ever could. That's the beauty of it. God hides in the details. We just need to look closer.

So the next time you feel uninspired, don't wait for something grand. Look around you. Creation is still happening — and maybe your art is part of that ongoing miracle.`,
				excerpt: 'I\'ve stopped trying to find God only in church. I find Him in quiet cafes, in jazz improvisations, in old architecture that still holds its breath.',
				author: adminUser._id,
				category: categories[0]._id,
				tags: ['Faith', 'Worship', 'Beauty', 'Creativity'],
				slug: 'the-sacred-in-the-ordinary',
				featuredImage: '/placeholder.jpg',
				isPublished: true,
				publishedAt: new Date('2024-01-12')
			},
			{
				title: 'Culture Without Wonder',
				content: `# 🕊️ Culture Without Wonder

I sometimes worry that culture is losing its sense of wonder. Everything feels fast, transactional, optimized. Art becomes content, and faith becomes branding. But where's the awe?

Wonder is the oxygen of both faith and creativity. Without it, belief becomes ritual, and art becomes noise. I think every artist's real job is to remind the world how to feel again — to make us stop, even for a second, and remember that there's more to life than what's visible.

Faith calls that transcendence; art calls it beauty. Either way, both point beyond ourselves. And maybe that's the kind of culture we need to rebuild — one where wonder is not lost, where mystery is not mocked, and where beauty still matters.

If you've ever created something and felt a spark of joy that words can't explain, that's wonder. Protect it. Our world desperately needs it.`,
				excerpt: 'I sometimes worry that culture is losing its sense of wonder. Everything feels fast, transactional, optimized.',
				author: adminUser._id,
				category: categories[1]._id,
				tags: ['Culture', 'Wonder', 'Society', 'Faith'],
				slug: 'culture-without-wonder',
				featuredImage: '/placeholder.jpg',
				isPublished: true,
				publishedAt: new Date('2024-01-08')
			}
		]);

		console.log('Created blog posts...');
		console.log('✅ Database seeded successfully!');
		console.log('\nTest Credentials:');
		console.log('Admin/Author - username: victory-atet, password: victory.atet2025');

		process.exit(0);
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	}
};

seedDatabase();
