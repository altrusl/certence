<template>
	<div class="container">
		<h2>Choose exam provider</h2>

		<div>
			<multiselect
				v-model="certProvider"
				:options="certProviders"
				label="name"
				selectLabel=""
				deselectLabel=""
				:preselectFirst="true"
			></multiselect>
			<div class="meter" :class="{ active: providerListIsLoading }">
				<span style="width:80%;"><span class="progress"></span></span>
			</div>
		</div>

		<ul class="cert-list">
			<li
				v-for="item in certificationsByProvider[certProvider.provider]"
				v-bind:key="item.certTitle"
				class="cert"
			>
				<router-link
					:to="{
						name: 'Exam',
						params: {
							certProvider: item.certProviderSlug,
							certSlug: item.examSlug
						}
					}"
					class="cert-link"
				>
					{{ item.certTitle }}
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import Vue from "vue";
import Multiselect from "vue-multiselect";
export default {
	name: "ChooseExamDialog",
	components: { Multiselect },
	data() {
		return {
			certProvider: {},
			certificationsByProvider: {},
			providerListIsLoading: false
		};
	},
	props: {},
	methods: {},
	watch: {
		certProvider: function(a, b) {
			// a = null when user selects current item again
			if (a == null) {
				this.certProvider = b;
			}
		}
	},
	computed: {
		certProviders: function() {
			return Object.keys(this.certificationsByProvider).map(p => {
				return {
					provider: p,
					name: this.certificationsByProvider[p][0].certProvider
				};
			});
		}
	},
	created() {
		this.providerListIsLoading = true;
		fetch("certifications.json").then(response => {
			response.json().then(data => {
				// this.certifications = data;
				data.forEach(cert => {
					// this.certificationsByProvider[cert.certProviderSlug] =
					// this.certificationsByProvider[cert.certProviderSlug] || [];
					if (!this.certificationsByProvider[cert.certProviderSlug]) {
						Vue.set(
							this.certificationsByProvider,
							cert.certProviderSlug,
							[]
						);
						this.providerListIsLoading = false;
					}
					this.certificationsByProvider[cert.certProviderSlug].push(
						cert
					);
				});
				this.certProvider = this.certProviders[0];
			});
		});
	}
};
</script>

<style scoped>
.container {
	background-color: white;
	/* max-width: 500px; */
	/* width: 70%; */
	/* height: 70%; */
	/* padding: 1em 3em; */
	/* border-radius: 2px; */
	display: flex;
	flex-direction: column;
	align-items: center;
	/* position: relative; */
}
/* .close {
	position: absolute;
	top: 0;
	right: 0;
	padding: 0.7em 1em;
	font-weight: bold;
	color: #666;
	cursor: pointer;
	transition: all 0.4s ease-in-out;
}
.close:hover {
	color: #222;
} */
.multiselect {
	width: 250px;
}
.cert-list {
	width: 100%;
}
.multiselect {
	border: 1px solid #999;
	margin-bottom: 7px;
}
.cert-link {
	text-decoration: none;
	padding-bottom: 10px;
	display: block;
	color: #666;
	font-family: Comfortaa;
	transition: color 0.3s ease-in-out;
}
.cert-link:hover {
	color: #111;
}

.meter.active {
	display: inherit;
}
.meter {
	height: 3px;
	position: relative;
	background: #eee;
	overflow: hidden;
	display: none;
}
.meter span {
	display: block;
	height: 100%;
}
.progress {
	background-color: #777;
	animation: progressBar 3s ease-in-out;
	animation-fill-mode: both;
}

@keyframes progressBar {
	0% {
		width: 0;
	}
	100% {
		width: 100%;
	}
}
</style>
