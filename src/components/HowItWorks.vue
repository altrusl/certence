<template>
	<div class="hiw-container">
		<h2>How it works</h2>

		<p>
			The best way to prepare for the certification exam is to
			<b>practice test questions over and over</b>
		</p>
		<p>
			But there are already lists of exam questions with answers on the
			Internet, why do we need something more?
		</p>

		<h3>We need it to make preparation effective</h3>

		<p>
			It can be assumed that an averagely trained user could confidently
			answer about 60% of the questions in the test question bank, for 30%
			he needs some research (but after going through them several times
			he will definitely remember them), and the remaining 10% are the
			tricky questions, they require additional study and investigation.
		</p>

		<p>
			The first type questions the user wants to go through once and then
			forget about them so that they no longer appear in the list and do
			not take up his attention and time.
		</p>

		<p>
			The second ones should be passed several times, and for the third
			ones the user needs a convenient space for notes, links and other
			stuff.
		</p>

		<p>This is how we come to <b>tags</b> and question <b>filtering</b></p>

		<p>
			There are three preset tags for test questions - "<b>Easy</b>",
			"<b>Complex</b>", "<b>Intricate</b>". User can create custom tags as
			well, for example - "Outdated", "Incorrect", "S3", "Persistence"
		</p>
		<p>
			It is possible to filter questions by several tags - for example, to
			show only "<b>Complex</b>" and "<b>S3</b>" questions
		</p>

		<h3>
			So how does it work?
		</h3>

		<p>
			A typical use-case would be: a user goes through all the questions
			once, applying tags. After that he forgets about "<b>Easy</b>"
			questions. If in the test there are, say, 300 questions, that means
			about 200 of them are filtered out. They will no longer take up user
			attention and time.
		</p>
		<p>
			Then he goes through "<b>Complex</b>" ones several times. And the
			"<b>Intricate</b>" questions he, perhaps, might even skip - if there
			are not so many of them and the passing score is low enough.
		</p>

		<h3>
			This approach saves a lot of time and effort during certification
			preparation
		</h3>
	</div>
</template>

<script>
export default {
	name: "HowItWorks",
	// data() {},
	props: {},
	methods: {}
};
</script>

<style scoped>
.hiw-container {
	background-color: white;
}
b {
	color: #444;
}
</style>
