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
		title: 'New post: {{title}}',
		body: `Hi {{name}}!,\n\nA new article has been published: "{{title}}"\n\n{{excerpt}}\n\nRead it now: {{postUrl}}\n\nIf you no longer wish to receive these alerts, update your preferences on the site.\n\nBest regards,\nFAC Team\n${process.env.FRONTEND_URL}`
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
  const CHUNK_SIZE = 1000;
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

		// 1. Create bulk job with event ID
		const { jobId } = await courier.bulk.createJob({
			message: {
				event: "8QMHPND76C4H1SGDDG0BGTJJ7MM9",  
				content: mail_content_type.newPost,
				routing: {
					method: "single",
					channels: ["email"],
				},
			},
		});

		console.log(`Courier bulk job created: ${jobId}`);

		// 2. Ingest users
		const users = recipients.map((user, index) => ({
			recipientId: `user-${index}-${Date.now()}`,
			profile: { email: user.email },
			data: {
				name: user.name,
				title: user.title,
				excerpt: user.excerpt,
				postUrl: user.postUrl,
			},
		}));

		await courier.bulk.ingestUsers(jobId, users);

		// 3. Run the job
		await courier.bulk.runJob(jobId);

		console.log(`Bulk email job ${jobId} started for ${recipients.length} users.`);
		return jobId;
	} catch (error) {
		console.error("Bulk sendNewPostEmail error:", error);
		throw error;
	}
};

 
module.exports = { sendMail, sendWelcomeEmail, sendNewPostEmail, sendNewPostEmailBulk, sendNewPostEmailToAll };
