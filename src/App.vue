<template>
	<NcHeaderMenu id="ncw_apps_menu"
				  class="ncwappsmenu"
				  :aria-label="t('core', 'Apps')"
				  @open="handleOpen">
		<template #trigger>
			<Apps class="ncwappsmenu__trigger-icon" :size="20" />
		</template>
		<div class="ncwappsmenu__menu">
			hello world
		</div>
	</NcHeaderMenu>
</template>

<script>
import NcHeaderMenu from '@nextcloud/vue/dist/Components/NcHeaderMenu.js'
import Apps from 'vue-material-design-icons/Apps.vue'

export default {
	name: 'NcwAppsMenu',
	components: {
		NcHeaderMenu,
		Apps,
	},
	methods: {
		async handleOpen() {
			console.log('handleOpen')
		},
	}
}
</script>

<style scoped lang="scss">
.ncwappsmenu {
	&__trigger-icon {
		color: var(--color-background-plain-text) !important;
	}
	&__menu {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: calc(50px * 6 + 2px + 26px);
		max-height: inherit;
	}
}
</style>
