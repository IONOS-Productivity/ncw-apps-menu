<!--
  - SPDX-FileCopyrightText: 2025 STRATO GmbH
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcHeaderMenu id="ncw_apps_menu"
				  class="ncwappsmenu"
				  is-nav
				  :aria-label="t('core', 'Applications menu')"
				  @open="handleOpen">
		<template #trigger>
			<Apps class="ncwappsmenu__trigger-icon" :size="32" />
		</template>
		<div class="ncwappsmenu__menu">
			<div class="ncwappsmenu__grid">
				<div v-for="app in appsList"
					 :key="app.id"
					 class="ncwappsmenu__app-item">
					<a class="ncwappsmenu__app-icon"
						:href="app.href"
						:title="app.name"
						:aria-current="app.active ? 'page' : false"
						:target="app.target ? '_blank' : undefined"
						:rel="app.target ? 'noopener noreferrer' : undefined">
						<img :src="app.icon"
							 :alt="app.name"
							 :title="app.name"
							 class="ncwappsmenu__app-image" />
					</a>
					<span class="ncwappsmenu__app-name">{{ app.name }}</span>
				</div>
			</div>
		</div>
	</NcHeaderMenu>
</template>

<script lang="ts">
import type { INavigationEntry } from '../../types/navigation'
import Vue from 'vue'
import NcHeaderMenu from '@nextcloud/vue/dist/Components/NcHeaderMenu.js'
import Apps from 'vue-material-design-icons/Apps.vue'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'


export default Vue.extend({
	name: 'NcwAppsMenu',
	components: {
		NcHeaderMenu,
		Apps,
	},
	data() {
		const appsList = loadState<INavigationEntry[]>('core', 'apps', [])
		return {
			appsList,
		}
	},

	mounted() {
		subscribe('nextcloud:app-menu.refresh', this.setApps)
	},

	beforeDestroy() {
		unsubscribe('nextcloud:app-menu.refresh', this.setApps)
	},

	methods: {
		async handleOpen(): Promise<void> {
			console.log('Apps menu opened')
		},
		setApps({ apps }: { apps: INavigationEntry[]}) {
			console.log('Setting apps:', apps)
			this.appsList = apps
		},
		t
	}
})
</script>

<style scoped lang="scss">
.ncwappsmenu {
	&__trigger-icon {
		color: var(--color-background-plain-text) !important;
	}

	// Ensure proper sizing for the menu content
	:deep(.header-menu__content) {
		width: 320px !important;
		max-height: 400px;
		padding: 0 !important;
	}

	&__menu {
		padding: var(--default-grid-baseline);
		overflow: hidden;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		max-height: 312px; // Height for exactly 3 rows (96px + 12px gap) * 3 + padding
		overflow-y: auto;
		padding: 4px;

		// Custom scrollbar styling
		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: var(--color-background-hover);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--color-text-maxcontrast);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: var(--color-text-light);
		}
	}

	&__app-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px;
		border-radius: var(--border-radius-large);
		cursor: pointer;
		transition: background-color 0.2s ease;
		text-decoration: none;
		min-height: 96px;

		&:hover {
			background-color: var(--color-background-hover);
		}

		&:focus {
			outline: 2px solid var(--color-primary-element);
			outline-offset: 2px;
		}
	}

	&__app-icon {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 6px;
	}

	&__app-image {
		width: 64px;
		height: 64px;
		object-fit: contain;
		border-radius: var(--border-radius);
		color: var(--color-text-light);
		fill: var(--color-text-light);
		filter: var(--background-invert-if-bright);
	}

	&__app-name {
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-light);
		text-align: center;
		line-height: 1.2;
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
