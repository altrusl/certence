<template>
	<div class="hiw-container">
		<h2>Where to get more certification practice tests</h2>

		<p>
			Test questions are taken from other resources. At the moment, there
			is only an adapter for
			<a target="_blank" href="https://examtopics.com">
				<b>examtopics.com</b></a
			>
			- this website is probably the best in terms of material quality,
			and has questions for over 1000 certifications. Anyone can copy any
			practice test questions from examtopics.com to certence.com
			following the instructions below.
		</p>
		<p>
			You need to install <b>Certence Collector</b> - a special browser
			extension in your browser and navigate through all the pages of
			examtopics.com with the questions you want.
		</p>
		<p>
			The extension detects the certification, questions, and they
			immediately appear on certence.com
		</p>
		<p>
			The extension is a hundred lines of simple JavaScript code and can
			be easily checked for malware.
		</p>
		<h3>Chrome</h3>
		<p>
			Publishing an extension to the Chrome Web Store every time turns out
			to be a very painful procedure, so for the Chrome browser it needs
			to be done manually. Download
			<a href="https://certence.club/scripts/crx/crx.zip"
				>extension archive</a
			>&nbsp;and unzip it to an empty directory. Then:
		</p>
		<ol>
			<li>
				Open Extension Management page by clicking on the Chrome menu,
				hovering over More Tools then selecting Extensions.
			</li>
			<li>
				Enable Developer Mode by clicking the toggle switch next to
				Developer mode.
			</li>
			<li>
				Click the <b>Load Unpacked</b> button and select the extension
				directory.
			</li>
		</ol>
		<h3>Firefox</h3>
		<p>
			For Firefox -
			<a href="https://certence.club/scripts/crx/fx.xpi" rel="noopener"
				>click here</a
			>. The extension will be installed automatically. The same zip
			archive as for the Chrome, just with a different file extension and
			signed by Mozilla.
		</p>
		<p>
			After getting the needed questions, please disable or remove the
			extension to avoid generation of unnecessary Internet traffic
			(although it is activated only on examtopics.com).
		</p>
		<p>
			Be aware - suggested "correct" answers to questions from
			examtopics.com can be incorrect.
		</p>
	</div>
</template>

<script>
export default {
	name: "WhereToGetTests"
};
</script>

<style scoped>
.hiw-container {
	background-color: white;
}
a {
	color: #333;
}
b {
	color: #444;
}
</style>
