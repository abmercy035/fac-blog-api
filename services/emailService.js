const { CourierClient } = require('@trycourier/courier');
require('dotenv').config();

const courier = new CourierClient({
	authorizationToken: process.env.COURIER_MAIL_TOKEN
});

const mail_content_type = {
	welcome: {
		title: 'Welcome to FAC!',
		body: `Dear {{name}},\n\nWelcome aboard! We're thrilled to have you join FAC.\n\nStay connected for our latest posts and updates.\n\nBest regards,\nFAC Team\n${process.env.FRONTEND_URL}`
	},
	newPost: {
		title: '{{title}}',
		body: `Hi {{name}},

The FAC has new post: **"{{title}}"**.

{{excerpt}}

**Read the full publication here:**
{{postUrl}}

Enjoy the read!

Best,
The FAC Team`
	}
};

const sendMail = async (email, data = {}, type) => {
	try {
		if (!mail_content_type[type]) {
			throw new Error(`Invalid email type: ${type}`);
		}

		const { requestId } = await courier.send(
			{
				message: {
					to: { email },
					content: mail_content_type[type],
					data,
					routing: {
						method: 'single',
						channels: ['email']
					}
				}
			},
			{ timeoutInSeconds: 45 }
		);

		console.log(`Email sent successfully to ${email} (${type}) - Request ID: ${requestId}`);
		return requestId;
	} catch (error) {
		console.error('Courier send email error:', error);
		throw error;
	}
};

const sendWelcomeEmail = async (email, name) => {
	return await sendMail(email, { name }, 'welcome');
};

const sendNewPostEmail = async (email, data = {}) => {
	return await sendMail(email, data, 'newPost');
};



const chunkArray = (array, size) => {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

const sendNewPostEmailToAll = async (recipients) => {
	const CHUNK_SIZE = 100;
	const chunks = chunkArray(recipients, CHUNK_SIZE);

	for (const chunk of chunks) {
		await sendNewPostEmailBulk(chunk);
	}

	console.log(`[Courier] All chunks processed. Total recipients: ${recipients.length}`);
};


const sendNewPostEmailBulk = async (recipients = []) => {
	try {
		if (!recipients.length) {
			throw new Error("Recipient list is empty.");
		}
		recipients.forEach((user) => {
			sendNewPostEmail(user.email, {
				name: user.name,
				title: user.title,
				excerpt: user.excerpt,
				postUrl: user.postUrl,
			})
		});

		console.log(`Email sent to users.`);

		return true;
	} catch (error) {
		console.error("Bulk sendNewPostEmail error:", error);
		throw error;
	}
};


module.exports = { sendMail, sendWelcomeEmail, sendNewPostEmail, sendNewPostEmailBulk, sendNewPostEmailToAll };
