<template>
	<div class="modal" v-show="value">
		<div class="container">
			<h2>Choose exam provider</h2>

			<multiselect
				v-model="certProvider"
				:options="certProviders"
				label="name"
			></multiselect>

			<ul class="cert-list">
				<li
					v-for="item in certificationsByProvider[
						certProvider.provider
					]"
					v-bind:key="item.certTitle"
					class="cert"
				>
					<p class="text">{{ item.certTitle }}</p>
				</li>
			</ul>

			<a @click.prevent="close" class="close">
				Close
			</a>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect";
export default {
	name: "ChooseExamModal",
	components: { Multiselect },
	data() {
		return {
			certProvider: {},
			certifications: [],
			certificationsByProvider: {}
		};
	},
	props: {
		value: {
			required: true
		}
	},
	methods: {
		close() {
			this.$emit("input", !this.value);
		}
	},
	watch: {
		certProvider: function(a, b) {
			// a = null when user selects some item again
			if (a == null) {
				this.certProvider = b;
			}
		}
	},
	computed: {
		certProviders: function() {
			this.certifications;
			return Object.keys(this.certificationsByProvider).map(p => {
				return {
					provider: p,
					name: this.certificationsByProvider[p][0].certProvider
				};
			});
		}
	},
	created() {
		fetch("certifications.json").then(response => {
			response.json().then(data => {
				this.certifications = data;
				this.certifications.forEach(cert => {
					this.certificationsByProvider[cert.certProviderSlug] =
						this.certificationsByProvider[cert.certProviderSlug] ||
						[];
					this.certificationsByProvider[cert.certProviderSlug].push(
						cert
					);
				});
				this.dummyCounter++;
			});
		});
	}
};
</script>

<style scoped>
.modal {
	background-color: rgba(0, 0, 0, 0.7);
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.container {
	background-color: white;
	max-width: 70%;
	width: 70%;
	height: 70%;
	padding: 1em 3em;
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.close {
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
}
.multiselect {
	width: 300px;
}
.cert-list {
	width: 100%;
}
</style>
